/** Sort and filter modes accepted by the tips list builder. */
export type TipFilter = "default" | "amount" | "paymentMethod" | (string & {});

/** Query state accumulated by {@link TipsResource.list}. */
export interface TipsListQuery {
  limit?: number;
  offset?: number;
  filter?: TipFilter;
  search?: string;
}

/** Unstructured moderation queue item returned by Tipply. */
export type TipModerationItem = Record<string, unknown>;
/** Unstructured pending tip item returned by Tipply. */
export type PendingTip = Record<string, unknown>;
