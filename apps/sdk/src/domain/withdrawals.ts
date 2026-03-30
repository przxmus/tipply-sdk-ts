export type WithdrawalStatusFilter = "accepted" | "transferred" | (string & {});

export interface WithdrawalsListQuery {
  statuses?: readonly WithdrawalStatusFilter[];
  limit?: number;
  offset?: number;
}

export function toWithdrawalStatusWire(status: WithdrawalStatusFilter): string {
  switch (status) {
    case "accepted":
      return "ACCEPTED";
    case "transferred":
      return "TRANSFERRED";
    default:
      return status.toUpperCase();
  }
}
