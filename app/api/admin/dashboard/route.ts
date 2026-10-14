import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import {
  getDashboardStats,
  getSalesOverTime,
  getOrderStatusSummary,
  getPaymentStatusSummary,
} from "@/lib/services/dashboard";
import { getLowStockProducts } from "@/lib/services/products";
import { getRecentOrders } from "@/lib/services/orders";

export const GET = withErrorHandling(async () => {
  await requireAdmin();

  const [stats, sales, orderStatuses, paymentStatuses, lowStock, recentOrders] =
    await Promise.all([
      getDashboardStats(),
      getSalesOverTime(14),
      getOrderStatusSummary(),
      getPaymentStatusSummary(),
      getLowStockProducts(10, 5),
      getRecentOrders(5),
    ]);

  return ok({
    stats,
    sales,
    orderStatuses,
    paymentStatuses,
    lowStock,
    recentOrders,
  });
});