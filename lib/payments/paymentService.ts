import { CodProvider } from "./CodProvider";
import { KokoProvider } from "./KokoProvider";
import { PayHereProvider } from "./PayHereProvider";
import type { PaymentProvider, PaymentProviderId } from "./types";

const providers: Record<PaymentProviderId, PaymentProvider> = {
  payhere: new PayHereProvider(),
  koko: new KokoProvider(),
  cod: new CodProvider(),
};

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  return providers[id];
}

/** Provider selected via environment (used as the checkout default). */
export function getDefaultPaymentProviderId(): PaymentProviderId {
  const configured = (process.env.PAYMENT_PROVIDER ?? "payhere").toLowerCase();
  if (configured === "koko" || configured === "cod" || configured === "payhere") {
    return configured;
  }
  return "payhere";
}

/** Providers that are actually usable (credentials present). */
export function getAvailableProviders(): {
  id: PaymentProviderId;
  name: string;
  configured: boolean;
}[] {
  return Object.values(providers).map((provider) => ({
    id: provider.id,
    name: provider.name,
    configured: provider.isConfigured(),
  }));
}

export * from "./types";
