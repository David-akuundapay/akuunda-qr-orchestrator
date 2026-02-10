import { NextRequest, NextResponse } from "next/server";
import { getYellowCardChannels } from "../../../../lib/yellowcard-api";

/**
 * GET /api/yellowcard/channels
 * 
 * Fetches YellowCard payment channels for a given country
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
    const channels = await getYellowCardChannels(countryCode);
    return NextResponse.json(channels);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch YellowCard channels";
    console.error("Error fetching YellowCard channels:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
