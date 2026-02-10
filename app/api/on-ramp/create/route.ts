import { NextRequest, NextResponse } from "next/server";
import { CreatePaymentRequest, CreatePaymentResponse } from "@/types/payment";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://qr.akuunda-pay.io/api";

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json();

    // Validate required fields
    if (!body.engine || !body.countryCode || !body.amount || !body.walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${API_BASE}/on-ramp/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        engine: body.engine,
        countryCode: body.countryCode,
        sourceCurrencyCode: body.currency,
        sourceAmount: body.amount,
        destinationCurrencyCode: "USDC", // Default for now
        walletAddress: body.walletAddress,
        merchantId: body.merchantId,
        userName: body.userName || body.name,
        email: body.email,
        phone: body.phone,
        paymentMethod: body.paymentMethod,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Backend API error", detail: errorData },
        { status: response.status }
      );
    }

    const data: CreatePaymentResponse = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("On-ramp creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 }
    );
  }
}
