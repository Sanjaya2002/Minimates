export const PAYMENT_PROVIDER_IDS = ["payhere", "koko", "cod"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDER_IDS)[number];

export interface PaymentCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface CreatePaymentInput {
  orderNumber: string;
  amount: number;
  currency: string;
  customer: PaymentCustomer;
  itemsDescription: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export type PaymentInitiation =
  /** Provider requires a client-side redirect / form POST to a hosted page. */
  | { kind: "redirect"; actionUrl: string; method: "POST" | "GET"; fields: Record<string, string>; reference: string }
  /** Payment is handled without leaving the site (e.g. cash on delivery). */
  | { kind: "pending"; reference: string; message: string };

export interface PaymentCallbackResult {
  orderNumber: string;
  reference: string;
  success: boolean;
  status: "paid" | "pending" | "failed" | "refunded";
  amount?: number;
  raw: unknown;
}

export interface RefundResult {
  success: boolean;
  reference?: string;
  message: string;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  readonly name: string;
  /** Whether required credentials are configured for this provider. */
  isConfigured(): boolean;
  createPayment(input: CreatePaymentInput): Promise<PaymentInitiation>;
  /** Verify a callback / notification payload sent by the provider. */
  verifyPayment(payload: unknown): Promise<PaymentCallbackResult>;
  handleCallback(payload: unknown): Promise<PaymentCallbackResult>;
  refundPayment(reference: string, amount: number): Promise<RefundResult>;
}
