import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "../../../lib/countries";
import { getYellowCardNetworks, getYellowCardChannels } from "../../../lib/yellowcard-api";
import { getMeldPaymentMethods, getMeldDefaults } from "../../../lib/meld-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get("countryCode");

  if (!countryCode) {
    return NextResponse.json(
      { error: "countryCode parameter is required" },
      { status: 400 }
    );
  }

  const country = getCountryByCode(countryCode);
  
  if (!country) {
    return NextResponse.json(
      { error: "Invalid country code" },
      { status: 400 }
    );
  }

  try {
    if (country.engine === "YELLOWCARD") {
      // Fetch real networks and channels from YellowCard API
      const networks = await getYellowCardNetworks(countryCode);
      const channels = await getYellowCardChannels(countryCode);
      
      return NextResponse.json({
        engine: "YELLOWCARD",
        country: country.code,
        currency: country.currency,
        channels: channels,
        paymentMethods: networks.map(n => ({
          id: n.networkId,
          label: n.label,
          type: "mobile_money"
        }))
      });
    }

    // MELD - Fetch real payment methods from API
    const paymentMethods = await getMeldPaymentMethods(country.currency);
    const defaults = await getMeldDefaults(countryCode);
    
    return NextResponse.json({
      engine: "MELD",
      country: country.code,
      currency: country.currency,
      defaults: defaults,
      paymentMethods: paymentMethods.map(m => ({
        id: m.id,
        label: m.label,
        type: m.type || "card"
      }))
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch payment options";
    console.error("Error fetching payment options:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
