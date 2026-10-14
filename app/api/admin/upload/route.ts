import { NextRequest } from "next/server";
import { ok, fail, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { uploadToStorage } from "@/lib/supabase/admin";

export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return fail("No file provided", 400);
  }

  const url = await uploadToStorage(
    {
      arrayBuffer: await file.arrayBuffer(),
      name: file.name,
      type: file.type,
    },
    "products",
  );

  return ok({ url });
});