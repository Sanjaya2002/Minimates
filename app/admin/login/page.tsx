"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Baby, Package } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error ?? "Login failed");
      toast("Welcome back!", "success");
      router.replace(next);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="admin@minimates.lk"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />
      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Sign in to admin
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream/60 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-ink/8 bg-white p-8 shadow-soft">
          <div className="mb-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-playful-pink text-white">
              <Package className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-extrabold text-ink">
              Minimates Admin
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Sign in to manage your store.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
            <Baby className="h-3.5 w-3.5" />
            <Link href="/" className="font-semibold text-playful-pink hover:underline">
              Back to the storefront
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}