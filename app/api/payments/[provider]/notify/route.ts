import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/paymentService";
import {
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/lib/services/orders";
import { handleApiError } from "@/lib/api/response";
import type { PaymentProviderId } from "@/lib/payments/types";

type Params = Promise<{ provider: string }>;

const PROVIDERS = new Set<PaymentProviderId>(["payhere", "koko", "cod"]);

function parseBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return request.json();
  return request.formData().then((form) => Object.fromEntries(form.entries()) as Record<string, string>);
}

/**
 * Payment provider webhook / notify endpoint.
 * Always responds quickly; updates the order + stock on success.
 */
export async function POST(request: NextRequest, context: { params: Params }) {
  try {
    const { provider: providerId } = await context.params;

    if (!PROVIDERS.has(providerId as PaymentProviderId)) {
      return NextResponse.json({ success: false, error: "Unknown payment provider" }, { status: 404 });
    }

    const provider = getPaymentProvider(providerId as PaymentProviderId);
    const payload = await parseBody(request);
    const result = await provider.handleCallback(payload);

    if (result.orderNumber) {
      if (result.status === "paid") {
        await markOrderPaid(result.orderNumber, result.reference);
      } else if (result.status === "failed") {
        await markOrderPaymentFailed(result.orderNumber);
      }
    }

    return NextResponse.json({ success: true, status: result.status });
  } catch (error) {
    return handleApiError(error);
  }
}