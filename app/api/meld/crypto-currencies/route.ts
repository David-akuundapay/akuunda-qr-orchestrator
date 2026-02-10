import { NextRequest, NextResponse } from "next/server";
import { getMeldCryptoCurrencies } from "../../../../lib/meld-api";

/**
 * GET /api/meld/crypto-currencies
 * 
 * Fetches MELD available cryptocurrencies for a given country
 * Query params: countryCode (required)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get("countryCode");

  if (!countryCode) {
    return NextResponse.json(
      { error: "countryCode parameter is required" },
      { status: 400 }
    );
  }

  try {
    const cryptoCurrencies = await getMeldCryptoCurrencies(countryCode);
    return NextResponse.json(cryptoCurrencies);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch MELD cryptocurrencies";
    console.error("Error fetching MELD cryptocurrencies:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
