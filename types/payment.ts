export type Engine = "MELD" | "YELLOWCARD";

export interface PaymentMethod {
  id: string;
  label: string;
}

export interface Provider {
  engine: Engine;
  name: string;
  methods: string[];
}

export interface CountryPaymentConfig {
  currency: string;
  providers: Provider[];
}

export interface PaymentFormData {
  merchantId: string;
  walletAddress: string;
  countryCode: string;
  currency: string;
  provider: Provider;
  paymentMethod: string;
  amount: string;
  // Customer details
  name?: string;
  email?: string;
  phone?: string;
}

export interface PaymentOptionsResponse {
  countryCode: string;
  currency: string;
  providers: Provider[];
}

export interface CreatePaymentRequest {
  merchantId: string;
  walletAddress: string;
  engine: Engine;
  countryCode: string;
  paymentMethod: string;
  amount: string;
  currency: string;
  userName?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface CreatePaymentResponse {
  redirectUrl?: string;
  sessionId?: string;
  status?: string;
}
