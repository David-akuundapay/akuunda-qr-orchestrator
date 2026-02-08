"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function QrPaymentPage() {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/on-ramp/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engine: "MELD",
          countryCode: "FR",
          sourceCurrencyCode: "USD",
          sourceAmount: "100",
          userName: "qr-user"
        })
      });

      const data = await res.json();
      if (!data.redirectUrl) {
        throw new Error("Aucune URL de redirection reçue");
      }

      window.location.href = data.redirectUrl;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Paiement Akuunda Pay</h2>
      <p>Référence QR : <b>{linkId}</b></p>

      <button onClick={startPayment} disabled={loading}>
        {loading ? "Redirection..." : "Continuer le paiement"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
