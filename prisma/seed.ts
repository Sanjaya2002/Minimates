import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Bath & Care",
    slug: "bath-care",
    description: "Gentle washes, lotions and towels for happy bath times.",
  },
  {
    name: "Feeding",
    slug: "feeding",
    description: "Bottles, bibs and everything for mealtime made easy.",
  },
  {
    name: "Diapers & Wipes",
    slug: "diapers-wipes",
    description: "Soft, safe and sensitive on delicate skin.",
  },
  {
    name: "Clothing",
    slug: "clothing",
    description: "Cosy, cute and comfortable outfits for little ones.",
  },
  {
    name: "Toys & Play",
    slug: "toys-play",
    description: "Playful picks that spark curiosity and joy.",
  },
  {
    name: "Health & Safety",
    slug: "health-safety",
    description: "Everyday essentials to keep your baby healthy and safe.",
  },
];

interface SeedProduct {
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  ageGroup: string;
  isFeatured?: boolean;
  isNew?: boolean;
  description: string;
  variants?: { size?: string; color?: string; stock: number; priceOverride?: number }[];
}

const products: SeedProduct[] = [
  {
    name: "Gentle Baby Shampoo",
    slug: "baby-shampoo",
    category: "bath-care",
    price: 1250,
    compareAtPrice: 1500,
    stock: 42,
    ageGroup: "0-6-months",
    isFeatured: true,
    isNew: true,
    description:
      "A tear-free, hypoallergenic shampoo made with chamomile to gently cleanse delicate hair and skin.",
  },
  {
    name: "Tear-Free Baby Lotion",
    slug: "gentle-lotion",
    category: "bath-care",
    price: 1480,
    stock: 36,
    ageGroup: "0-6-months",
    isFeatured: true,
    description:
      "Fast-absorbing daily lotion with shea butter and oat extract to keep skin soft and hydrated.",
  },
  {
    name: "Rubber Duck Bath Toy",
    slug: "duck-bath-toy",
    category: "bath-care",
    price: 690,
    compareAtPrice: 890,
    stock: 60,
    ageGroup: "6-12-months",
    isNew: true,
    description:
      "A cheerful squeaky duck that makes bath time a splash. BPA-free and easy to clean.",
  },
  {
    name: "Nursery Night Cloud Lamp",
    slug: "night-cloud",
    category: "bath-care",
    price: 3200,
    stock: 14,
    ageGroup: "0-6-months",
    description:
      "A soft glow night light with calming colours to help little ones drift off to sleep.",
  },
  {
    name: "Wide-Neck Feeding Bottle",
    slug: "feeding-bottle",
    category: "feeding",
    price: 1850,
    compareAtPrice: 2200,
    stock: 28,
    ageGroup: "0-6-months",
    isFeatured: true,
    description:
      "Anti-colic wide-neck bottle with a soft silicone teat for a natural feeding feel.",
    variants: [
      { size: "150ml", stock: 15 },
      { size: "260ml", stock: 13, priceOverride: 2150 },
    ],
  },
  {
    name: "Flower Print Cotton Bib",
    slug: "flower-bib",
    category: "feeding",
    price: 590,
    stock: 75,
    ageGroup: "6-12-months",
    isNew: true,
    description:
      "Absorbent double-layer cotton bib with a sweet flower print and adjustable snap closure.",
    variants: [
      { color: "Blush", stock: 40 },
      { color: "Sky", stock: 35 },
    ],
  },
  {
    name: "Sunshine Barrier Cream",
    slug: "sunshine-cream",
    category: "health-safety",
    price: 980,
    stock: 8,
    ageGroup: "0-6-months",
    description:
      "Protective zinc barrier cream that soothes and guards against nappy rash.",
  },
  {
    name: "Organic Cotton Wipes (3 Pack)",
    slug: "organic-wipes",
    category: "diapers-wipes",
    price: 1350,
    compareAtPrice: 1650,
    stock: 90,
    ageGroup: "0-6-months",
    isFeatured: true,
    description:
      "Ultra-soft organic cotton wipes, fragrance-free and 100% biodegradable.",
  },
  {
    name: "Baby Blanket Cloud Soft",
    slug: "baby-blanket",
    category: "clothing",
    price: 2450,
    stock: 32,
    ageGroup: "0-6-months",
    description:
      "Cuddly fleece blanket with a cloud pattern to keep your baby warm and snug.",
  },
  {
    name: "Everyday Onesie Set (3 Pack)",
    slug: "onesie-set",
    category: "clothing",
    price: 2950,
    compareAtPrice: 3600,
    stock: 44,
    ageGroup: "1-2-years",
    isFeatured: true,
    description:
      "Soft cotton onesies with press-studs for easy changes. Comes in a pack of three.",
    variants: [
      { size: "0-3M", stock: 12 },
      { size: "3-6M", stock: 16 },
      { size: "6-12M", stock: 16, priceOverride: 3150 },
    ],
  },
  {
    name: "Kids Play Tee",
    slug: "kids-tee",
    category: "clothing",
    price: 1150,
    stock: 50,
    ageGroup: "3-5-years",
    isNew: true,
    description:
      "Breathable combed cotton tee with a playful print that survives every adventure.",
    variants: [
      { size: "2-3Y", color: "Sunshine", stock: 18 },
      { size: "4-5Y", color: "Sky", stock: 20 },
      { size: "6-7Y", color: "Pistachio", stock: 12 },
    ],
  },
  {
    name: "Cuddly Teddy Bear",
    slug: "teddy-bear",
    category: "toys-play",
    price: 1990,
    compareAtPrice: 2400,
    stock: 25,
    ageGroup: "1-2-years",
    isFeatured: true,
    isNew: true,
    description:
      "A huggable, extra-soft teddy bear with embroidered eyes — the perfect first friend.",
  },
  {
    name: "Soft Stacking Ring Set",
    slug: "stacking-rings",
    category: "toys-play",
    price: 1650,
    stock: 30,
    ageGroup: "6-12-months",
    description:
      "Colourful, chew-safe stacking rings that build motor skills and endless fun.",
  },
  {
    name: "Plush Heart Cushion",
    slug: "plush-heart",
    category: "toys-play",
    price: 1290,
    stock: 22,
    ageGroup: "3-5-years",
    description:
      "A sweet heart-shaped cushion that adds a pop of colour to any nursery.",
  },
  {
    name: "Sensory Play Ball",
    slug: "play-ball",
    category: "toys-play",
    price: 890,
    stock: 48,
    ageGroup: "6-12-months",
    isNew: true,
    description:
      "Textured sensory ball that's easy to grab, squeeze and roll for growing hands.",
  },
  {
    name: "Star Soother Pacifier",
    slug: "star-pacifier",
    category: "health-safety",
    price: 750,
    stock: 6,
    ageGroup: "0-6-months",
    isFeatured: true,
    description:
      "Orthodontic silicone soother with a glow-in-the-dark star to find it at night.",
    variants: [
      { size: "0-6M", stock: 3 },
      { size: "6-18M", stock: 3 },
    ],
  },
];

