import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { accountSchema, withdrawalMethodsConfigurationSchema, withdrawalSchema } from "../../domain/shared-schemas";
import type { Account, Withdrawal, WithdrawalMethodsConfiguration } from "../../domain/shared";
import type { WithdrawalStatusFilter, WithdrawalsListQuery } from "../../domain/withdrawals";
import { toWithdrawalStatusWire } from "../../domain/withdrawals";
import { requestAndParse } from "../request";
import type { WithdrawalId } from "../../domain/ids";

class WithdrawalAccountsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Lists payout accounts available to the authenticated user.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The payout accounts returned by Tipply.
   */
  list(requestOptions?: RequestOptions): Promise<Account[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/accounts",
        auth: true,
      },
      z.array(accountSchema),
      requestOptions,
      "Invalid withdrawal accounts response.",
    );
  }
}

class WithdrawalMethodsConfigurationResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Loads withdrawal method configuration metadata.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The withdrawal method configuration returned by Tipply.
   */
  get(requestOptions?: RequestOptions): Promise<WithdrawalMethodsConfiguration> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/withdrawal-methods-configuration",
        auth: true,
      },
      withdrawalMethodsConfigurationSchema,
      requestOptions,
      "Invalid withdrawal methods configuration response.",
    );
  }
}

class WithdrawalMethodsResource {
  readonly configuration: WithdrawalMethodsConfigurationResource;

  constructor(transport: TipplyTransport) {
    this.configuration = new WithdrawalMethodsConfigurationResource(transport);
  }
}

class LatestWithdrawalsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Lists the most recent withdrawals.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns Recent withdrawal records returned by Tipply.
   */
  list(requestOptions?: RequestOptions): Promise<Withdrawal[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/withdrawals/latest",
        auth: true,
      },
      z.array(withdrawalSchema),
      requestOptions,
      "Invalid latest withdrawals response.",
    );
  }
}

class WithdrawalsListRequestBuilder {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly query: WithdrawalsListQuery = {},
  ) {}

  /**
   * Filters the list by one or more withdrawal statuses.
   *
   * @param statuses - The statuses to include in the next request.
   * @returns A new immutable builder with the selected statuses applied.
   */
  status(...statuses: WithdrawalStatusFilter[]): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, statuses });
  }

  /**
   * Limits the number of withdrawals returned by the next request.
   *
   * @param limit - Maximum number of withdrawals to request.
   * @returns A new immutable builder with the limit applied.
   */
  limit(limit: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  /**
   * Skips the first items returned by the endpoint.
   *
   * @param offset - Number of items to skip.
   * @returns A new immutable builder with the offset applied.
   */
  offset(offset: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, offset });
  }

  /**
   * Executes the withdrawals list request.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The list of withdrawals that match the accumulated filters.
   */
  get(requestOptions?: RequestOptions): Promise<Withdrawal[]> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/withdrawals",
        query: {
          "status[]": this.query.statuses?.map(toWithdrawalStatusWire),
          limit: this.query.limit,
          offset: this.query.offset,
        },
        auth: true,
      },
      z.array(withdrawalSchema),
      requestOptions,
      "Invalid withdrawals response.",
    );
  }
}

class WithdrawalConfirmationPdfResource {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly withdrawalId: WithdrawalId,
  ) {}

  /**
   * Downloads the confirmation PDF for a withdrawal.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns An `ArrayBuffer` containing the PDF bytes.
   */
  get(requestOptions?: RequestOptions): Promise<ArrayBuffer> {
    return this.transport.request(
      {
        method: "GET",
        path: `/bank/print-confirmation/${this.withdrawalId}/pdf`,
        auth: true,
        headers: {
          Accept: "application/pdf",
        },
        responseType: "arrayBuffer",
      },
      requestOptions,
    ) as Promise<ArrayBuffer>;
  }
}

class WithdrawalScope {
  readonly confirmationPdf: WithdrawalConfirmationPdfResource;

  constructor(transport: TipplyTransport, withdrawalId: WithdrawalId) {
    this.confirmationPdf = new WithdrawalConfirmationPdfResource(transport, withdrawalId);
  }
}

export class WithdrawalsResource {
  readonly accounts: WithdrawalAccountsResource;
  readonly methods: WithdrawalMethodsResource;
  readonly latest: LatestWithdrawalsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.accounts = new WithdrawalAccountsResource(transport);
    this.methods = new WithdrawalMethodsResource(transport);
    this.latest = new LatestWithdrawalsResource(transport);
  }

  /**
   * Starts a fluent builder for listing withdrawals.
   *
   * @returns A new immutable withdrawals list request builder.
   */
  list(): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport);
  }

  /**
   * Opens the scope for a single withdrawal.
   *
   * @param withdrawalId - The Tipply withdrawal identifier.
   * @returns A scoped helper for the selected withdrawal.
   */
  id(withdrawalId: WithdrawalId): WithdrawalScope {
    return new WithdrawalScope(this.transport, withdrawalId);
  }
}
