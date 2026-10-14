import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError, NotFoundError, ValidationError } from "@/lib/errors";
import { generateOrderNumber } from "@/lib/utils/slug";
import { computeTotals } from "@/lib/services/pricing";
import { toNumber } from "@/lib/utils/format";
import { getPaymentProvider } from "@/lib/payments/paymentService";
import type { PaymentInitiation, PaymentProviderId } from "@/lib/payments/types";

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface CreateOrderInput {
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    province?: string;
    notes?: string;
  };
  items: CreateOrderItemInput[];
  paymentProvider: PaymentProviderId;
  promoCode?: string | null;
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  email: string;
  total: number;
  payment: PaymentInitiation;
}

function variantLabel(size: string | null, color: string | null): string | null {
  const parts = [size, color].filter(Boolean);
  return parts.length ? parts.join(" / ") : null;
}

/**
 * Create an order using ONLY server-side pricing and stock information.
 * The browser-supplied prices are never trusted.
 */
export async function createOrder(
  input: CreateOrderInput,
  context: { siteUrl: string },
): Promise<CreateOrderResult> {
  if (!input.items.length) throw new ValidationError("Your cart is empty");

  const productIds = [...new Set(input.items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const resolvedItems: {
    productId: string;
    variantId: string | null;
    productName: string;
    variantLabel: string | null;
    productImage: string | null;
    quantity: number;
    unitPrice: Prisma.Decimal;
  }[] = [];

  let subtotal = 0;

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.isActive) {
      throw new AppError("One of the products is no longer available", 409, "PRODUCT_UNAVAILABLE");
    }

    let variant = null;
    let availableStock = product.stock;
    let unitPrice = toNumber(product.price);

    if (item.variantId) {
      variant = product.variants.find((v) => v.id === item.variantId) ?? null;
      if (!variant) {
        throw new AppError("A selected variant is unavailable", 409, "VARIANT_UNAVAILABLE");
      }
      availableStock = variant.stock;
      if (variant.priceOverride != null) unitPrice = toNumber(variant.priceOverride);
    }

    const quantity = Math.max(1, Math.floor(item.quantity));
    if (quantity > availableStock) {
      throw new AppError(
        `Only ${availableStock} left of "${product.name}"`,
        409,
        "INSUFFICIENT_STOCK",
      );
    }

    subtotal += unitPrice * quantity;

    resolvedItems.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      productName: product.name,
      variantLabel: variant ? variantLabel(variant.size, variant.color) : null,
      productImage: product.images[0] ?? null,
      quantity,
      unitPrice: new Prisma.Decimal(unitPrice),
    });
  }

  const totals = computeTotals(subtotal, input.promoCode);
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        orderNumber,
        customerName: input.customer.fullName,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        status: "PROCESSING",
        paymentStatus: "PENDING",
        subtotal: new Prisma.Decimal(totals.subtotal),
        shipping: new Prisma.Decimal(totals.shipping),
        discount: new Prisma.Decimal(totals.discount),
        total: new Prisma.Decimal(totals.total),
        promoCode: totals.promoCode,
        notes: input.shipping.notes || null,
        shippingAddress: {
          address: input.shipping.address,
          city: input.shipping.city,
          postalCode: input.shipping.postalCode,
          province: input.shipping.province || null,
          country: "Sri Lanka",
        } as Prisma.InputJsonValue,
        paymentProvider: input.paymentProvider,
        items: {
          create: resolvedItems,
        },
      },
      include: { items: true },
    });
  });

  const provider = getPaymentProvider(input.paymentProvider);
  const itemsDescription = resolvedItems
    .map((item) => `${item.productName} x${item.quantity}`)
    .join(", ");

  const payment = await provider.createPayment({
    orderNumber: order.orderNumber,
    amount: totals.total,
    currency: "LKR",
    customer: {
      name: input.customer.fullName,
      email: input.customer.email,
      phone: input.customer.phone,
      address: input.shipping.address,
      city: input.shipping.city,
    },
    itemsDescription,
    returnUrl: `${context.siteUrl}/order/${order.orderNumber}`,
    cancelUrl: `${context.siteUrl}/checkout?cancelled=1`,
    notifyUrl: `${context.siteUrl}/api/payments/${provider.id}/notify`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentReference: payment.reference },
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    email: order.customerEmail,
    total: totals.total,
    payment,
  };
}

/**
 * Mark an order as paid and reduce stock exactly once (idempotent).
 */
export async function markOrderPaid(
  orderNumber: string,
  reference?: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!order) throw new NotFoundError("Order not found");

    await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        paidAt: order.paidAt ?? new Date(),
        ...(reference ? { paymentReference: reference } : {}),
      },
    });

    if (order.stockReduced) return;

    for (const item of order.items) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (variant) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: Math.max(0, variant.stock - item.quantity) },
          });
        }
      } else if (item.productId) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (product) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: Math.max(0, product.stock - item.quantity) },
          });
        }
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: { stockReduced: true, status: "CONFIRMED" },
    });
  });
}

export async function markOrderPaymentFailed(orderNumber: string): Promise<void> {
  await prisma.order.updateMany({
    where: { orderNumber, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED" },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export interface OrderListFilters {
  search?: string;
  paymentStatus?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

export async function listOrders(filters: OrderListFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(100, Math.max(1, filters.perPage ?? 20));

  const where: Prisma.OrderWhereInput = {};
  if (filters.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      { customerName: { contains: filters.search, mode: "insensitive" } },
      { customerEmail: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus as Prisma.EnumPaymentStatusFilter;
  }
  if (filters.status) {
    where.status = filters.status as Prisma.EnumFulfillmentStatusFilter;
  }
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: new Date(filters.from) } : {}),
      ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59.999Z`) } : {}),
    };
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function updateOrder(
  id: string,
  data: { status?: string; paymentStatus?: string },
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundError("Order not found");

  if (data.paymentStatus === "PAID" && order.paymentStatus !== "PAID") {
    await markOrderPaid(order.orderNumber);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status as never } : {}),
      ...(data.paymentStatus && data.paymentStatus !== "PAID"
        ? { paymentStatus: data.paymentStatus as never }
        : {}),
    },
    include: { items: true },
  });

  return updated;
}

export async function getRecentOrders(take = 5) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { items: true },
  });
}