async function main() {
  // --- Admin user ---------------------------------------------------------
  const email = (process.env.ADMIN_EMAIL || "admin@minimates.lk").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { isAdmin: true },
    create: {
      email,
      fullName: "Minimates Admin",
      passwordHash,
      isAdmin: true,
      phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
    },
  });
  console.log(`✓ Admin user ready: ${email}`);

  // --- Categories ---------------------------------------------------------
  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: `/images/categories/${category.slug}.svg`,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: `/images/categories/${category.slug}.svg`,
      },
    });
    categoryMap.set(category.slug, record.id);
  }
  console.log(`✓ ${categories.length} categories ready`);

  // --- Products -----------------------------------------------------------
  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) continue;

    const data = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: new Prisma.Decimal(product.price),
      compareAtPrice: product.compareAtPrice
        ? new Prisma.Decimal(product.compareAtPrice)
        : null,
      categoryId,
      ageGroup: product.ageGroup,
      stock: product.stock,
      images: [`/images/products/${product.slug}.svg`],
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? false,
      isActive: true,
    };

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
      include: { variants: true },
    });

    if (existing) {
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({ where: { id: existing.id }, data });
    } else {
      await prisma.product.create({ data });
    }

    if (product.variants?.length) {
      const created = await prisma.product.findUnique({
        where: { slug: product.slug },
      });
      if (created) {
        await prisma.productVariant.createMany({
          data: product.variants.map((variant) => ({
            productId: created.id,
            size: variant.size ?? null,
            color: variant.color ?? null,
            stock: variant.stock,
            priceOverride:
              variant.priceOverride != null
                ? new Prisma.Decimal(variant.priceOverride)
                : null,
          })),
        });
      }
    }
  }
  console.log(`✓ ${products.length} products ready`);

  // --- Demo orders --------------------------------------------------------
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const teddy = await prisma.product.findUnique({ where: { slug: "teddy-bear" } });
    const wipes = await prisma.product.findUnique({ where: { slug: "organic-wipes" } });
    if (teddy && wipes) {
      await prisma.order.create({
        data: {
          orderNumber: "MM-DEMO-0001",
          customerName: "Nimali Perera",
          customerEmail: "nimali@example.com",
          customerPhone: "+94 77 123 4567",
          status: "CONFIRMED",
          paymentStatus: "PAID",
          subtotal: new Prisma.Decimal(1990 + 1350),
          shipping: new Prisma.Decimal(0),
          discount: new Prisma.Decimal(0),
          total: new Prisma.Decimal(3340),
          shippingAddress: {
            address: "12, Rose Lane",
            city: "Colombo",
            postalCode: "00500",
            province: "Western",
            country: "Sri Lanka",
          },
          paymentProvider: "cod",
          paidAt: new Date(),
          items: {
            create: [
              {
                productId: teddy.id,
                productName: teddy.name,
                productImage: teddy.images[0] ?? null,
                quantity: 1,
                unitPrice: new Prisma.Decimal(1990),
              },
              {
                productId: wipes.id,
                productName: wipes.name,
                productImage: wipes.images[0] ?? null,
                quantity: 1,
                unitPrice: new Prisma.Decimal(1350),
              },
            ],
          },
        },
      });
      console.log("✓ Demo order created");
    }
  }

  console.log("\nSeed complete 🌱");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
