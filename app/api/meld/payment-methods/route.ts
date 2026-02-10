import { NextRequest, NextResponse } from "next/server";
import { getMeldPaymentMethods } from "../../../../lib/meld-api";

/**
 * GET /api/meld/payment-methods
 * 
 * Fetches MELD payment methods for a given fiat currency
 * Query params: fiatCurrency (required)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fiatCurrency = searchParams.get("fiatCurrency");

  if (!fiatCurrency) {
    return NextResponse.json(
      { error: "fiatCurrency parameter is required" },
      { status: 400 }
    );
  }

  try {
    const paymentMethods = await getMeldPaymentMethods(fiatCurrency);
    return NextResponse.json(paymentMethods);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch MELD payment methods";
    console.error("Error fetching MELD payment methods:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
