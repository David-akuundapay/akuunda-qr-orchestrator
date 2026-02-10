/**
 * Internal API Client
 * 
 * Provides authenticated HTTP methods for accessing internal Akuunda APIs.
 * Automatically includes Keycloak Bearer token in all requests.
 */

import { getKeycloakToken } from "./keycloak";

const BASE_URL = process.env.AKUUNDA_API_BASE_URL || "https://walletdev.akuunda-pay.io";

/**
 * Performs an authenticated GET request to an internal API endpoint
 * 
 * @param path - API endpoint path (e.g., "/api/internal/v1/users/akuunda/getUser")
 * @param params - Optional query parameters as key-value pairs
 * @returns Promise resolving to the parsed JSON response
 * @throws Error if the request fails
 */
export async function internalGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const token = await getKeycloakToken();
  
  // Build URL with query parameters
  let url = `${BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Internal API GET error: ${response.status} - ${errorText}`);
      throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error calling GET ${path}:`, error);
    throw new Error(`Internal API GET request failed: ${errorMessage}`);
  }
}

/**
 * Performs an authenticated POST request to an internal API endpoint
 * 
 * @param path - API endpoint path (e.g., "/api/internal/v1/yellow-card/on-ramp/create-collection")
 * @param body - Request body to be JSON-stringified
 * @returns Promise resolving to the parsed JSON response
 * @throws Error if the request fails
 */
export async function internalPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  const token = await getKeycloakToken();
  
  const url = `${BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Internal API POST error: ${response.status} - ${errorText}`);
      throw new Error(`POST ${path} failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error calling POST ${path}:`, error);
    throw new Error(`Internal API POST request failed: ${errorMessage}`);
  }
}
