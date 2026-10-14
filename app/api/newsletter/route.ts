import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, withErrorHandling } from "@/lib/api/response";
import { sendEmail } from "@/lib/email/send";
import { siteConfig } from "@/lib/config/site";

const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { email } = newsletterSchema.parse(await request.json());

  // Store/persist subscribers here when an email service is wired up.
  void sendEmail({
    to: siteConfig.contactEmail,
    subject: "[Minimates] New newsletter subscriber",
    text: `New subscriber: ${email}`,
  }).catch(() => undefined);

  return ok({ subscribed: true });
});