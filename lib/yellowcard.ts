export interface YellowCardNetwork {
  networkId: string;
  label: string;
}

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
