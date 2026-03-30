import { z } from "zod";

import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { accountSchema, withdrawalMethodsConfigurationSchema, withdrawalSchema } from "../../domain/shared-schemas";
import type { Account, Withdrawal, WithdrawalMethodsConfiguration } from "../../domain/shared";
import type { WithdrawalStatusFilter, WithdrawalsListQuery } from "../../domain/withdrawals";
import { toWithdrawalStatusWire } from "../../domain/withdrawals";
import { requestAndParse } from "../request";

class WithdrawalAccountsResource {
  constructor(private readonly transport: TipplyTransport) {}

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

  status(...statuses: WithdrawalStatusFilter[]): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, statuses });
  }

  limit(limit: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, limit });
  }

  offset(offset: number): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport, { ...this.query, offset });
  }

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

export class WithdrawalsResource {
  readonly accounts: WithdrawalAccountsResource;
  readonly methods: WithdrawalMethodsResource;
  readonly latest: LatestWithdrawalsResource;

  constructor(private readonly transport: TipplyTransport) {
    this.accounts = new WithdrawalAccountsResource(transport);
    this.methods = new WithdrawalMethodsResource(transport);
    this.latest = new LatestWithdrawalsResource(transport);
  }

  list(): WithdrawalsListRequestBuilder {
    return new WithdrawalsListRequestBuilder(this.transport);
  }
}
