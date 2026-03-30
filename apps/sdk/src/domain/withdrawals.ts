/** Status filters accepted by the withdrawals list builder. */
export type WithdrawalStatusFilter = "accepted" | "transferred" | (string & {});

/** Query state accumulated by {@link WithdrawalsResource.list}. */
export interface WithdrawalsListQuery {
  statuses?: readonly WithdrawalStatusFilter[];
  limit?: number;
  offset?: number;
}

/**
 * Converts a withdrawals status filter into the wire format expected by Tipply.
 *
 * @param status - The user-facing status filter.
 * @returns The uppercase wire value sent to Tipply.
 */
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
