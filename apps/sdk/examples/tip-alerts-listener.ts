import { createTipplyClient } from "../src";
import { createTipplyPublicClient } from "../src/public";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;
const widgetUrl = process.env.TIPPLY_WIDGET_URL;

if (!authCookie && !widgetUrl) {
  throw new Error("Set either TIPPLY_AUTH_COOKIE or TIPPLY_WIDGET_URL.");
}

const listener = authCookie
  ? await createTipplyClient({
      session: {
        authCookie,
      },
    }).tipAlerts.createListener()
  : createTipplyPublicClient().tipAlerts.fromWidgetUrl(widgetUrl!);

listener.on("ready", () => {
  console.log(`Listening for donations on user ${listener.userId}`);
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
