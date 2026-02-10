import { NextRequest, NextResponse } from "next/server";
import { getYellowCardRates } from "../../../../lib/yellowcard-api";

/**
 * GET /api/yellowcard/rates
 * 
 * Fetches YellowCard exchange rates for a given currency
 * Query params: currencyCode (required)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currencyCode = searchParams.get("currencyCode");

  if (!currencyCode) {
    return NextResponse.json(
      { error: "currencyCode parameter is required" },
      { status: 400 }
    );
  }

  try {
    const rates = await getYellowCardRates(currencyCode);
    return NextResponse.json(rates);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch YellowCard rates";
    console.error("Error fetching YellowCard rates:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
