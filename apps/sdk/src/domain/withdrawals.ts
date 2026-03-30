/** Supported status filters for the withdrawals list builder. */
export type WithdrawalStatusFilter = "accepted" | "transferred" | (string & {});

/** Query state accumulated by the withdrawals list request builder. */
export interface WithdrawalsListQuery {
  statuses?: readonly WithdrawalStatusFilter[];
  limit?: number;
  offset?: number;
}

/** Converts a user-friendly status filter into Tipply's uppercase wire format. */
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
