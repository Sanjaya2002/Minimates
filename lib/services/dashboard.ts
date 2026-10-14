import { prisma } from "@/lib/db/prisma";
import { toNumber } from "@/lib/utils/format";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  completedOrders: number;
  averageOrderValue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    revenueAgg,
    totalOrders,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    completedOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 10 } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ]);

  const totalRevenue = toNumber(revenueAgg._sum.total);
  const paidOrders = await prisma.order.count({ where: { paymentStatus: "PAID" } });

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    completedOrders,
    averageOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
  };
}

export interface SalesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export async function getSalesOverTime(days = 14): Promise<SalesPoint[]> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, total: true },
  });

  const buckets = new Map<string, SalesPoint>();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, {
      date: key,
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += toNumber(order.total);
      bucket.orders += 1;
    }
  }

  return [...buckets.values()];
}

export async function getOrderStatusSummary() {
  const groups = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return groups.map((group) => ({
    status: group.status,
    count: group._count._all,
  }));
}

export async function getPaymentStatusSummary() {
  const groups = await prisma.order.groupBy({
    by: ["paymentStatus"],
    _count: { _all: true },
  });
  return groups.map((group) => ({
    status: group.paymentStatus,
    count: group._count._all,
  }));
}
