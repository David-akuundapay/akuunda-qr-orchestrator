/**
 * YellowCard API Integration
 * 
 * Provides functions to interact with YellowCard internal APIs for:
 * - Exchange rates
 * - Available networks (mobile money providers)
 * - Payment channels
 * - Collection creation
 */

import { internalGet, internalPost } from "./internal-api";
import { YellowCardPayload } from "./yellowcard";

/**
 * YellowCard exchange rate information
 */
export interface YellowCardRate {
  currencyCode: string;
  rate: number;
  channelId?: string;
  // Add other fields as needed based on actual API response
}

/**
 * YellowCard network (mobile money provider) information
 */
export interface YellowCardNetwork {
  networkId: string;
  label: string;
  countryCode?: string;
  // Add other fields as needed based on actual API response
}

/**
 * YellowCard channel information
 */
export interface YellowCardChannel {
  channelId: string;
  name: string;
  countryCode?: string;
  // Add other fields as needed based on actual API response
}

/**
 * YellowCard collection creation response
 */
export interface YellowCardCollectionResponse {
  collectionId?: string;
  status?: string;
  qrCode?: string;
  paymentUrl?: string;
  // Add other fields as needed based on actual API response
  [key: string]: unknown;
}

/**
 * Fetches exchange rates from YellowCard
 * Endpoint #2: GET /api/internal/v1/yellow-card/rates?currencyCode={currencyCode}
 * 
 * @param currencyCode - Currency code (e.g., "XOF", "XAF", "CDF")
 * @returns Promise resolving to rate information
 */
export async function getYellowCardRates(currencyCode: string): Promise<YellowCardRate[]> {
  return internalGet<YellowCardRate[]>(
    "/api/internal/v1/yellow-card/rates",
    { currencyCode }
  );
}

/**
 * Fetches exchange rates for a specific channel
 * Endpoint #3: GET /api/internal/v1/yellow-card/rates/{channelId}?currencyCode={currencyCode}
 * 
 * @param channelId - Channel identifier
 * @param currencyCode - Currency code
 * @returns Promise resolving to rate information for the channel
 */
export async function getYellowCardRatesByChannel(
  channelId: string,
  currencyCode: string
): Promise<YellowCardRate> {
  return internalGet<YellowCardRate>(
    `/api/internal/v1/yellow-card/rates/${channelId}`,
    { currencyCode }
  );
}

/**
 * Fetches available mobile money networks for a country
 * Endpoint #4: GET /api/internal/v1/yellow-card/networks?countryCode={countryCode}
 * 
 * IMPORTANT: This replaces the hardcoded YELLOWCARD_NETWORKS with real networkIds
 * 
 * @param countryCode - Two-letter country code (e.g., "CI", "CD", "CM")
 * @returns Promise resolving to list of available networks
 */
export async function getYellowCardNetworks(countryCode: string): Promise<YellowCardNetwork[]> {
  return internalGet<YellowCardNetwork[]>(
    "/api/internal/v1/yellow-card/networks",
    { countryCode }
  );
}

/**
 * Fetches available channels for a country
 * Endpoint #5: GET /api/internal/v1/yellow-card/channels?countryCode={countryCode}
 * 
 * IMPORTANT: This replaces the hardcoded YELLOWCARD_CHANNEL_ID
 * 
 * @param countryCode - Two-letter country code
 * @returns Promise resolving to list of available channels
 */
export async function getYellowCardChannels(countryCode: string): Promise<YellowCardChannel[]> {
  return internalGet<YellowCardChannel[]>(
    "/api/internal/v1/yellow-card/channels",
    { countryCode }
  );
}

/**
 * Creates a YellowCard collection (payment request)
 * Endpoint #6: POST /api/internal/v1/yellow-card/on-ramp/create-collection
 * 
 * This replaces direct calls to external YellowCard API with YELLOWCARD_API_KEY.
 * All authentication is handled via Keycloak token.
 * 
 * @param payload - YellowCard payment payload
 * @returns Promise resolving to collection creation response
 */
export async function createYellowCardCollection(
  payload: YellowCardPayload
): Promise<YellowCardCollectionResponse> {
  return internalPost<YellowCardCollectionResponse>(
    "/api/internal/v1/yellow-card/on-ramp/create-collection",
    payload
  );
}
