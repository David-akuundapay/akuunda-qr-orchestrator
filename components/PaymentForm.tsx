interface PaymentFormProps {
  engine: "MELD" | "YELLOWCARD";
  currency: string;
  amount: string;
  accountName: string;
  phoneNumber: string;
  onAmountChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export default function PaymentForm({
  engine,
  currency,
  amount,
  accountName,
  phoneNumber,
  onAmountChange,
  onAccountNameChange,
  onPhoneNumberChange,
}: PaymentFormProps) {
  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Montant et informations</h2>
      
      {/* Amount Input */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
          Montant ({currency})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="100"
          min="1"
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* YellowCard specific fields */}
      {engine === "YELLOWCARD" && (
        <>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Nom sur le compte Mobile Money
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => onAccountNameChange(e.target.value)}
              placeholder="Ex: Jean Dupont"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #E0E0E0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Numéro Mobile Money
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              placeholder="+225 07 XX XX XX XX"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #E0E0E0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Format international (ex: +2250709997042)
            </div>
          </div>
        </>
      )}
    </div>
  );
}
