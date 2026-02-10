export interface MeldPayload {
  userName: string;
  serviceProvider: string;
  sourceCurrencyCode: string;
  destinationCurrencyCode: string;
  sourceAmount: string;
  sessionType: string;
  countryCode: string;
}

export function buildMeldPayload(
  userName: string,
  serviceProvider: string,
  sourceCurrencyCode: string,
  sourceAmount: number,
  countryCode: string,
  destinationCurrencyCode: string = "USDC_POLYGON"
): MeldPayload {
  return {
    userName,
    serviceProvider,
    sourceCurrencyCode,
    destinationCurrencyCode,
    sourceAmount: sourceAmount.toString(),
    sessionType: "BUY",
    countryCode,
  };
}
