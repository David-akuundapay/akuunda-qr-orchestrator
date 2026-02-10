interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
        Étape {currentStep} sur {totalSteps}
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            style={{
              width: "40px",
              height: "6px",
              borderRadius: "3px",
              backgroundColor: index < currentStep ? "#4CAF50" : "#E0E0E0",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
