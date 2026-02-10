import { internalGet } from "../clients/internalApi";

interface PaymentMethod {
  id: string;
  label: string;
  engine: "MELD" | "YELLOWCARD";
  requiresRedirect: boolean;
}

interface PaymentOptionsResponse {
  countryCode: string;
  availablePaymentMethods: PaymentMethod[];
}

export async function getPaymentOptions(
  countryCode: string,
): Promise<PaymentOptionsResponse> {
  const methods: PaymentMethod[] = [];

  // ── MELD ────────────────────────────────────────────────
  try {
    // If defaults call succeeds the country is supported by MELD
    await internalGet(`/meld/countries/${countryCode}/defaults`);
    const meldMethods = await internalGet<Record<string, unknown>>(
      `/meld/payment-methods`,
    );

    const list: unknown[] =
      (meldMethods as any)?.paymentMethods ?? (Array.isArray(meldMethods) ? meldMethods : []);

    list.forEach((m: any) => {
      methods.push({
        id: m.type || m.id || String(m),
        label: m.label || m.type || String(m),
        engine: "MELD",
        requiresRedirect: true,
      });
    });
  } catch {
    // MELD not available for this country – ignore
  }

  // ── YELLOWCARD ──────────────────────────────────────────
  try {
    const channels = await internalGet<any[]>(`/yellow-card/channels`);
    const hasChannel = channels?.some((c: any) => c.country === countryCode);
    if (hasChannel) {
      methods.push({
        id: "MOBILE_MONEY",
        label: "Mobile Money",
        engine: "YELLOWCARD",
        requiresRedirect: true,
      });
    }
  } catch {
    // YellowCard unavailable – ignore
  }

  return { countryCode, availablePaymentMethods: methods };
}
