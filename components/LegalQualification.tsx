"use client";

import type React from "react";
import { useState, useEffect } from "react";
import useCaseStore from "../stores/caseStore";
import { DatePicker } from "./ui/DatePicker";
import { format } from "date-fns";

export interface LegalQualificationData {
  contractSituation: string;
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
        invoiceSentDate: answers.invoiceSentDate || "",
      };
    }
    return {
      contractSituation: "",
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
      newErrors.contractSituation =
        "Bitte beschreiben Sie die Vertragssituation";
    }

    if (!formData.invoiceSentDate) {
      newErrors.invoiceSentDate =
        "Bitte geben Sie an, wann die Rechnung gesendet wurde";
    }

    // Validate 30-day minimum requirement for invoice sent date
    if (formData.invoiceSentDate) {
      const invoiceSentDate = new Date(formData.invoiceSentDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (invoiceSentDate > thirtyDaysAgo) {
        newErrors.invoiceSentDate =
          "Das Rechnungsdatum muss mindestens 30 Tage zurückliegen";
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
            Rechtliche Fragen
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Beantworten Sie diese Fragen, um sich für die Erstellung einer
          rechtsgültigen Zahlungsaufforderung zu qualifizieren.
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
                <p className="text-sm font-medium text-destructive">Fehler</p>
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
                <p className="text-sm font-medium text-emerald-800">
                  Gespeichert
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Antworten zur rechtlichen Qualifikation wurden in Ihrem Fall
                  gespeichert.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Contract Situation */}
          <div>
            <label
              htmlFor="contractSituation"
              className="block text-sm font-medium text-foreground mb-3"
            >
              Vertragsdetails <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <textarea
                id="contractSituation"
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed ${
                  errors.contractSituation
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-emerald-300"
                }`}
                placeholder="Bitte beschreiben Sie:\n• Vertragsbestimmungen und Vereinbarungen\n• Zahlungsvereinbarungen\n• Aktuelle Situation oder Streitfall\n• Weitere relevante Details"
                value={formData.contractSituation}
                onChange={(e) =>
                  handleInputChange("contractSituation", e.target.value)
                }
              />
              <div
                className={`absolute bottom-3 right-3 text-xs px-2 py-1 rounded ${
                  formData.contractSituation.length > 450
                    ? "bg-amber-100 text-amber-700"
                    : formData.contractSituation.length > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {formData.contractSituation.length}/500
              </div>
            </div>
            {errors.contractSituation && (
              <p className="mt-2 text-sm text-destructive flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.contractSituation}
              </p>
            )}
          </div>

          {/* Invoice Date */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-emerald-600"
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
              <h3 className="text-sm font-medium text-foreground">
                Rechnungsdatum
              </h3>
            </div>

            <div className="max-w-sm">
              <label
                htmlFor="invoiceSentDate"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Wann wurde die Rechnung gesendet?{" "}
                <span className="text-destructive">*</span>
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
                placeholder="📅 Rechnungsdatum auswählen"
                maxDate={(() => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return thirtyDaysAgo;
                })()}
                className={
                  errors.invoiceSentDate
                    ? "border-destructive bg-destructive/5"
                    : ""
                }
              />

              <div className="mt-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded p-2">
                ⚠️ Die Rechnung muss für rechtliche Schritte mindestens 30 Tage
                alt sein
              </div>

              {errors.invoiceSentDate && (
                <p className="mt-2 text-sm text-destructive flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.invoiceSentDate}
                </p>
              )}
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
                Rechtliche Informationen
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Durch die Bereitstellung dieser Informationen bestätigen Sie,
                dass diese Angaben korrekt sind und zur Bewertung der
                rechtlichen Gültigkeit der Erstellung einer Zahlungsaufforderung
                verwendet werden.
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
              Zurück
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
              {loading ? "Speichere..." : "Weiter zur digitalen Unterschrift"}
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
