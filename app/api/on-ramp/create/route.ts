import { NextRequest, NextResponse } from "next/server";
import { buildYellowCardPayload, YellowCardRecipient, YellowCardSource } from "../../../../lib/yellowcard";
import { buildMeldPayload } from "../../../../lib/meld";
import { fetchMerchantProfile } from "../../../../lib/akuunda-api";
import { createYellowCardCollection } from "../../../../lib/yellowcard-api";
import { createMeldSession } from "../../../../lib/meld-api";

interface OnRampRequest {
  merchantId: string;
  walletAddress: string;
  countryCode: string;
  engine: "MELD" | "YELLOWCARD";
  amount: number;
  currency: string;
  source?: YellowCardSource;
  serviceProvider?: string;
  channelId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OnRampRequest = await request.json();

    const { merchantId, walletAddress, countryCode, engine, amount, currency, source, serviceProvider, channelId } = body;

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

      if (!channelId) {
        return NextResponse.json(
          { error: "Missing channelId for YellowCard" },
          { status: 400 }
        );
      }

      try {
        // Fetch merchant profile from Akuunda API (now uses authenticated GET)
        const { recipient: merchantProfile } = await fetchMerchantProfile(merchantId);

        // Build YellowCard payload
        const payload = buildYellowCardPayload(
          merchantProfile,
          source,
          amount,
          currency,
          countryCode,
          channelId
        );

        // Call internal YellowCard API endpoint (authenticated via Keycloak)
        const yellowcardResponse = await createYellowCardCollection(payload);
        console.log("YellowCard response:", JSON.stringify(yellowcardResponse, null, 2));

        return NextResponse.json({
          success: true,
          engine: "YELLOWCARD",
          ...yellowcardResponse,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to process YellowCard payment";
        console.error("Error calling YellowCard API:", error);
        return NextResponse.json(
          { error: errorMessage },
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
      // Fetch merchant profile from Akuunda API (now uses authenticated GET)
      const { userName } = await fetchMerchantProfile(merchantId);

      // Build MELD payload
      const payload = buildMeldPayload(
        userName,
        serviceProvider,
        currency,
        amount,
        countryCode
      );

      // Call internal MELD API endpoint (authenticated via Keycloak)
      const meldResponse = await createMeldSession(payload);
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process MELD payment";
      console.error("Error calling MELD API:", error);
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error creating on-ramp:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
