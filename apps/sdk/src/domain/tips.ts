export type TipFilter = "default" | "amount" | "paymentMethod" | (string & {});

export interface TipsListQuery {
  limit?: number;
  offset?: number;
  filter?: TipFilter;
  search?: string;
}

export type TipModerationItem = Record<string, unknown>;
export type PendingTip = Record<string, unknown>;
