import { NextRequest, NextResponse } from "next/server";
import { getYellowCardNetworks } from "../../../../lib/yellowcard-api";

/**
 * GET /api/yellowcard/networks
 * 
 * Fetches YellowCard mobile money networks for a given country
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
    const networks = await getYellowCardNetworks(countryCode);
    return NextResponse.json(networks);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch YellowCard networks";
    console.error("Error fetching YellowCard networks:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
