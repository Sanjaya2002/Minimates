import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string; fields?: Record<string, string[]> };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function fail(error: string, status = 400, fields?: Record<string, string[]>) {
  return NextResponse.json<ApiFailure>({ success: false, error, fields }, { status });
}

/**
 * Convert thrown errors into a safe, consistent JSON response.
 * Internal/database details are never leaked to the client.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "form";
      fields[key] = [...(fields[key] ?? []), issue.message];
    }
    return fail("Please check the highlighted fields.", 422, fields);
  }

  if (error instanceof AppError) {
    return fail(error.message, error.statusCode);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[api] Unhandled error:", error);
  }

  return fail("Something went wrong. Please try again.", 500);
}

/**
 * Wrap a route handler so that all thrown errors are handled consistently.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response> | Response,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
