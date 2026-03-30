import { createTipplyClient } from "../src";

const client = createTipplyClient({
  session: {
    getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
  },
});

await client.paymentMethods.method("cashbill_blik").update({
  minimalAmount: 10000,
});
