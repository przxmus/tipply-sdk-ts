import { asUserId } from "../src";
import { createTipplyPublicClient } from "../src/public";

const userId = process.env.TIPPLY_USER_ID;

if (!userId) {
  throw new Error("Set TIPPLY_USER_ID to the Tipply user ID used by the TIP_ALERT widget.");
}

const client = createTipplyPublicClient();
const listener = client.user(asUserId(userId)).tipAlerts.createListener();

listener.on("ready", () => {
  console.log(`Listening for donations on user ${userId}`);
});

listener.on("donation", (donation) => {
  console.log("Received donation:", donation);
});

listener.on("disconnect", (reason) => {
  console.log("Tip alerts socket disconnected:", reason);
});

listener.on("error", (error) => {
  console.error("Tip alerts socket error:", error);
});

const shutdown = () => {
  listener.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await listener.connect();
await new Promise(() => {});
