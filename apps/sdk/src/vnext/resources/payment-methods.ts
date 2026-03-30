import type { RequestOptions } from "../../core/types";
import { TipplyTransport } from "../../core/transport";
import { paymentMethodsConfigurationSchema, userPaymentMethodSchema, userPaymentMethodsSchema } from "../../domain/shared-schemas";
import type { PaymentMethodKey, PaymentMethodsConfiguration, UpdatePaymentMethodInput, UserPaymentMethod, UserPaymentMethods } from "../../domain/shared";
import { requestAndParse } from "../request";

class PaymentMethodsConfigurationResource {
  constructor(private readonly transport: TipplyTransport) {}

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

  method(methodKey: PaymentMethodKey): PaymentMethodScope {
    return new PaymentMethodScope(this.transport, methodKey);
  }
}
