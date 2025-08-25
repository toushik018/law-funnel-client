"use client";

import type React from "react";
import { useState, useEffect } from "react";
import useCaseStore from "../stores/caseStore";
import { DatePicker } from "./ui/DatePicker";
import { format } from "date-fns";

export interface LegalQualificationData {
  contractSituation: string;
  fulfillmentDate: string;
  invoiceWrittenDate: string;
  invoiceSentDate: string;
}

interface LegalQualificationProps {
  onComplete: (data: LegalQualificationData) => void;
  onBack?: () => void;
}

export default function LegalQualification({
  onComplete,
  onBack,
}: LegalQualificationProps) {
  const { currentCase, updateLegalQualification, loading, error } =
    useCaseStore();

  // Initialize form data from current case if available
  const [formData, setFormData] = useState<LegalQualificationData>(() => {
    if (currentCase?.legalQualificationAnswers) {
      const answers = currentCase.legalQualificationAnswers;
      return {
        contractSituation: answers.contractSituation || "",
        fulfillmentDate: answers.fulfillmentDate || "",
        invoiceWrittenDate: answers.invoiceWrittenDate || "",
        invoiceSentDate: answers.invoiceSentDate || "",
      };
    }
    return {
      contractSituation: "",
      fulfillmentDate: "",
      invoiceWrittenDate: "",
      invoiceSentDate: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when case data changes
  useEffect(() => {
    if (currentCase?.legalQualificationAnswers) {
      const answers = currentCase.legalQualificationAnswers;
      setFormData({
        contractSituation: answers.contractSituation || "",
        fulfillmentDate: answers.fulfillmentDate || "",
        invoiceWrittenDate: answers.invoiceWrittenDate || "",
        invoiceSentDate: answers.invoiceSentDate || "",
      });
    }
  }, [currentCase?.legalQualificationAnswers]);

  const handleInputChange = (
    field: keyof LegalQualificationData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (
    field: keyof LegalQualificationData,
    date: Date | undefined
  ) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    handleInputChange(field, dateString);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractSituation.trim()) {
      newErrors.contractSituation = "Please describe the contract situation";
    }

    if (!formData.fulfillmentDate) {
      newErrors.fulfillmentDate = "Please provide the fulfillment date";
    }

    if (!formData.invoiceWrittenDate) {
      newErrors.invoiceWrittenDate =
        "Please provide when the invoice was written";
    }

    if (!formData.invoiceSentDate) {
      newErrors.invoiceSentDate = "Please provide when the invoice was sent";
    }

    // Validate date logic
    if (formData.fulfillmentDate && formData.invoiceWrittenDate) {
      const fulfillmentDate = new Date(formData.fulfillmentDate);
      const invoiceWrittenDate = new Date(formData.invoiceWrittenDate);

      if (invoiceWrittenDate < fulfillmentDate) {
        newErrors.invoiceWrittenDate =
          "Invoice written date should be after fulfillment date";
      }
    }

    if (formData.invoiceWrittenDate && formData.invoiceSentDate) {
      const invoiceWrittenDate = new Date(formData.invoiceWrittenDate);
      const invoiceSentDate = new Date(formData.invoiceSentDate);

      if (invoiceSentDate < invoiceWrittenDate) {
        newErrors.invoiceSentDate =
          "Invoice sent date should be after written date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Call the completion callback - this will create the case and save the data
        onComplete(formData);
      } catch (error) {
        console.error("Failed to complete legal qualification:", error);
        // Error handling can be improved here if needed
      }
    }
  };

  const isFormValid = Object.values(formData).every(
    (value) => (value || "").trim() !== ""
  );

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 bg-emerald-100 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Legal Questions
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Answer these questions to qualify for creating a legally-binding
          payment notice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {currentCase?.legalQualificationAnswers && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-emerald-800">Saved</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Legal qualification answers have been saved to your case.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Contract Situation - Full Width */}
          <div>
            <label
              htmlFor="contractSituation"
              className="block text-sm font-medium text-foreground mb-2"
            >
              What is the situation with the contract?{" "}
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <textarea
                id="contractSituation"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm ${
                  errors.contractSituation
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-emerald-300"
                }`}
                placeholder="Describe the contract terms, agreements, and current status in detail..."
                value={formData.contractSituation}
                onChange={(e) =>
                  handleInputChange("contractSituation", e.target.value)
                }
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {formData.contractSituation.length}/500
              </div>
            </div>
            {errors.contractSituation && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.contractSituation}</span>
              </p>
            )}
          </div>

          {/* Date Fields - Responsive Grid Layout */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="fulfillmentDate"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Fulfillment Date <span className="text-destructive">*</span>
                </label>
                <DatePicker
                  id="fulfillmentDate"
                  date={
                    formData.fulfillmentDate
                      ? new Date(formData.fulfillmentDate)
                      : undefined
                  }
                  onDateChange={(date) =>
                    handleDateChange("fulfillmentDate", date)
                  }
                  placeholder="Select date"
                  className={
                    errors.fulfillmentDate
                      ? "border-destructive bg-destructive/5"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When was the service/product delivered?
                </p>
                {errors.fulfillmentDate && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errors.fulfillmentDate}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="invoiceWrittenDate"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Invoice Written <span className="text-destructive">*</span>
                </label>
                <DatePicker
                  id="invoiceWrittenDate"
                  date={
                    formData.invoiceWrittenDate
                      ? new Date(formData.invoiceWrittenDate)
                      : undefined
                  }
                  onDateChange={(date) =>
                    handleDateChange("invoiceWrittenDate", date)
                  }
                  placeholder="Select date"
                  className={
                    errors.invoiceWrittenDate
                      ? "border-destructive bg-destructive/5"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When was the invoice created?
                </p>
                {errors.invoiceWrittenDate && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errors.invoiceWrittenDate}</span>
                  </p>
                )}
              </div>

              <div className="md:col-span-2 lg:col-span-1">
                <label
                  htmlFor="invoiceSentDate"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Invoice Sent <span className="text-destructive">*</span>
                </label>
                <DatePicker
                  id="invoiceSentDate"
                  date={
                    formData.invoiceSentDate
                      ? new Date(formData.invoiceSentDate)
                      : undefined
                  }
                  onDateChange={(date) =>
                    handleDateChange("invoiceSentDate", date)
                  }
                  placeholder="Select date"
                  className={
                    errors.invoiceSentDate
                      ? "border-destructive bg-destructive/5"
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When was the invoice delivered?
                </p>
                {errors.invoiceSentDate && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errors.invoiceSentDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">
                Legal Information
              </p>
              <p className="text-xs text-amber-700 mt-1">
                By providing this information, you confirm these details are
                accurate and will be used to assess the legal validity of
                creating a payment notice.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors text-sm font-medium"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`flex-1 py-2 px-6 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              isFormValid && !loading
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span>
              {loading ? "Saving..." : "Continue to Digital Signature"}
            </span>
            {!loading && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
