import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/checkout";
import { ok, withErrorHandling } from "@/lib/api/response";
import { sendEmail } from "@/lib/email/send";
import { siteConfig } from "@/lib/config/site";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = contactSchema.parse(await request.json());

  void sendEmail({
    to: siteConfig.contactEmail,
    subject: `[Minimates] ${body.subject}`,
    text: `From: ${body.name} <${body.email}>\n\n${body.message}`,
  }).catch(() => undefined);

  return ok({ received: true });
});