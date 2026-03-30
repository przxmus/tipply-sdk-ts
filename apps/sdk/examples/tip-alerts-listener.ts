import { createTipplyClient } from "../src";
import { createTipplyPublicClient } from "../src/public";

const authCookie = process.env.TIPPLY_AUTH_COOKIE;
const widgetUrl = process.env.TIPPLY_WIDGET_URL;

if (!authCookie && !widgetUrl) {
  throw new Error("Set TIPPLY_AUTH_COOKIE or TIPPLY_WIDGET_URL before running this example.");
}

const listener = authCookie
  ? await createTipplyClient({
      authCookie,
    }).tipAlerts.createListener()
  : createTipplyPublicClient().tipAlerts.fromWidgetUrl(widgetUrl!);

listener.on("ready", () => {
  console.log(`Connected to TIP_ALERT for user ${listener.userId}`);
});

listener.on("donation", (donation) => {
  console.log(
    JSON.stringify(
      {
        id: donation.id,
        nickname: donation.nickname,
        amount: donation.amount,
        message: donation.message,
        createdAt: donation.createdAt,
      },
      null,
      2,
    ),
  );
});

listener.on("disconnect", (reason) => {
  console.log(`Socket disconnected: ${reason}`);
});

listener.on("error", (error) => {
  console.error("Socket error:", error);
});

const shutdown = () => {
  listener.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await listener.connect();
await new Promise(() => {});
