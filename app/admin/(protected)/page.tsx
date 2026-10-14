"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Banknote,
  DollarSign,
  Package,
  Timer,
} from "lucide-react";
import { DashboardStatCard } from "@/components/admin/DashboardStatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { LowStockAlert } from "@/components/admin/LowStockAlert";
import { RecentOrdersTable, OrderStatusSummary } from "@/components/admin/RecentOrdersTable";
import { Skeleton } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { formatPrice } from "@/lib/utils/format";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
    completedOrders: number;
    averageOrderValue: number;
  };
  sales: { date: string; revenue: number; orders: number }[];
  orderStatuses: { status: string; count: number }[];
  paymentStatuses: { status: string; count: number }[];
  lowStock: { id: string; name: string; image: string | null; stock: number }[];
  recentOrders: unknown[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load");
        return response.json();
      })
      .then((json) => setData(json.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <p className="rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-500">
        Could not load dashboard data. Check your database connection.
      </p>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-soft">
            A quick look at how your store is doing.
          </p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
          <Package className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Total revenue"
          value={formatPrice(stats.totalRevenue)}
          hint="from paid orders"
          icon={Banknote}
          tone="lime"
        />
        <DashboardStatCard
          label="Orders"
          value={String(stats.totalOrders)}
          hint={`${stats.completedOrders} delivered`}
          icon={DollarSign}
          tone="sky"
        />
        <DashboardStatCard
          label="Products"
          value={String(stats.totalProducts)}
          hint={`${stats.lowStockProducts} low stock`}
          icon={Package}
          tone="pink"
        />
        <DashboardStatCard
          label="Pending orders"
          value={String(stats.pendingOrders)}
          hint={`avg. order ${formatPrice(stats.averageOrderValue)}`}
          icon={Timer}
          tone="sunshine"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
          <SalesChart data={data.sales} />
        </div>
        <div className="space-y-6">
          <LowStockAlert products={data.lowStock} />
          <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
            <h3 className="mb-3 font-heading text-sm font-bold text-ink">
              Order statuses
            </h3>
            <OrderStatusSummary summary={data.orderStatuses} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-ink">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-playful-pink hover:underline"
          >
            View all →
          </Link>
        </div>
        <RecentOrdersTable orders={data.recentOrders as never} />
      </div>
    </div>
  );
}