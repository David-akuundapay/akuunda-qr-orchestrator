/**
 * Keycloak OAuth2 Authentication Module
 * 
 * Manages authentication tokens for internal API access using Keycloak OAuth2 password grant flow.
 * Implements token caching with automatic refresh 30 seconds before expiration.
 */

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
}

let tokenCache: CachedToken | null = null;

/**
 * Gets a valid Keycloak access token, using cached token if available and not expired.
 * Automatically refreshes token 30 seconds before expiration.
 * 
 * @returns Promise resolving to a valid access token
 * @throws Error if token cannot be obtained or environment variables are missing
 */
export async function getKeycloakToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if valid and not expiring soon (30 second buffer)
  if (tokenCache && tokenCache.expiresAt > now + 30000) {
    return tokenCache.accessToken;
  }

  // Fetch new token
  const tokenUrl = process.env.KEYCLOAK_TOKEN_URL;
  const username = process.env.KEYCLOAK_USERNAME;
  const password = process.env.KEYCLOAK_PASSWORD;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (!tokenUrl || !username || !password || !clientId || !clientSecret) {
    throw new Error(
      "Missing Keycloak configuration. Required: KEYCLOAK_TOKEN_URL, KEYCLOAK_USERNAME, " +
      "KEYCLOAK_PASSWORD, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET"
    );
  }

  try {
    // Build form-encoded body for OAuth2 password grant
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("username", username);
    params.append("password", password);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Keycloak token error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to obtain Keycloak token: ${response.status} ${response.statusText}`);
    }

    const data: KeycloakTokenResponse = await response.json();

    // Cache the token with expiration time
    const expiresAt = now + (data.expires_in * 1000);
    tokenCache = {
      accessToken: data.access_token,
      expiresAt,
    };

    return data.access_token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error obtaining Keycloak token:", error);
    throw new Error(`Keycloak authentication failed: ${errorMessage}`);
  }
}

/**
 * Clears the cached token. Useful for testing or forcing a token refresh.
 */
export function clearTokenCache(): void {
  tokenCache = null;
}
