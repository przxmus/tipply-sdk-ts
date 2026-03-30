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

  /** Lists payout accounts available to the authenticated user. */
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

  /** Returns payout-method configuration metadata. */
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
  /** Payout-method configuration metadata. */
  readonly configuration: WithdrawalMethodsConfigurationResource;

  constructor(transport: TipplyTransport) {
    this.configuration = new WithdrawalMethodsConfigurationResource(transport);
  }
}

class LatestWithdrawalsResource {
  constructor(private readonly transport: TipplyTransport) {}

  /** Lists the most recent withdrawals. */
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

  /** Filters the withdrawal list by one or more statuses. */
  status(...statuses: WithdrawalStatusFilter[]): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, statuses });
  }

  /** Limits the number of withdrawals returned by the next `get()` call. */
  limit(limit: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  /** Skips the first `offset` withdrawals in the next `get()` call. */
  offset(offset: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, offset });
  }

  /** Executes the withdrawals list request with the accumulated filters. */
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

  /** Downloads the confirmation PDF for a withdrawal as an `ArrayBuffer`. */
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
  /** Confirmation PDF download for the selected withdrawal. */
  readonly confirmationPdf: WithdrawalConfirmationPdfResource;

  constructor(transport: TipplyTransport, withdrawalId: WithdrawalId) {
    this.confirmationPdf = new WithdrawalConfirmationPdfResource(transport, withdrawalId);
  }
}

export class WithdrawalsResource {
  /** Payout accounts. */
  readonly accounts: WithdrawalAccountsResource;
  /** Withdrawal method configuration metadata. */
  readonly methods: WithdrawalMethodsResource;
  /** Recently created withdrawals. */
  readonly latest: LatestWithdrawalsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.accounts = new WithdrawalAccountsResource(transport);
    this.methods = new WithdrawalMethodsResource(transport);
    this.latest = new LatestWithdrawalsResource(transport);
  }

  /** Starts a fluent request builder for listing withdrawals. */
  list(): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport);
  }

  /** Opens the scope for a specific withdrawal identifier. */
  id(withdrawalId: WithdrawalId): WithdrawalScope {
    return new WithdrawalScope(this.transport, withdrawalId);
  }
}
