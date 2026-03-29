import { assertPlainObject } from "../core/runtime";
import type { HttpClient } from "../core/http";
import type {
  PaymentMethodConfigurationEntry,
  PaymentMethodKey,
  PaymentMethodsConfiguration,
  UpdatePaymentMethodRequest,
  UserPaymentMethod,
  UserPaymentMethods,
} from "../types/payments";

function assertPaymentMethodsConfiguration(value: unknown): asserts value is PaymentMethodsConfiguration {
  assertPlainObject(value, { method: "GET", url: "/payment-methods-configuration" });
}

function assertUserPaymentMethods(value: unknown): asserts value is UserPaymentMethods {
  assertPlainObject(value, { method: "GET", url: "/user/payment-methods" });
}

function assertUserPaymentMethod(value: unknown): asserts value is UserPaymentMethod {
  assertPlainObject(value, { method: "POST", url: "/user/payment-methods/{method}" });
}

export class PaymentMethodsApi {
  constructor(private readonly httpClient: HttpClient) {}

  getConfiguration(): Promise<PaymentMethodsConfiguration> {
    return this.httpClient.request({
      method: "GET",
      path: "/payment-methods-configuration",
      requiresAuth: true,
      validator: assertPaymentMethodsConfiguration,
    });
  }

  getUserMethods(): Promise<UserPaymentMethods> {
    return this.httpClient.request({
      method: "GET",
      path: "/user/payment-methods",
      requiresAuth: true,
      validator: assertUserPaymentMethods,
    });
  }

  update(method: PaymentMethodKey, payload: UpdatePaymentMethodRequest): Promise<UserPaymentMethod> {
    return this.httpClient.request({
      method: "POST",
      path: `/user/payment-methods/${method}`,
      body: payload,
      requiresAuth: true,
      validator: assertUserPaymentMethod,
    });
  }
}
