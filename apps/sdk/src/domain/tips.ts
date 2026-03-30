/** Supported sort and filter modes for the tips list builder. */
export type TipFilter = "default" | "amount" | "paymentMethod" | (string & {});

/** Query state accumulated by the tips list request builder. */
export interface TipsListQuery {
  limit?: number;
  offset?: number;
  filter?: TipFilter;
  search?: string;
}

/** Raw moderation queue item returned by Tipply. */
export type TipModerationItem = Record<string, unknown>;
/** Raw pending tip item returned by Tipply. */
export type PendingTip = Record<string, unknown>;
