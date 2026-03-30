import { asTipId, createTipplyClient } from "../src";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;
const tipId = process.env.TIPPLY_TIP_ID;

if (!authCookie || !tipId) {
  throw new Error("Set TIPPLY_AUTH_COOKIE and TIPPLY_TIP_ID before running this example.");
}

const client = createTipplyClient({
  authCookie,
});

await client.tips.id(asTipId(tipId)).resend();
await client.tipAlerts.skipCurrent();

console.log(`Resent tip ${tipId} and skipped the currently visible tip alert.`);
