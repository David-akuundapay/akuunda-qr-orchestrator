import { CountryPaymentConfig } from "@/types/payment";

export const COUNTRY_CONFIG: Record<string, CountryPaymentConfig> = {
  FR: {
    currency: "EUR",
    providers: [
      {
        engine: "MELD",
        name: "MELD",
        methods: ["Carte bancaire", "Virement SEPA"],
      },
      {
        engine: "MELD",
        name: "Stripe",
        methods: ["Carte bancaire", "Apple Pay", "Google Pay"],
      },
    ],
  },
  CD: {
    currency: "CDF",
    providers: [
      {
        engine: "YELLOWCARD",
        name: "Mobile Money",
        methods: ["M-Pesa", "Orange Money", "Airtel Money"],
      },
    ],
  },
  CM: {
    currency: "XAF",
    providers: [
      {
        engine: "YELLOWCARD",
        name: "Mobile Money",
        methods: ["MTN Mobile Money", "Orange Money"],
      },
    ],
  },
  GA: {
    currency: "XAF",
    providers: [
      {
        engine: "YELLOWCARD",
        name: "Mobile Money",
        methods: ["Airtel Money", "Moov Money"],
      },
    ],
  },
  SN: {
    currency: "XOF",
    providers: [
      {
        engine: "YELLOWCARD",
        name: "Mobile Money",
        methods: ["Orange Money", "Wave", "Free Money"],
      },
    ],
  },
  CI: {
    currency: "XOF",
    providers: [
      {
        engine: "YELLOWCARD",
        name: "Mobile Money",
        methods: ["MTN Mobile Money", "Orange Money", "Moov Money", "Wave"],
      },
    ],
  },
  US: {
    currency: "USD",
    providers: [
      {
        engine: "MELD",
        name: "MELD",
        methods: ["Credit Card", "Debit Card", "Apple Pay"],
      },
    ],
  },
};

export const COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "CD", name: "Democratic Republic of Congo", flag: "🇨🇩" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "US", name: "United States", flag: "🇺🇸" },
];
