/**
 * MELD API Integration
 * 
 * Provides functions to interact with MELD internal APIs for:
 * - Payment methods
 * - Fiat currencies
 * - Country defaults
 * - Cryptocurrency options
 * - Session creation
 */

import { internalGet, internalPost } from "./internal-api";
import { MeldPayload } from "./meld";

/**
 * MELD payment method information
 */
export interface MeldPaymentMethod {
  id: string;
  label: string;
  type?: string;
  // Add other fields as needed based on actual API response
}

/**
 * MELD fiat currency information
 */
export interface MeldFiatCurrency {
  code: string;
  name: string;
  symbol?: string;
  // Add other fields as needed based on actual API response
}

/**
 * MELD country defaults configuration
 */
export interface MeldCountryDefaults {
  serviceProvider?: string;
  destinationCurrencyCode?: string;
  paymentMethods?: string[];
  // Add other fields as needed based on actual API response
}

/**
 * MELD cryptocurrency information
 */
export interface MeldCryptoCurrency {
  code: string;
  name: string;
  network?: string;
  // Add other fields as needed based on actual API response
}

/**
 * MELD session creation response
 */
export interface MeldSessionResponse {
  sessionId?: string;
  redirectUrl?: string;
  url?: string;
  status?: string;
  // Add other fields as needed based on actual API response
  [key: string]: unknown;
}

/**
 * Fetches available payment methods for a fiat currency
 * Endpoint #7: GET /api/internal/v1/meld/payment-methods?fiatCurrency={fiatCurrency}
 * 
 * @param fiatCurrency - Fiat currency code (e.g., "EUR", "USD")
 * @returns Promise resolving to list of available payment methods
 */
export async function getMeldPaymentMethods(fiatCurrency: string): Promise<MeldPaymentMethod[]> {
  return internalGet<MeldPaymentMethod[]>(
    "/api/internal/v1/meld/payment-methods",
    { fiatCurrency }
  );
}

/**
 * Fetches available fiat currencies for a country
 * Endpoint #8: GET /api/internal/v1/meld/countries/{countryCode}/fiat-currencies
 * 
 * @param countryCode - Two-letter country code (e.g., "FR", "US")
 * @returns Promise resolving to list of fiat currencies
 */
export async function getMeldFiatCurrencies(countryCode: string): Promise<MeldFiatCurrency[]> {
  return internalGet<MeldFiatCurrency[]>(
    `/api/internal/v1/meld/countries/${countryCode}/fiat-currencies`
  );
}

/**
 * Fetches default configuration for a country
 * Endpoint #9: GET /api/internal/v1/meld/countries/{countryCode}/defaults
 * 
 * @param countryCode - Two-letter country code
 * @returns Promise resolving to country defaults configuration
 */
export async function getMeldDefaults(countryCode: string): Promise<MeldCountryDefaults> {
  return internalGet<MeldCountryDefaults>(
    `/api/internal/v1/meld/countries/${countryCode}/defaults`
  );
}

/**
 * Fetches available cryptocurrencies for a country
 * Endpoint #10: GET /api/internal/v1/meld/countries/{countryCode}/crypto-currencies
 * 
 * @param countryCode - Two-letter country code
 * @returns Promise resolving to list of cryptocurrencies
 */
export async function getMeldCryptoCurrencies(countryCode: string): Promise<MeldCryptoCurrency[]> {
  return internalGet<MeldCryptoCurrency[]>(
    `/api/internal/v1/meld/countries/${countryCode}/crypto-currencies`
  );
}

/**
 * Creates a MELD session for payment processing
 * Endpoint #11: POST /api/internal/v1/meld/session
 * 
 * This replaces direct calls to external MELD API with MELD_API_KEY.
 * All authentication is handled via Keycloak token.
 * 
 * @param payload - MELD session payload
 * @returns Promise resolving to session creation response with redirect URL
 */
export async function createMeldSession(payload: MeldPayload): Promise<MeldSessionResponse> {
  return internalPost<MeldSessionResponse>(
    "/api/internal/v1/meld/session",
    payload
  );
}
