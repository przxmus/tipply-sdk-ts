import { expectError, expectType } from "tsd";

import {
  asGoalId,
  asMediaId,
  asTemplateId,
  asTipId,
  asUserId,
  asWithdrawalId,
  createTipplyClient,
  type CurrentUser,
  type Goal,
  type MediaFormats,
  type PaymentMethodsConfiguration,
  type PublicGoalWidget,
  type PublicTemplate,
  type TipAlertDonation,
  type TipAlertsListener,
  type Tip,
  type TipsGoalTemplateConfig,
  type UserPaymentMethod,
  type Withdrawal,
} from "..";
import { createTipplyPublicClient } from "../dist/public.js";

const client = createTipplyClient();
const publicClient = createTipplyPublicClient();

expectType<Promise<CurrentUser>>(client.me.get());
expectType<Promise<TipAlertsListener>>(client.tipAlerts.createListener());
expectType<Promise<Goal[]>>(client.goals.list());
expectType<Promise<void>>(client.goals.id(asGoalId("goal-1")).reset());
expectType<Promise<void>>(client.tipAlerts.skipCurrent());
expectType<Promise<void>>(
  client.templates.id(asTemplateId("template-1")).replace({
    title: "Template",
    editable: true,
    elementsOptions: {},
  }),
);
expectType<Promise<Tip[]>>(client.tips.list().filter("amount").search("abc").limit(20).get());
expectType<Promise<void>>(client.tips.id(asTipId("tip-1")).resend());
expectType<Promise<Withdrawal[]>>(client.withdrawals.list().status("accepted", "transferred").limit(10).get());
expectType<Promise<PaymentMethodsConfiguration>>(client.paymentMethods.configuration.get());
expectType<Promise<UserPaymentMethod>>(client.paymentMethods.method("paypal").update({ minimalAmount: 1500 }));
expectType<Promise<PublicGoalWidget>>(client.public.user(asUserId("user-1")).goals.id(asGoalId("goal-1")).widget.get());
expectType<Promise<boolean>>(publicClient.user(asUserId("user-1")).widgetMessage.get());
expectType<Promise<string>>(publicClient.user(asUserId("user-1")).templateFonts.get());
expectType<Promise<PublicTemplate<"TIPS_GOAL", TipsGoalTemplateConfig>[]>>(publicClient.user(asUserId("user-1")).goals.templates.list());
expectType<TipAlertsListener>(publicClient.user(asUserId("user-1")).tipAlerts.createListener());
expectType<TipAlertsListener>(publicClient.tipAlerts.fromWidgetUrl("https://widgets.tipply.pl/TIP_ALERT/user-1"));
expectType<TipAlertsListener>(client.tipAlerts.fromWidgetUrl("https://widgets.tipply.pl/TIP_ALERT/user-1"));
expectType<Promise<MediaFormats>>(client.media.id(asMediaId(1)).formats.get());
expectType<Promise<ArrayBuffer>>(client.withdrawals.id(asWithdrawalId("withdrawal-1")).confirmationPdf.get());

const tipAlertsListener = publicClient.user(asUserId("user-1")).tipAlerts.createListener();

expectType<Promise<void>>(tipAlertsListener.connect());
tipAlertsListener.on("donation", (donation) => {
  expectType<TipAlertDonation>(donation);
});
tipAlertsListener.on("error", (error) => {
  expectType<Error>(error);
});
expectError(tipAlertsListener.on("unknown", () => {}));

expectError(client.public.user(asGoalId("goal-1")));
expectError(client.goals.id(asUserId("user-1")));
expectError(client.media.id(asGoalId("goal-1")));
expectError(client.withdrawals.id(asGoalId("goal-1")));
