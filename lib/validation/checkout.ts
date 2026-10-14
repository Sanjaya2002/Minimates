import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(60).default(12),
});

export const PAYMENT_PROVIDERS = ["payhere", "koko", "cod"] as const;

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(120),
    email: z.string().trim().email("Please enter a valid email"),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number")
      .max(20)
      .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  }),
  shipping: z.object({
    address: z.string().trim().min(5, "Please enter your address").max(300),
    city: z.string().trim().min(2, "Please enter your city").max(80),
    postalCode: z.string().trim().min(3, "Please enter your postal code").max(12),
    province: z.string().trim().max(80).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).nullable().optional(),
        quantity: z.coerce.number().int().min(1).max(99),
      }),
    )
    .min(1, "Your cart is empty"),
  paymentProvider: z.enum(PAYMENT_PROVIDERS),
  promoCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email"),
  subject: z.string().trim().min(2, "Please add a subject").max(160),
  message: z.string().trim().min(10, "Please write a little more").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
