import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-cream/40 lg:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-3 lg:px-8">
          <p className="text-sm text-ink-soft">
            Signed in as <span className="font-semibold text-ink">{admin.name}</span>
          </p>
          <p className="hidden text-xs font-medium uppercase tracking-wide text-ink-soft sm:block">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}