"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import ProgressStepper from "../../components/ProgressStepper";
import CountrySelector from "../../components/CountrySelector";
import ProviderSelector from "../../components/ProviderSelector";
import PaymentForm from "../../components/PaymentForm";
import ReviewStep from "../../components/ReviewStep";
import { Country, getCountryByCode } from "../../lib/countries";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId") || "";
  const walletAddress = searchParams.get("wallet") || "";

  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    // Reset subsequent selections
    setSelectedProvider(null);
    setSelectedPaymentMethod(null);
    setSelectedNetworkId(null);
  };

  const handleNext = () => {
    setError(null);
    
    // Validation
    if (step === 1 && !selectedCountry) {
      setError("Veuillez sélectionner un pays");
      return;
    }
    if (step === 2) {
      if (selectedCountry?.engine === "MELD" && !selectedProvider) {
        setError("Veuillez sélectionner un fournisseur");
        return;
      }
      if (!selectedPaymentMethod) {
        setError("Veuillez sélectionner une méthode de paiement");
        return;
      }
    }
    if (step === 3) {
      if (!amount || parseFloat(amount) <= 0) {
        setError("Veuillez entrer un montant valide");
        return;
      }
      if (selectedCountry?.engine === "YELLOWCARD") {
        if (!accountName.trim()) {
          setError("Veuillez entrer le nom du compte");
          return;
        }
        if (!phoneNumber.trim()) {
          setError("Veuillez entrer le numéro de téléphone");
          return;
        }
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedCountry) return;
    
    setLoading(true);
    setError(null);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";
      
      const payload: any = {
        merchantId,
        walletAddress,
        countryCode: selectedCountry.code,
        engine: selectedCountry.engine,
        amount: parseFloat(amount),
        currency: selectedCountry.currency,
      };

      if (selectedCountry.engine === "YELLOWCARD") {
        payload.source = {
          accountNumber: phoneNumber,
          accountType: "momo",
          networkId: selectedNetworkId,
          accountName: accountName,
          phoneNumber: phoneNumber,
        };
      } else {
        payload.serviceProvider = selectedProvider;
      }

      const res = await fetch(`${API_BASE}/on-ramp/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      // Handle response based on engine
      if (selectedCountry.engine === "MELD" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // YellowCard confirmation
        setStep(5);
      }
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#fafafa",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "600px", 
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "28px", 
          marginBottom: "24px",
          textAlign: "center",
          color: "#333"
        }}>
          Paiement Akuunda Pay
        </h1>

        <ProgressStepper currentStep={step} totalSteps={totalSteps} />

        {step === 1 && (
          <CountrySelector
            selectedCountry={selectedCountry?.code || null}
            onSelect={handleCountrySelect}
          />
        )}

        {step === 2 && selectedCountry && (
          <ProviderSelector
            countryCode={selectedCountry.code}
            engine={selectedCountry.engine}
            selectedProvider={selectedProvider}
            selectedPaymentMethod={selectedPaymentMethod}
            onProviderSelect={setSelectedProvider}
            onPaymentMethodSelect={(method, networkId) => {
              setSelectedPaymentMethod(method);
              if (networkId) setSelectedNetworkId(networkId);
            }}
          />
        )}

        {step === 3 && selectedCountry && (
          <PaymentForm
            engine={selectedCountry.engine}
            currency={selectedCountry.currency}
            amount={amount}
            accountName={accountName}
            phoneNumber={phoneNumber}
            onAmountChange={setAmount}
            onAccountNameChange={setAccountName}
            onPhoneNumberChange={setPhoneNumber}
          />
        )}

        {step === 4 && selectedCountry && (
          <ReviewStep
            countryName={selectedCountry.name}
            countryFlag={selectedCountry.flag}
            engine={selectedCountry.engine}
            paymentMethod={selectedPaymentMethod || ""}
            provider={selectedProvider}
            amount={amount}
            currency={selectedCountry.currency}
            merchantId={merchantId}
            walletAddress={walletAddress}
            accountName={accountName}
            phoneNumber={phoneNumber}
          />
        )}

        {step === 5 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Paiement en cours</h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Votre demande de paiement a été soumise avec succès. 
              Vous recevrez une confirmation sous peu.
            </p>
            <div style={{ 
              backgroundColor: "#f5f5f5", 
              padding: "16px", 
              borderRadius: "8px",
              fontSize: "14px",
              textAlign: "left"
            }}>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Référence:</span>{" "}
                <span style={{ fontWeight: "600" }}>{merchantId}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Montant:</span>{" "}
                <span style={{ fontWeight: "600" }}>{amount} {selectedCountry?.currency}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: "12px", 
            backgroundColor: "#ffebee", 
            color: "#c62828",
            borderRadius: "8px",
            marginTop: "16px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {step < 5 && (
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            marginTop: "24px",
            justifyContent: "space-between"
          }}>
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "2px solid #E0E0E0",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Retour
              </button>
            )}
            
            {step < 4 && (
              <button
                onClick={handleNext}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Continuer
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Traitement..." : "Confirmer le paiement"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        Chargement...
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
