interface ReviewStepProps {
  countryName: string;
  countryFlag: string;
  engine: "MELD" | "YELLOWCARD";
  paymentMethod: string;
  provider: string | null;
  amount: string;
  currency: string;
  merchantId: string;
  walletAddress: string;
  accountName?: string;
  phoneNumber?: string;
}

export default function ReviewStep({
  countryName,
  countryFlag,
  engine,
  paymentMethod,
  provider,
  amount,
  currency,
  merchantId,
  walletAddress,
  accountName,
  phoneNumber,
}: ReviewStepProps) {
  const truncateWallet = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Vérification</h2>
      
      <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "24px"
      }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Pays</div>
          <div style={{ fontSize: "16px", fontWeight: "600" }}>
            {countryFlag} {countryName}
          </div>
        </div>

        {engine === "MELD" && provider && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Fournisseur</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>{provider}</div>
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Méthode de paiement</div>
          <div style={{ fontSize: "16px", fontWeight: "600" }}>{paymentMethod}</div>
        </div>

        {engine === "YELLOWCARD" && accountName && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Nom du compte</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>{accountName}</div>
          </div>
        )}

        {engine === "YELLOWCARD" && phoneNumber && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Numéro</div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>{phoneNumber}</div>
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Montant</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#4CAF50" }}>
            {amount} {currency}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: "#e3f2fd", 
        padding: "16px", 
        borderRadius: "8px",
        fontSize: "14px"
      }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ color: "#666" }}>Commerçant ID:</span>{" "}
          <span style={{ fontWeight: "600" }}>{merchantId}</span>
        </div>
        <div>
          <span style={{ color: "#666" }}>Portefeuille:</span>{" "}
          <span style={{ fontWeight: "600", fontFamily: "monospace" }}>
            {truncateWallet(walletAddress)}
          </span>
        </div>
      </div>
    </div>
  );
}
