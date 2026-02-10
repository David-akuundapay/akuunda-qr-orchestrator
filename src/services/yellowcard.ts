import { internalGet, internalPost } from "../clients/internalApi";

export async function resolveChannelId(
  countryCode: string,
): Promise<string | undefined> {
  const channels = await internalGet<any[]>(`/yellow-card/channels`);
  const found = channels?.find((c: any) => c.country === countryCode);
  return found?.id || found?.channelId;
}

interface YellowCardInput {
  channelId?: string;
  countryCode: string;
  recipient: unknown;
  source: unknown;
  amount: number | string;
  currency: string;
  reason?: string;
}

export async function createYellowCardCollection(
  input: YellowCardInput,
): Promise<unknown> {
  const channelId =
    input.channelId || (await resolveChannelId(input.countryCode));
  if (!channelId) throw new Error("YELLOWCARD_NO_CHANNEL");

  const payload = {
    recipient: input.recipient,
    source: input.source,
    amount: Number(input.amount),
    currency: input.currency,
    country: input.countryCode,
    reason: input.reason || "other",
    channelId,
    forceAccept: true,
    directSettlement: true,
    rampType: "deposit",
  };

  return internalPost(`/yellow-card/on-ramp/create-collection`, payload);
}
