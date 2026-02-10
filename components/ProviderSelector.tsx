import { MELD_SERVICE_PROVIDERS, MELD_PAYMENT_METHODS } from "../lib/countries";
import { YELLOWCARD_NETWORKS } from "../lib/yellowcard";

interface ProviderSelectorProps {
  countryCode: string;
  engine: "MELD" | "YELLOWCARD";
  selectedProvider: string | null;
  selectedPaymentMethod: string | null;
  onProviderSelect: (provider: string) => void;
  onPaymentMethodSelect: (method: string, networkId?: string) => void;
}

export default function ProviderSelector({
  countryCode,
  engine,
  selectedProvider,
  selectedPaymentMethod,
  onProviderSelect,
  onPaymentMethodSelect,
}: ProviderSelectorProps) {
  if (engine === "MELD") {
    const paymentMethods = MELD_PAYMENT_METHODS[countryCode] || [];
    
    return (
      <div>
        <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Méthode de paiement</h2>
        
        {/* Service Provider Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Fournisseur de service
          </label>
          <select
            value={selectedProvider || ""}
            onChange={(e) => onProviderSelect(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #E0E0E0",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "white",
            }}
          >
            <option value="">Sélectionnez un fournisseur</option>
            {MELD_SERVICE_PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Mode de paiement
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => onPaymentMethodSelect(method.id)}
                style={{
                  padding: "16px",
                  border: selectedPaymentMethod === method.id ? "2px solid #4CAF50" : "2px solid #E0E0E0",
                  borderRadius: "8px",
                  backgroundColor: selectedPaymentMethod === method.id ? "#f0f9f0" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // YellowCard - Mobile Money Networks
  const networks = YELLOWCARD_NETWORKS[countryCode] || [];
  
  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Réseau Mobile Money</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {networks.map((network) => (
          <button
            key={network.networkId}
            onClick={() => onPaymentMethodSelect(network.label, network.networkId)}
            style={{
              padding: "16px",
              border: selectedPaymentMethod === network.label ? "2px solid #4CAF50" : "2px solid #E0E0E0",
              borderRadius: "8px",
              backgroundColor: selectedPaymentMethod === network.label ? "#f0f9f0" : "white",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            {network.label}
          </button>
        ))}
      </div>
    </div>
  );
}
