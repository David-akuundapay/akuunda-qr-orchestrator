import { NextRequest, NextResponse } from "next/server";
import { getMeldDefaults } from "../../../../lib/meld-api";

/**
 * GET /api/meld/defaults
 * 
 * Fetches MELD default configuration for a given country
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
    const defaults = await getMeldDefaults(countryCode);
    return NextResponse.json(defaults);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch MELD defaults";
    console.error("Error fetching MELD defaults:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
