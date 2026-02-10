import { COUNTRIES, Country } from "../lib/countries";

interface CountrySelectorProps {
  selectedCountry: string | null;
  onSelect: (country: Country) => void;
}

export default function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Sélectionnez votre pays</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country)}
            style={{
              padding: "16px",
              border: selectedCountry === country.code ? "2px solid #4CAF50" : "2px solid #E0E0E0",
              borderRadius: "8px",
              backgroundColor: selectedCountry === country.code ? "#f0f9f0" : "white",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "24px" }}>{country.flag}</span>
            <div>
              <div style={{ fontWeight: "600" }}>{country.name}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>{country.currency}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
