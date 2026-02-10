import { NextRequest, NextResponse } from "next/server";
import { buildYellowCardPayload, YellowCardRecipient, YellowCardSource } from "../../../../lib/yellowcard";
import { buildMeldPayload } from "../../../../lib/meld";
import { fetchMerchantProfile } from "../../../../lib/akuunda-api";

interface OnRampRequest {
  merchantId: string;
  walletAddress: string;
  countryCode: string;
  engine: "MELD" | "YELLOWCARD";
  amount: number;
  currency: string;
  source?: YellowCardSource;
  serviceProvider?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OnRampRequest = await request.json();

    const { merchantId, walletAddress, countryCode, engine, amount, currency, source, serviceProvider } = body;

    // Validation
    if (!merchantId || !walletAddress || !countryCode || !engine || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (engine === "YELLOWCARD") {
      if (!source || !source.accountNumber || !source.networkId || !source.accountName || !source.phoneNumber) {
        return NextResponse.json(
          { error: "Missing YellowCard source information" },
          { status: 400 }
        );
      }

      try {
        // Fetch merchant profile from Akuunda API
        const { recipient: merchantProfile } = await fetchMerchantProfile(merchantId);

        // Build YellowCard payload
        const channelId = process.env.YELLOWCARD_CHANNEL_ID || "7c7e79fe-a82a-42ab-b35c-248aba8c49b3";
        const payload = buildYellowCardPayload(
          merchantProfile,
          source,
          amount,
          currency,
          countryCode,
          channelId
        );

        // Call the actual YellowCard API
        const yellowcardApiUrl = process.env.YELLOWCARD_API_URL;
        if (!yellowcardApiUrl) {
          console.error("YELLOWCARD_API_URL environment variable is not set");
          return NextResponse.json(
            { error: "YellowCard API configuration missing" },
            { status: 500 }
          );
        }

        const response = await fetch(yellowcardApiUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.YELLOWCARD_API_KEY}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`YellowCard API error: ${response.status} - ${errorText}`);
          return NextResponse.json(
            { error: `YellowCard API error: ${response.statusText}` },
            { status: response.status }
          );
        }

        const yellowcardResponse = await response.json();
        console.log("YellowCard response:", JSON.stringify(yellowcardResponse, null, 2));

        return NextResponse.json({
          success: true,
          engine: "YELLOWCARD",
          ...yellowcardResponse,
        });
      } catch (error: any) {
        console.error("Error calling YellowCard API:", error);
        return NextResponse.json(
          { error: error.message || "Failed to process YellowCard payment" },
          { status: 500 }
        );
      }
    }

    // MELD
    if (!serviceProvider) {
      return NextResponse.json(
        { error: "Missing serviceProvider for MELD" },
        { status: 400 }
      );
    }

    try {
      // Fetch merchant profile from Akuunda API
      const { userName } = await fetchMerchantProfile(merchantId);

      // Build MELD payload
      const payload = buildMeldPayload(
        userName,
        serviceProvider,
        currency,
        amount,
        countryCode
      );

      // Call the actual MELD API
      const meldApiUrl = process.env.MELD_API_URL;
      if (!meldApiUrl) {
        console.error("MELD_API_URL environment variable is not set");
        return NextResponse.json(
          { error: "MELD API configuration missing" },
          { status: 500 }
        );
      }

      const response = await fetch(meldApiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MELD_API_KEY}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`MELD API error: ${response.status} - ${errorText}`);
        return NextResponse.json(
          { error: `MELD API error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const meldResponse = await response.json();
      console.log("MELD response:", JSON.stringify(meldResponse, null, 2));

      // Extract redirect URL from MELD response
      const redirectUrl = meldResponse.redirectUrl || meldResponse.url;
      if (!redirectUrl) {
        console.error("No redirect URL in MELD response:", meldResponse);
        return NextResponse.json(
          { error: "Invalid MELD API response: missing redirect URL" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        engine: "MELD",
        redirectUrl,
        ...meldResponse,
      });
    } catch (error: any) {
      console.error("Error calling MELD API:", error);
      return NextResponse.json(
        { error: error.message || "Failed to process MELD payment" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating on-ramp:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
