import { createTipplyClient } from "../src";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;

if (!authCookie) {
  throw new Error("Set TIPPLY_AUTH_COOKIE before running this example.");
}

const client = createTipplyClient({
  authCookie,
});

const profile = await client.profile.public("przxmus").get();

console.log({
  nickName: profile.nickName,
  themeColor: profile.themeColor,
  voiceMessageMinimalAmount: profile.voiceMessageMinimalAmount,
});
