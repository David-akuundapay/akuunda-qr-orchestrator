"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
console.log("API_BASE =", API_BASE);

// Types
interface PaymentProvider {
  name: string;
  methods: string[];
}

// Configuration des pays, providers et moyens de paiement
const COUNTRIES = [
  { code: "FR", name: "France", currency: "EUR" },
  { code: "US", name: "États-Unis", currency: "USD" },
  { code: "CD", name: "République Démocratique du Congo", currency: "CDF" },
  { code: "CM", name: "Cameroun", currency: "XAF" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF" },
];

const PROVIDERS_BY_COUNTRY: Record<string, PaymentProvider[]> = {
  FR: [
    { name: "MELD", methods: ["Carte bancaire", "Virement SEPA"] },
    { name: "Stripe", methods: ["Carte bancaire", "Apple Pay", "Google Pay"] },
  ],
  US: [
    { name: "MELD", methods: ["Credit Card", "ACH Transfer"] },
    { name: "Stripe", methods: ["Credit Card", "Apple Pay"] },
  ],
  CD: [
    { name: "MELD", methods: ["Mobile Money", "Orange Money", "Airtel Money"] },
  ],
  CM: [
    { name: "MELD", methods: ["Mobile Money", "Orange Money", "MTN Money"] },
  ],
  CI: [
    { name: "MELD", methods: ["Mobile Money", "Orange Money", "MTN Money", "Moov Money"] },
  ],
};

export default function QrPaymentPage() {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États du formulaire
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [userName, setUserName] = useState("");
  const [currency, setCurrency] = useState("");
  
  // Providers et méthodes disponibles selon le pays sélectionné
  const [availableProviders, setAvailableProviders] = useState<PaymentProvider[]>([]);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  // Mettre à jour les providers quand le pays change
  useEffect(() => {
    if (selectedCountry) {
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      setCurrency(country?.currency || "");
      setAvailableProviders(PROVIDERS_BY_COUNTRY[selectedCountry] || []);
      setSelectedProvider("");
      setSelectedMethod("");
      setAvailableMethods([]);
    } else {
      setAvailableProviders([]);
      setAvailableMethods([]);
      setCurrency("");
    }
  }, [selectedCountry]);

  // Mettre à jour les méthodes quand le provider change
  useEffect(() => {
    if (selectedProvider) {
      const provider = availableProviders.find(p => p.name === selectedProvider);
      setAvailableMethods(provider?.methods || []);
      setSelectedMethod("");
    } else {
      setAvailableMethods([]);
    }
  }, [selectedProvider, availableProviders]);

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!selectedCountry) {
      setError("Veuillez sélectionner un pays");
      return;
    }
    if (!selectedProvider) {
      setError("Veuillez sélectionner un fournisseur");
      return;
    }
    if (!selectedMethod) {
      setError("Veuillez sélectionner un moyen de paiement");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Veuillez saisir un montant valide");
      return;
    }
    if (!userName.trim()) {
      setError("Veuillez saisir votre nom");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/on-ramp/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engine: selectedProvider,
          countryCode: selectedCountry,
          sourceCurrencyCode: currency,
          sourceAmount: amount,
          userName: userName.trim(),
          paymentMethod: selectedMethod
        })
      });

      const data = await res.json();
      if (!data.redirectUrl) {
        throw new Error("Aucune URL de redirection reçue");
      }

      window.location.href = data.redirectUrl;
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      padding: 40,
      maxWidth: 600,
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h2 style={{ marginBottom: 10 }}>Effectuer un Paiement</h2>
      <p style={{ color: "#666", marginBottom: 30 }}>
        Référence QR : <b>{linkId}</b>
      </p>

      <form onSubmit={startPayment}>
        {/* Sélection du pays */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Pays *
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
            required
          >
            <option value="">Sélectionnez un pays</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection du provider */}
        {selectedCountry && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
              Provider *
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc"
              }}
              required
            >
              <option value="">Sélectionnez un provider</option>
              {availableProviders.map(provider => (
                <option key={provider.name} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sélection du moyen de paiement */}
        {selectedProvider && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
              Moyen de paiement *
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc"
              }}
              required
            >
              <option value="">Sélectionnez un moyen de paiement</option>
              {availableMethods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Montant */}
        {selectedCountry && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
              Montant ({currency}) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%",
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc"
              }}
              required
            />
          </div>
        )}

        {/* Nom de l'utilisateur */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Nom complet *
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Jean Dupont"
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
            required
          />
        </div>

        {/* Bouton de validation */}
        <button
          type="submit"
          disabled={loading || !selectedCountry || !selectedProvider || !selectedMethod || !amount || !userName}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: (loading || !selectedCountry || !selectedProvider || !selectedMethod || !amount || !userName) ? "#ccc" : "#007bff",
            border: "none",
            borderRadius: 4,
            cursor: (loading || !selectedCountry || !selectedProvider || !selectedMethod || !amount || !userName) ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Traitement en cours..." : "Valider le paiement"}
        </button>

        {error && (
          <p style={{ 
            color: "#d32f2f", 
            marginTop: 15,
            padding: 10,
            backgroundColor: "#ffebee",
            borderRadius: 4
          }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
