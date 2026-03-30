import { execFileSync } from "node:child_process";

const tagName = process.env.TAG_NAME;

if (!tagName) {
  throw new Error("TAG_NAME environment variable is required.");
}

const releaseCommit = `${tagName}^`;

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function getPreviousTag() {
  const tags = git(["tag", "--merged", releaseCommit, "--sort=-creatordate"])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return tags[0] ?? null;
}

function formatSubject(subject) {
  const match = subject.match(/^(feat|fix)(?:\(([^)]+)\))?!?:\s*(.+)$/);

  if (!match) {
    return null;
  }

  const [, type, scope, description] = match;
  const label = scope ? `\`${scope}\`: ` : "";

  return {
    type,
    text: `${label}${description}`,
  };
}

const previousTag = getPreviousTag();
const range = previousTag ? `${previousTag}..${releaseCommit}` : releaseCommit;
const subjects = git(["log", "--reverse", "--format=%s", range])
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const groups = {
  feat: [],
  fix: [],
};

for (const subject of subjects) {
  const formatted = formatSubject(subject);

  if (!formatted) {
    continue;
  }

  groups[formatted.type].push(formatted.text);
}

const sections = [];

if (groups.feat.length > 0) {
  sections.push("### Features", ...groups.feat.map((item) => `- ${item}`), "");
}

if (groups.fix.length > 0) {
  sections.push("### Fixes", ...groups.fix.map((item) => `- ${item}`), "");
}

if (sections.length === 0) {
  sections.push("_No feat or fix commits in this release._");
}

process.stdout.write(`${sections.join("\n").trim()}\n`);
