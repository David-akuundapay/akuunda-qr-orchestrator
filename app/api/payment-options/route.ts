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
      const networksResponse = await getYellowCardNetworks(countryCode);
      const channelsResponse = await getYellowCardChannels(countryCode);
      
      // Ensure we have arrays - handle various response formats
      const networks = Array.isArray(networksResponse) 
        ? networksResponse 
        : (networksResponse as any)?.data && Array.isArray((networksResponse as any).data)
          ? (networksResponse as any).data
          : [];
      
      const channels = Array.isArray(channelsResponse)
        ? channelsResponse
        : (channelsResponse as any)?.data && Array.isArray((channelsResponse as any).data)
          ? (channelsResponse as any).data
          : [];
      
      console.log(`YellowCard networks for ${countryCode}:`, networks.length, 'items');
      console.log(`YellowCard channels for ${countryCode}:`, channels.length, 'items');
      
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
    const paymentMethodsResponse = await getMeldPaymentMethods(country.currency);
    const defaults = await getMeldDefaults(countryCode);
    
    // Ensure we have an array - handle various response formats
    const paymentMethods = Array.isArray(paymentMethodsResponse)
      ? paymentMethodsResponse
      : (paymentMethodsResponse as any)?.data && Array.isArray((paymentMethodsResponse as any).data)
        ? (paymentMethodsResponse as any).data
        : [];
    
    console.log(`MELD payment methods for ${country.currency}:`, paymentMethods.length, 'items');
    
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
