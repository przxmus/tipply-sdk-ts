import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { paymentMethodsConfigurationSchema, userPaymentMethodSchema, userPaymentMethodsSchema } from "../../domain/shared-schemas";
import type { PaymentMethodKey, PaymentMethodsConfiguration, UpdatePaymentMethodInput, UserPaymentMethod, UserPaymentMethods } from "../../domain/shared";
import { requestAndParse } from "../request";

class PaymentMethodsConfigurationResource {
  constructor(private readonly transport: TipplyTransport) {}

  /**
   * Loads payment method configuration metadata.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The payment method configuration returned by Tipply.
   */
  get(requestOptions?: RequestOptions): Promise<PaymentMethodsConfiguration> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/payment-methods-configuration",
        auth: true,
      },
      paymentMethodsConfigurationSchema,
      requestOptions,
      "Invalid payment methods configuration response.",
    );
  }
}

class PaymentMethodScope {
  constructor(
    private readonly transport: TipplyTransport,
    private readonly methodKey: PaymentMethodKey,
  ) {}

  /**
   * Updates a single payment method entry.
   *
   * @param input - The toggle or minimum amount update to apply.
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns The updated payment method entry.
   */
  update(input: UpdatePaymentMethodInput, requestOptions?: RequestOptions): Promise<UserPaymentMethod> {
    return requestAndParse(
      this.transport,
      {
        method: "POST",
        path: `/user/payment-methods/${this.methodKey}`,
        body: input,
        auth: true,
      },
      userPaymentMethodSchema,
      requestOptions,
      "Invalid payment method update response.",
    );
  }
}

export class PaymentMethodsResource {
  readonly configuration: PaymentMethodsConfigurationResource;

  constructor(private readonly transport: TipplyTransport) {
    this.configuration = new PaymentMethodsConfigurationResource(transport);
  }

  /**
   * Lists the authenticated user's configured payment methods.
   *
   * @param requestOptions - Per-request timeout and abort overrides.
   * @returns A map of payment method entries keyed by Tipply payment method name.
   */
  list(requestOptions?: RequestOptions): Promise<UserPaymentMethods> {
    return requestAndParse(
      this.transport,
      {
        method: "GET",
        path: "/user/payment-methods",
        auth: true,
      },
      userPaymentMethodsSchema,
      requestOptions,
      "Invalid user payment methods response.",
    );
  }

  /**
   * Opens the scope for a single payment method.
   *
   * @param methodKey - The Tipply payment method key to update.
   * @returns A scoped helper for the selected payment method.
   */
  method(methodKey: PaymentMethodKey): PaymentMethodScope {
    return new PaymentMethodScope(this.transport, methodKey);
  }
}
