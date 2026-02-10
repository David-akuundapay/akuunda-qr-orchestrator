"use client";

import { useState, useEffect } from "react";

interface PaymentMethod {
  id: string;
  label: string;
  type: string;
}

interface Channel {
  channelId: string;
  name: string;
}

interface PaymentOptionsResponse {
  engine: string;
  country: string;
  currency: string;
  channels?: Channel[];
  defaults?: {
    serviceProvider?: string;
    [key: string]: unknown;
  };
  paymentMethods: PaymentMethod[];
}

interface ProviderSelectorProps {
  countryCode: string;
  engine: "MELD" | "YELLOWCARD";
  selectedProvider: string | null;
  selectedPaymentMethod: string | null;
  onProviderSelect: (provider: string) => void;
  onPaymentMethodSelect: (method: string, networkId?: string) => void;
  onChannelSelect?: (channelId: string) => void;
}

export default function ProviderSelector({
  countryCode,
  engine,
  selectedProvider,
  selectedPaymentMethod,
  onProviderSelect,
  onPaymentMethodSelect,
  onChannelSelect,
}: ProviderSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionsResponse | null>(null);

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";
        const response = await fetch(`${API_BASE}/payment-options?countryCode=${countryCode}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch payment options");
        }

        const data: PaymentOptionsResponse = await response.json();
        setPaymentOptions(data);

        // Auto-select default service provider for MELD if available
        if (engine === "MELD" && data.defaults?.serviceProvider && !selectedProvider) {
          onProviderSelect(data.defaults.serviceProvider);
        }

        // Auto-select first channel for YellowCard if available
        if (engine === "YELLOWCARD" && data.channels && data.channels.length > 0 && onChannelSelect) {
          onChannelSelect(data.channels[0].channelId);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load payment options";
        setError(errorMessage);
        console.error("Error fetching payment options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOptions();
  }, [countryCode, engine, selectedProvider, onProviderSelect, onChannelSelect]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "16px", color: "#666" }}>Chargement des options de paiement...</div>
      </div>
    );
  }

  if (error || !paymentOptions) {
    return (
      <div style={{ 
        padding: "16px", 
        backgroundColor: "#ffebee", 
        color: "#c62828",
        borderRadius: "8px"
      }}>
        {error || "Erreur lors du chargement des options de paiement"}
      </div>
    );
  }

  if (engine === "MELD") {
    const paymentMethods = paymentOptions.paymentMethods || [];
    
    return (
      <div>
        <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Méthode de paiement</h2>
        
        {/* Show service provider info if available */}
        {selectedProvider && (
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Fournisseur de service
            </label>
            <div style={{
              padding: "12px",
              border: "2px solid #4CAF50",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "#f0f9f0",
            }}>
              {selectedProvider}
            </div>
          </div>
        )}

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
  const networks = paymentOptions.paymentMethods || [];
  
  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Réseau Mobile Money</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onPaymentMethodSelect(network.label, network.id)}
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
