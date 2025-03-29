interface PaginationIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function PaginationIndicator({
  currentStep,
  totalSteps,
}: PaginationIndicatorProps) {
  return (
    <div className="flex justify-center items-center mt-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>

          {step < totalSteps && (
            <div className="mx-2">
              <div
                className={`w-12 h-1 ${
                  currentStep >= step + 1 ? "bg-primary" : "bg-gray-300"
                }`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
