import type {
  CreatePaymentInput,
  PaymentCallbackResult,
  PaymentInitiation,
  PaymentProvider,
  RefundResult,
} from "./types";

/**
 * Cash on delivery / pay-later provider. Useful as a fallback when no online
 * gateway is configured and for local testing.
 */
export class CodProvider implements PaymentProvider {
  readonly id = "cod" as const;
  readonly name = "Cash on Delivery";

  isConfigured(): boolean {
    return true;
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentInitiation> {
    return {
      kind: "pending",
      reference: input.orderNumber,
      message:
        "Your order is placed. Please have the payment ready on delivery.",
    };
  }

  async verifyPayment(payload: unknown): Promise<PaymentCallbackResult> {
    const data = (payload ?? {}) as Record<string, unknown>;
    return {
      orderNumber: String(data.orderNumber ?? data.reference ?? ""),
      reference: String(data.reference ?? ""),
      success: true,
      status: "pending",
      amount: data.amount ? Number(data.amount) : undefined,
      raw: payload,
    };
  }

  async handleCallback(payload: unknown): Promise<PaymentCallbackResult> {
    return this.verifyPayment(payload);
  }

  async refundPayment(reference: string): Promise<RefundResult> {
    return { success: true, reference, message: "Marked as refunded" };
  }
}
