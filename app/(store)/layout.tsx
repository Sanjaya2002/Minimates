import { CartProvider } from "@/lib/cart/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getCategories } from "@/lib/services/categories";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header categories={categories} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer categories={categories} />
      </div>
      <CartDrawer />
      <WhatsAppButton />
    </CartProvider>
  );
}
