import { NextRequest, NextResponse } from "next/server";
import { buildYellowCardPayload, YellowCardRecipient, YellowCardSource } from "../../../../lib/yellowcard";
import { buildMeldPayload } from "../../../../lib/meld";

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

// Mock merchant data - in production, this would come from a database
const MOCK_MERCHANT_PROFILE: Record<string, YellowCardRecipient> = {
  default: {
    name: "Kouassi David",
    country: "CI",
    phone: "0033612108828",
    address: "Non spécifié",
    email: "amandavidk@yahoo.com",
    dob: "10/30/1997",
    idNumber: "25AA74989",
    idType: "passport",
    additionalIdType: "",
    additionalIdNumber: "",
  },
};

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

      // Get merchant profile (in production, fetch from database using merchantId)
      const merchantProfile = MOCK_MERCHANT_PROFILE[merchantId] || MOCK_MERCHANT_PROFILE.default;

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

      // In production, call the actual YellowCard API
      // const response = await fetch(YELLOWCARD_API_URL, {
      //   method: "POST",
      //   headers: { 
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${process.env.YELLOWCARD_API_KEY}`
      //   },
      //   body: JSON.stringify(payload),
      // });

      // Mock response for now
      console.log("YellowCard payload:", JSON.stringify(payload, null, 2));

      return NextResponse.json({
        success: true,
        engine: "YELLOWCARD",
        transactionId: `YC-${Date.now()}`,
        status: "pending",
        message: "Payment initiated successfully",
      });
    }

    // MELD
    if (!serviceProvider) {
      return NextResponse.json(
        { error: "Missing serviceProvider for MELD" },
        { status: 400 }
      );
    }

    // Get merchant profile for userName (in production, fetch from database)
    const merchantProfile = MOCK_MERCHANT_PROFILE[merchantId] || MOCK_MERCHANT_PROFILE.default;
    const userName = merchantProfile.phone;

    // Build MELD payload
    const payload = buildMeldPayload(
      userName,
      serviceProvider,
      currency,
      amount,
      countryCode
    );

    // In production, call the actual MELD API
    // const response = await fetch(MELD_API_URL, {
    //   method: "POST",
    //   headers: { 
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.MELD_API_KEY}`
    //   },
    //   body: JSON.stringify(payload),
    // });

    // Mock response for now
    console.log("MELD payload:", JSON.stringify(payload, null, 2));

    // Mock redirect URL
    const mockRedirectUrl = `https://meld-widget.example.com/session?id=MELD-${Date.now()}`;

    return NextResponse.json({
      success: true,
      engine: "MELD",
      redirectUrl: mockRedirectUrl,
      sessionId: `MELD-${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Error creating on-ramp:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
