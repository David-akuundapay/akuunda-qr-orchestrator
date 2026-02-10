export interface YellowCardNetwork {
  networkId: string;
  label: string;
}

// TODO: Replace with actual networkId from YellowCard API
export const YELLOWCARD_NETWORKS: Record<string, YellowCardNetwork[]> = {
  CI: [
    { networkId: "401a79b8-50bd-41fc-9102-b5d4650a02aa", label: "MTN Mobile Money" },
    { networkId: "9d8e4f3c-7b6a-4e2d-8c1f-5a9b3c7e4f2a", label: "Orange Money" },
    { networkId: "2e7f8a9b-4c5d-6e7f-8a9b-0c1d2e3f4a5b", label: "Wave" },
    { networkId: "6f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c", label: "Moov Money" },
  ],
  CD: [
    { networkId: "3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d", label: "M-Pesa" },
    { networkId: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b", label: "Orange Money" },
    { networkId: "1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f", label: "Airtel Money" },
  ],
  CM: [
    { networkId: "5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d", label: "MTN Mobile Money" },
    { networkId: "9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b", label: "Orange Money" },
  ],
  GA: [
    { networkId: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f", label: "Airtel Money" },
    { networkId: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d", label: "Moov Money" },
  ],
  SN: [
    { networkId: "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b", label: "Orange Money" },
    { networkId: "5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f", label: "Wave" },
    { networkId: "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d", label: "Free Money" },
  ],
};

export interface YellowCardRecipient {
  name: string;
  country: string;
  phone: string;
  address: string;
  email: string;
  dob: string;
  idNumber: string;
  idType: string;
  additionalIdType?: string;
  additionalIdNumber?: string;
}

export interface YellowCardSource {
  accountNumber: string;
  accountType: string;
  networkId: string;
  accountName: string;
  phoneNumber: string;
}

export interface YellowCardPayload {
  recipient: YellowCardRecipient;
  source: YellowCardSource;
  amount: number;
  currency: string;
  country: string;
  reason: string;
  channelId: string;
  forceAccept: boolean;
  directSettlement: boolean;
  rampType: string;
}

export function buildYellowCardPayload(
  recipient: YellowCardRecipient,
  source: YellowCardSource,
  amount: number,
  currency: string,
  country: string,
  channelId: string
): YellowCardPayload {
  return {
    recipient,
    source: {
      ...source,
      accountType: "momo",
    },
    amount,
    currency,
    country,
    reason: "other",
    channelId,
    forceAccept: true,
    directSettlement: true,
    rampType: "deposit",
  };
}
