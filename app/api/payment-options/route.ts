import { NextRequest, NextResponse } from "next/server";
import { YELLOWCARD_NETWORKS } from "../../../lib/yellowcard";
import { MELD_PAYMENT_METHODS, MELD_SERVICE_PROVIDERS, getCountryByCode } from "../../../lib/countries";

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

  if (country.engine === "YELLOWCARD") {
    const networks = YELLOWCARD_NETWORKS[countryCode] || [];
    return NextResponse.json({
      engine: "YELLOWCARD",
      country: country.code,
      currency: country.currency,
      paymentMethods: networks.map(n => ({
        id: n.networkId,
        label: n.label,
        type: "mobile_money"
      }))
    });
  }

  // MELD
  const paymentMethods = MELD_PAYMENT_METHODS[countryCode] || [];
  return NextResponse.json({
    engine: "MELD",
    country: country.code,
    currency: country.currency,
    providers: MELD_SERVICE_PROVIDERS,
    paymentMethods: paymentMethods.map(m => ({
      id: m.id,
      label: m.label,
      type: "card"
    }))
  });
}
