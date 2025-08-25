import type React from "react";

interface Step {
  key: string;
  label: string;
  step: number;
  icon?: React.ReactNode;
}

interface ModernStepperProps {
  currentStep: string;
  steps: Step[];
  loading?: boolean;
}

export default function ModernStepper({
  currentStep,
  steps,
  loading = false,
}: ModernStepperProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full mb-6">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="bg-card rounded-lg border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {steps[currentIndex]?.label}
            </span>
            <span className="text-sm font-medium text-foreground">
              {currentIndex + 1} / {steps.length}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-0.5 bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = index < currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground"
                    } ${loading ? "opacity-50" : ""}`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.step
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-1.5 text-center">
                    <span
                      className={`text-xs font-medium ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
