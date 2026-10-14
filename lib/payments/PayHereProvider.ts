import { createHash } from "node:crypto";
import type {
  CreatePaymentInput,
  PaymentCallbackResult,
  PaymentInitiation,
  PaymentProvider,
  RefundResult,
} from "./types";

/**
 * PayHere (Sri Lanka) hosted checkout provider.
 * https://support.payhere.lk/api-&-mobile-sdk/checkout-api
 */
export class PayHereProvider implements PaymentProvider {
  readonly id = "payhere" as const;
  readonly name = "PayHere";

  private get merchantId() {
    return process.env.PAYHERE_MERCHANT_ID ?? "";
  }

  private get merchantSecret() {
    return process.env.PAYHERE_MERCHANT_SECRET ?? "";
  }

  private get isSandbox() {
    return (process.env.PAYHERE_MODE ?? "sandbox") !== "live";
  }

  isConfigured(): boolean {
    return Boolean(this.merchantId && this.merchantSecret);
  }

  private get actionUrl(): string {
    return this.isSandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  private generateHash(orderNumber: string, amount: number): string {
    const secretHash = createHash("md5")
      .update(this.merchantSecret)
      .digest("hex")
      .toUpperCase();
    return createHash("md5")
      .update(
        this.merchantId +
          orderNumber +
          this.formatAmount(amount) +
          "LKR" +
          secretHash,
      )
      .digest("hex")
      .toUpperCase();
  }

  private generateMd5Sig(
    orderNumber: string,
    amount: number,
    currency: string,
    statusCode: string,
  ): string {
    const secretHash = createHash("md5")
      .update(this.merchantSecret)
      .digest("hex")
      .toUpperCase();
    return createHash("md5")
      .update(
        this.merchantId +
          orderNumber +
          this.formatAmount(amount) +
          currency +
          statusCode +
          secretHash,
      )
      .digest("hex")
      .toUpperCase();
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentInitiation> {
    if (!this.isConfigured()) {
      throw new Error("PayHere is not configured");
    }

    const [firstName, ...rest] = input.customer.name.split(" ");
    const lastName = rest.join(" ") || firstName;

    const fields: Record<string, string> = {
      merchant_id: this.merchantId,
      return_url: input.returnUrl,
      cancel_url: input.cancelUrl,
      notify_url: input.notifyUrl,
      order_id: input.orderNumber,
      items: input.itemsDescription.slice(0, 100),
      currency: input.currency,
      amount: this.formatAmount(input.amount),
      first_name: firstName,
      last_name: lastName,
      email: input.customer.email,
      phone: input.customer.phone,
      address: input.customer.address ?? "",
      city: input.customer.city ?? "",
      country: input.customer.country ?? "Sri Lanka",
      hash: this.generateHash(input.orderNumber, input.amount),
    };

    return {
      kind: "redirect",
      actionUrl: this.actionUrl,
      method: "POST",
      fields,
      reference: input.orderNumber,
    };
  }

  async verifyPayment(payload: unknown): Promise<PaymentCallbackResult> {
    const data = (payload ?? {}) as Record<string, string>;
    const orderNumber = data.order_id ?? "";
    const amount = Number(data.payhere_amount ?? data.amount ?? 0);
    const currency = data.payhere_currency ?? "LKR";
    const statusCode = data.status_code ?? "";
    const md5sig = data.md5sig ?? "";

    const expected = this.generateMd5Sig(orderNumber, amount, currency, statusCode);
    const verified = Boolean(md5sig) && md5sig.toUpperCase() === expected;

    return {
      orderNumber,
      reference: data.payment_id ?? orderNumber,
      success: verified && statusCode === "2",
      status: !verified
        ? "failed"
        : statusCode === "2"
          ? "paid"
          : statusCode === "0"
            ? "pending"
            : "failed",
      amount,
      raw: payload,
    };
  }

  async handleCallback(payload: unknown): Promise<PaymentCallbackResult> {
    return this.verifyPayment(payload);
  }

  async refundPayment(): Promise<RefundResult> {
    return {
      success: false,
      message:
        "PayHere refunds must be issued from the PayHere merchant dashboard.",
    };
  }
}
