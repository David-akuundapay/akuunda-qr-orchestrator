import { YellowCardRecipient } from "./yellowcard";
import { internalGet } from "./internal-api";

interface AkuundaWallet {
  id: string;
  walletType: string;
  createdAt: string | null;
  description: string;
  balance: number;
  userBalance: number;
  merchandAkunnda: boolean;
  currencyCode: string;
  countryCode: string;
  continentName: string;
  countryName: string;
  walletAddress: string;
}

interface AkuundaUserData {
  userId: string;
  username: string;
  mobilePhone: string;
  password: string | null;
  email: string;
  genre: string | null;
  firstname: string;
  lastname: string;
  createdAt: string;
  dateNaissance: string | null;
  typeCompte: string;
  emailVerified: boolean;
  enabled: boolean;
  identityVerify: boolean;
  pinCode: string | null;
  siret: string | null;
  dateCreation: string | null;
  raisonSociale: string | null;
  adresse: string | null;
  cguAcceptationDate: string | null;
  cguAcceptation: boolean;
  wallets: AkuundaWallet[];
}

interface AkuundaApiResponse {
  status: string;
  message: string;
  data: AkuundaUserData;
}

/**
 * Fetches merchant profile from Akuunda API
 * @param merchantId - The username/userId of the merchant
 * @returns Merchant profile mapped to YellowCardRecipient format
 */
export async function fetchMerchantProfile(merchantId: string): Promise<{
  recipient: YellowCardRecipient;
  userName: string;
}> {
  try {
    // Use GET method with username as query parameter
    const data: AkuundaApiResponse = await internalGet<AkuundaApiResponse>(
      "/api/internal/v1/users/akuunda/getUser",
      { username: merchantId }
    );

    if (data.status !== "success" || !data.data) {
      throw new Error("Invalid response from Akuunda API");
    }

    const userData = data.data;

    // Validate that merchant has at least one wallet
    if (!userData.wallets || userData.wallets.length === 0) {
      throw new Error("Merchant has no wallets configured");
    }

    // Map API response to YellowCardRecipient
    const recipient: YellowCardRecipient = {
      name: `${userData.firstname} ${userData.lastname}`.trim(),
      country: userData.wallets[0].countryCode,
      phone: userData.mobilePhone,
      address: userData.adresse || "Not specified",
      email: userData.email,
      dob: userData.dateNaissance || "",
      idNumber: "",
      idType: "",
      additionalIdType: "",
      additionalIdNumber: "",
    };

    // userName for MELD is the merchant's phone number
    const userName = userData.mobilePhone;

    return { recipient, userName };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching merchant profile:", error);
    throw new Error(`Failed to fetch merchant profile: ${errorMessage}`);
  }
}
