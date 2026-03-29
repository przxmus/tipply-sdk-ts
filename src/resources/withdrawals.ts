import { assertArray, assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type { AccountRecord, ListWithdrawalsQuery, WithdrawalMethodsConfiguration, WithdrawalRecord } from "../types/withdrawals";

function assertAccounts(value: unknown): asserts value is AccountRecord[] {
  assertArray(value, { method: "GET", url: "/user/accounts" });
}

function assertWithdrawals(value: unknown): asserts value is WithdrawalRecord[] {
  assertArray(value, { method: "GET", url: "/user/withdrawals" });
}

function assertWithdrawalMethodsConfiguration(value: unknown): asserts value is WithdrawalMethodsConfiguration {
  assertPlainObject(value, { method: "GET", url: "/withdrawal-methods-configuration" });
}

export class WithdrawalsApi {
  constructor(private readonly httpClient: HttpClient) {}

  getAccounts(): Promise<AccountRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/accounts",
      requiresAuth: true,
      validator: assertAccounts,
    });
  }

  getMethodsConfiguration(): Promise<WithdrawalMethodsConfiguration> {
    return this.httpClient.request({
      method: "GET",
      path: "/withdrawal-methods-configuration",
      requiresAuth: true,
      validator: assertWithdrawalMethodsConfiguration,
    });
  }

  getLatest(): Promise<WithdrawalRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/withdrawals/latest",
      requiresAuth: true,
      validator: assertWithdrawals,
    });
  }

  list(query: ListWithdrawalsQuery = {}): Promise<WithdrawalRecord[]> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/withdrawals",
      query: {
        "status[]": query.statuses,
        limit: query.limit,
        offset: query.offset,
      },
      requiresAuth: true,
      validator: assertWithdrawals,
    });
  }
}
