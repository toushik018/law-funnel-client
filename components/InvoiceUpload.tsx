"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";

interface InvoiceUploadProps {
  onFileProcessing: (file: File) => void;
  onBack: () => void;
}

export default function InvoiceUpload({
  onFileProcessing,
  onBack,
}: InvoiceUploadProps) {
  const [invoiceCorrectnessConfirmed, setInvoiceCorrectnessConfirmed] =
    useState(false);

  const handleFileSelect = (file: File) => {
    onFileProcessing(file);
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Upload Invoice
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload the invoice PDF to generate a legally-binding payment notice.
        </p>
      </div>

      <div className="mb-4 p-3 bg-warning/5 border border-warning/20 rounded-md">
        <label className="flex items-start space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary border-warning/30 rounded focus:ring-primary mt-0.5 flex-shrink-0"
            checked={invoiceCorrectnessConfirmed}
            onChange={(e) => setInvoiceCorrectnessConfirmed(e.target.checked)}
          />
          <div>
            <p className="text-xs font-medium text-warning-foreground mb-1">
              Legal Confirmation Required
            </p>
            <p className="text-xs text-warning-foreground/80 leading-relaxed">
              I confirm that all information in this invoice (including amount,
              payment terms, and recipient details) is complete and accurate,
              and I am responsible for its legal correctness.
            </p>
          </div>
        </label>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        disabled={!invoiceCorrectnessConfirmed}
      />

      <div className="mt-3 p-3 bg-muted/30 rounded-md border border-muted">
        <div className="flex items-start space-x-2">
          <svg
            className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-medium text-foreground mb-1">
              How it works
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customer details (name and address) are automatically extracted
              from your PDF invoice. You can review and edit them after the
              analysis is complete.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-1.5 border border-border text-muted-foreground rounded-md hover:bg-muted/50 transition-colors text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}
