import axios from "axios";

const TOKEN_URL = process.env.KEYCLOAK_TOKEN_URL!;
const USERNAME = process.env.KEYCLOAK_USERNAME!;
const PASSWORD = process.env.KEYCLOAK_PASSWORD!;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET!;

let cache: { token: string; exp: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cache && Date.now() < cache.exp) return cache.token;

  const body = new URLSearchParams({
    grant_type: "password",
    username: USERNAME,
    password: PASSWORD,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await axios.post(TOKEN_URL, body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const token: string = res.data.access_token;
  const expiresIn = Number(res.data.expires_in || 300);

  // Refresh 30 s before actual expiry
  cache = { token, exp: Date.now() + (expiresIn - 30) * 1000 };
  return token;
}
