export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  engine: "MELD" | "YELLOWCARD";
}

export const COUNTRIES: Country[] = [
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", engine: "MELD" },
  { code: "US", name: "USA", flag: "🇺🇸", currency: "USD", engine: "MELD" },
  { code: "CD", name: "Congo (RDC)", flag: "🇨🇩", currency: "CDF", engine: "YELLOWCARD" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", currency: "XAF", engine: "YELLOWCARD" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", currency: "XAF", engine: "YELLOWCARD" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", currency: "XOF", engine: "YELLOWCARD" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF", engine: "YELLOWCARD" },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
