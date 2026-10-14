import type {
  CreatePaymentInput,
  PaymentCallbackResult,
  PaymentInitiation,
  PaymentProvider,
  RefundResult,
} from "./types";

/**
 * Koko (Sri Lanka - buy now, pay later) provider.
 * https://developers.kokopay.io
 *
 * The integration is intentionally thin and isolated here so the rest of the
 * application never talks to Koko directly.
 */
export class KokoProvider implements PaymentProvider {
  readonly id = "koko" as const;
  readonly name = "Koko";

  private get apiKey() {
    return process.env.KOKO_API_KEY ?? "";
  }

  private get secretKey() {
    return process.env.KOKO_SECRET_KEY ?? "";
  }

  private get baseUrl() {
    return process.env.KOKO_BASE_URL ?? "https://api.kokopay.io";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.secretKey);
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentInitiation> {
    if (!this.isConfigured()) {
      throw new Error("Koko is not configured");
    }

    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "X-Secret-Key": this.secretKey,
      },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency,
        reference: input.orderNumber,
        description: input.itemsDescription,
        customer: input.customer,
        redirect: {
          success: input.returnUrl,
          failure: input.cancelUrl,
        },
        webhook: input.notifyUrl,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Koko payment initiation failed (${response.status})`);
    }

    const data = (await response.json()) as {
      payment_id?: string;
      checkout_url?: string;
      redirect_url?: string;
    };

    return {
      kind: "redirect",
      actionUrl: data.checkout_url ?? data.redirect_url ?? "",
      method: "GET",
      fields: {},
      reference: data.payment_id ?? input.orderNumber,
    };
  }

  async verifyPayment(payload: unknown): Promise<PaymentCallbackResult> {
    const data = (payload ?? {}) as Record<string, unknown>;
    const status = String(data.status ?? "").toLowerCase();
    const reference = String(data.payment_id ?? data.reference ?? "");

    return {
      orderNumber: String(data.reference ?? reference),
      reference,
      success: status === "approved" || status === "captured" || status === "paid",
      status:
        status === "approved" || status === "captured" || status === "paid"
          ? "paid"
          : status === "failed" || status === "declined"
            ? "failed"
            : "pending",
      amount: data.amount ? Number(data.amount) : undefined,
      raw: payload,
    };
  }

  async handleCallback(payload: unknown): Promise<PaymentCallbackResult> {
    return this.verifyPayment(payload);
  }

  async refundPayment(reference: string): Promise<RefundResult> {
    if (!this.isConfigured()) {
      return { success: false, message: "Koko is not configured" };
    }
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/payments/${reference}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "X-Secret-Key": this.secretKey,
          },
          cache: "no-store",
        },
      );
      return {
        success: response.ok,
        reference,
        message: response.ok ? "Refund requested" : "Refund failed",
      };
    } catch {
      return { success: false, message: "Refund request failed" };
    }
  }
}
