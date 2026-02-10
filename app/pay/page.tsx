"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { COUNTRIES, COUNTRY_CONFIG } from "@/config/countries";
import { PaymentFormData, Provider, PaymentOptionsResponse } from "@/types/payment";
import styles from "./pay.module.css";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId") || "";
  const walletAddress = searchParams.get("wallet") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    merchantId,
    walletAddress,
    countryCode: "",
    currency: "",
    provider: { engine: "MELD", name: "", methods: [] },
    paymentMethod: "",
    amount: "",
    name: "",
    email: "",
    phone: "",
  });

  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);

  // Validation check for QR parameters
  useEffect(() => {
    if (!merchantId || !walletAddress) {
      setError("Invalid QR code. Missing merchant ID or wallet address.");
    }
  }, [merchantId, walletAddress]);

  // Fetch payment options when country is selected
  useEffect(() => {
    if (formData.countryCode) {
      fetchPaymentOptions(formData.countryCode);
    }
  }, [formData.countryCode]);

  const fetchPaymentOptions = async (countryCode: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payment-options?countryCode=${countryCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payment options");
      }
      const data: PaymentOptionsResponse = await response.json();
      setAvailableProviders(data.providers);
      setFormData((prev) => ({ ...prev, currency: data.currency }));
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    const config = COUNTRY_CONFIG[countryCode];
    setFormData((prev) => ({
      ...prev,
      countryCode,
      currency: config.currency,
      provider: { engine: "MELD", name: "", methods: [] },
      paymentMethod: "",
    }));
    setStep(2);
  };

  const handleProviderSelect = (provider: Provider) => {
    setFormData((prev) => ({
      ...prev,
      provider,
      paymentMethod: "",
    }));
  };

  const handlePaymentMethodSelect = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/on-ramp/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: formData.merchantId,
          walletAddress: formData.walletAddress,
          engine: formData.provider.engine,
          countryCode: formData.countryCode,
          paymentMethod: formData.paymentMethod,
          amount: formData.amount,
          currency: formData.currency,
          userName: formData.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment creation failed");
      }

      const data = await response.json();
      
      if (data.redirectUrl) {
        // Redirect to external payment provider
        window.location.href = data.redirectUrl;
      } else {
        // Show success message
        setStep(5);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isProviderCardBased = () => {
    return formData.provider.engine === "MELD";
  };

  const isFormValid = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return false;
    
    if (isProviderCardBased()) {
      return formData.name && formData.email;
    } else {
      return formData.phone && formData.name;
    }
  };

  const renderProgressIndicator = () => {
    const steps = ["Country", "Payment", "Details", "Confirm"];
    return (
      <div className={styles.progressContainer}>
        {steps.map((label, index) => (
          <div key={index} className={styles.progressStep}>
            <div
              className={`${styles.progressCircle} ${
                step > index + 1 ? styles.completed : step === index + 1 ? styles.active : ""
              }`}
            >
              {step > index + 1 ? "✓" : index + 1}
            </div>
            <span className={styles.progressLabel}>{label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Select Your Country</h2>
      <div className={styles.countryGrid}>
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            className={styles.countryButton}
            onClick={() => handleCountrySelect(country.code)}
          >
            <span className={styles.countryFlag}>{country.flag}</span>
            <span className={styles.countryName}>{country.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Select Payment Method</h2>
      {availableProviders.length === 0 ? (
        <p className={styles.emptyMessage}>No payment methods available for this country.</p>
      ) : (
        <div className={styles.providersContainer}>
          {availableProviders.map((provider, idx) => (
            <div key={idx} className={styles.providerCard}>
              <h3 className={styles.providerName}>{provider.name}</h3>
              <div className={styles.methodsGrid}>
                {provider.methods.map((method) => (
                  <button
                    key={method}
                    className={styles.methodButton}
                    onClick={() => {
                      handleProviderSelect(provider);
                      handlePaymentMethodSelect(method);
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className={styles.backButton} onClick={() => setStep(1)}>
        ← Back
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Enter Payment Details</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Amount ({formData.currency})</label>
        <input
          type="number"
          className={styles.input}
          value={formData.amount}
          onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={styles.input}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Your full name"
        />
      </div>

      {isProviderCardBased() ? (
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
          />
        </div>
      ) : (
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            className={styles.input}
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+123456789"
          />
        </div>
      )}

      <button
        className={styles.submitButton}
        onClick={() => setStep(4)}
        disabled={!isFormValid()}
      >
        Review Payment
      </button>

      <button className={styles.backButton} onClick={() => setStep(2)}>
        ← Back
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Review & Confirm</h2>
      
      <div className={styles.reviewCard}>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Merchant:</span>
          <span className={styles.reviewValue}>{formData.merchantId}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Wallet:</span>
          <span className={styles.reviewValue}>
            {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
          </span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Country:</span>
          <span className={styles.reviewValue}>{formData.countryCode}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Payment Method:</span>
          <span className={styles.reviewValue}>{formData.paymentMethod}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Amount:</span>
          <span className={styles.reviewValue}>
            {formData.amount} {formData.currency}
          </span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Name:</span>
          <span className={styles.reviewValue}>{formData.name}</span>
        </div>
        {formData.email && (
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Email:</span>
            <span className={styles.reviewValue}>{formData.email}</span>
          </div>
        )}
        {formData.phone && (
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Phone:</span>
            <span className={styles.reviewValue}>{formData.phone}</span>
          </div>
        )}
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>

      <button className={styles.backButton} onClick={() => setStep(3)} disabled={loading}>
        ← Back
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div className={styles.stepContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Payment Initiated</h2>
        <p className={styles.successMessage}>
          Your payment has been successfully initiated. You will receive a confirmation shortly.
        </p>
      </div>
    </div>
  );

  if (error && !merchantId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Akuunda Pay</h1>
        <p className={styles.subtitle}>Secure Crypto On-Ramp</p>
      </header>

      {step < 5 && renderProgressIndicator()}

      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.closeError}>×</button>
        </div>
      )}

      <main className={styles.main}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </main>

      <footer className={styles.footer}>
        <p>Merchant: {merchantId}</p>
        <p className={styles.walletInfo}>
          Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      </footer>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
