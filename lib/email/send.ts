import { siteConfig } from "@/lib/config/site";

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Minimal transactional email sender (Resend-compatible REST API).
 * When EMAIL_API_KEY is not configured the message is logged and skipped so
 * checkout/contact flows never fail because of missing email setup.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM || `Minimates <${siteConfig.contactEmail}>`;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] Skipped (no EMAIL_API_KEY): "${payload.subject}" -> ${payload.to}`);
    }
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      }),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function orderConfirmationEmail(params: {
  orderNumber: string;
  customerName: string;
  total: string;
}): EmailPayload["html"] {
  return `<div style="font-family:sans-serif">
    <h1>Thank you, ${params.customerName}!</h1>
    <p>Your Minimates order <strong>${params.orderNumber}</strong> has been received.</p>
    <p>Total: <strong>${params.total}</strong></p>
    <p>We'll be in touch about delivery soon.</p>
  </div>`;
}
