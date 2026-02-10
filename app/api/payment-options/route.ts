import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_CONFIG } from "@/config/countries";
import { PaymentOptionsResponse } from "@/types/payment";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get("countryCode")?.toUpperCase();

  if (!countryCode) {
    return NextResponse.json(
      { error: "countryCode_required" },
      { status: 400 }
    );
  }

  const config = COUNTRY_CONFIG[countryCode];

  if (!config) {
    return NextResponse.json(
      { error: "country_not_supported" },
      { status: 404 }
    );
  }

  const response: PaymentOptionsResponse = {
    countryCode,
    currency: config.currency,
    providers: config.providers,
  };

  return NextResponse.json(response);
}
