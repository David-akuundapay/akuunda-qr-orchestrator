import axios from "axios";
import { getAccessToken } from "../auth/keycloak";

const INTERNAL_BASE = process.env.INTERNAL_API_BASE!;
// e.g. https://walletdev.akuunda-pay.io/api/internal/v1

export async function internalGet<T = unknown>(path: string): Promise<T> {
  const token = await getAccessToken();
  const res = await axios.get<T>(`${INTERNAL_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function internalPost<T = unknown>(
  path: string,
  payload: unknown,
): Promise<T> {
  const token = await getAccessToken();
  const res = await axios.post<T>(`${INTERNAL_BASE}${path}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
