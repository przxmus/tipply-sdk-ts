import type { MinorUnitAmount, UnknownRecord } from "./shared";

/** Sort and filter modes accepted by the tips list builder. */
export type TipFilter = "default" | "amount" | "paymentMethod" | (string & {});

/** Query state accumulated by {@link TipsResource.list}. */
export interface TipsListQuery {
  limit?: number;
  offset?: number;
  filter?: TipFilter;
  search?: string;
}

/** Input payload accepted by `client.tips.sendTest()`. */
export interface SendTestTipInput {
  message: string;
  amount: MinorUnitAmount;
}

/** Raw response payload returned by `client.tips.sendTest()`. */
export type SendTestTipResult = UnknownRecord;

/**
 * Serializes a test tip payload into Tipply's wire format.
 *
 * @param input - The test tip input to serialize.
 * @returns A wire-format object ready to send to Tipply.
 */
export function toSendTestTipWire(input: SendTestTipInput): SendTestTipResult {
  return {
    message: input.message,
    amount: input.amount,
  };
}

/** Unstructured moderation queue item returned by Tipply. */
export type TipModerationItem = Record<string, unknown>;
/** Unstructured pending tip item returned by Tipply. */
export type PendingTip = Record<string, unknown>;
