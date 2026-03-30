import { z } from "zod";

import { asGoalId, asPaymentId, asTipId, asUserId } from "./ids";
import { isoDateStringSchema, minorUnitAmountSchema } from "./parsing";
import type { TipAlertDonation } from "./alerts";

export const tipAlertDonationSchema = z
  .object({
    receiver_id: z.string(),
    nickname: z.string(),
    email: z.string(),
    message: z.string().nullish(),
    amount: minorUnitAmountSchema,
    commission: minorUnitAmountSchema,
    test: z.boolean(),
    resent: z.boolean(),
    source: z.string(),
    payment_id: z.string().nullish(),
    audio_url: z.string().nullish(),
    goal_id: z.string().nullish(),
    moderated_at: isoDateStringSchema.nullish(),
    id: z.string(),
    created_at: isoDateStringSchema,
    goal_title: z.string().nullish(),
    tts_nickname_google_female: z.string().nullish(),
    tts_message_google_female: z.string().nullish(),
    tts_amount_google_female: z.string().nullish(),
  })
  .passthrough()
  .transform<TipAlertDonation>((wire) => ({
    id: asTipId(wire.id),
    receiverId: asUserId(wire.receiver_id),
    nickname: wire.nickname,
    email: wire.email,
    ...(wire.message !== undefined ? { message: wire.message } : {}),
    amount: wire.amount,
    commission: wire.commission,
    test: wire.test,
    resent: wire.resent,
    source: wire.source,
    ...(wire.payment_id !== undefined
      ? { paymentId: wire.payment_id === null ? null : asPaymentId(wire.payment_id) }
      : {}),
    ...(wire.audio_url !== undefined ? { audioUrl: wire.audio_url } : {}),
    ...(wire.goal_id !== undefined ? { goalId: wire.goal_id === null ? null : asGoalId(wire.goal_id) } : {}),
    ...(wire.moderated_at !== undefined ? { moderatedAt: wire.moderated_at } : {}),
    createdAt: wire.created_at,
    ...(wire.goal_title !== undefined ? { goalTitle: wire.goal_title } : {}),
    ...(wire.tts_nickname_google_female !== undefined
      ? { ttsNicknameGoogleFemale: wire.tts_nickname_google_female }
      : {}),
    ...(wire.tts_message_google_female !== undefined ? { ttsMessageGoogleFemale: wire.tts_message_google_female } : {}),
    ...(wire.tts_amount_google_female !== undefined ? { ttsAmountGoogleFemale: wire.tts_amount_google_female } : {}),
    raw: { ...wire },
  }));

export function parseTipAlertDonation(value: unknown): TipAlertDonation {
  return tipAlertDonationSchema.parse(value);
}
