import { expectError, expectType } from "tsd";

import {
  asGoalId,
  asMediaId,
  asTemplateId,
  asUserId,
  asWithdrawalId,
  createTipplyClient,
  type CurrentUser,
  type Goal,
  type MediaFormats,
  type PaymentMethodsConfiguration,
  type PublicGoalWidget,
  type Tip,
  type UserPaymentMethod,
  type Withdrawal,
} from "..";
import { createTipplyPublicClient } from "../dist/public.js";

const client = createTipplyClient();
const publicClient = createTipplyPublicClient();

expectType<Promise<CurrentUser>>(client.me.get());
expectType<Promise<Goal[]>>(client.goals.list());
expectType<Promise<void>>(client.goals.id(asGoalId("goal-1")).reset());
expectType<Promise<void>>(
  client.templates.id(asTemplateId("template-1")).replace({
    title: "Template",
    editable: true,
    elementsOptions: {},
  }),
);
expectType<Promise<Tip[]>>(client.tips.list().filter("amount").search("abc").limit(20).get());
expectType<Promise<Withdrawal[]>>(client.withdrawals.list().status("accepted", "transferred").limit(10).get());
expectType<Promise<PaymentMethodsConfiguration>>(client.paymentMethods.configuration.get());
expectType<Promise<UserPaymentMethod>>(client.paymentMethods.method("paypal").update({ minimalAmount: 1500 }));
expectType<Promise<PublicGoalWidget>>(client.public.user(asUserId("user-1")).goals.id(asGoalId("goal-1")).widget.get());
expectType<Promise<boolean>>(publicClient.user(asUserId("user-1")).widgetMessage.get());
expectType<Promise<string>>(publicClient.user(asUserId("user-1")).templateFonts.get());
expectType<Promise<MediaFormats>>(client.media.id(asMediaId(1)).formats.get());
expectType<Promise<ArrayBuffer>>(client.withdrawals.id(asWithdrawalId("withdrawal-1")).confirmationPdf.get());

expectError(client.public.user(asGoalId("goal-1")));
expectError(client.goals.id(asUserId("user-1")));
expectError(client.media.id(asGoalId("goal-1")));
expectError(client.withdrawals.id(asGoalId("goal-1")));
