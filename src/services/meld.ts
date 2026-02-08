import { internalPost } from "../clients/internalApi";

interface MeldInput {
  userName?: string;
  email?: string;
  serviceProvider?: string;
  sourceCurrencyCode: string;
  sourceAmount: number | string;
  countryCode: string;
}

export async function createMeldSession(input: MeldInput): Promise<unknown> {
  const payload = {
    userName: input.userName || input.email || "",
    serviceProvider: input.serviceProvider || "",
    sourceCurrencyCode: input.sourceCurrencyCode,
    destinationCurrencyCode: "USDC_POLYGON",
    sourceAmount: String(input.sourceAmount),
    sessionType: "BUY",
    countryCode: input.countryCode,
  };

  return internalPost(`/meld/session`, payload);
}
