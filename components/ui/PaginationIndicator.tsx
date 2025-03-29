interface PaginationIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function PaginationIndicator({
  currentStep,
  totalSteps,
}: PaginationIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step === currentStep
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>

          {step < totalSteps && <div className="w-12 h-1 bg-gray-300"></div>}
        </div>
      ))}
    </div>
  );
}
