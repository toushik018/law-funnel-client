"use client";

import { useState } from "react";
import type { ClientType } from "../types";

interface ClientTypeSelectionProps {
  initialClientType?: ClientType;
  onComplete: (clientType: ClientType) => void;
  onBack: () => void;
}

export default function ClientTypeSelection({
  initialClientType = "company",
  onComplete,
  onBack,
}: ClientTypeSelectionProps) {
  const [clientType, setClientType] = useState<ClientType>(initialClientType);

  const handleSubmit = () => {
    onComplete(clientType);
  };

  return (
    <div className="bg-background rounded-lg p-4 border border-border">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-emerald-50 rounded-md flex items-center justify-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5v.01m0 0V19m6 2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Kundentyp auswählen
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Wählen Sie den Typ des Kunden aus, an den Sie die Zahlungsaufforderung
          senden.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={() => setClientType("company")}
          className={`w-full p-3 rounded-md border transition-all duration-200 text-left ${
            clientType === "company"
              ? "border-emerald-500 bg-emerald-50"
              : "border-border hover:border-emerald-200 hover:bg-accent"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full border ${
                clientType === "company"
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-muted-foreground"
              }`}
            >
              {clientType === "company" && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Unternehmen/Firma
              </p>
              <p className="text-xs text-muted-foreground">
                Für Rechnungen zwischen Unternehmen
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setClientType("private")}
          className={`w-full p-3 rounded-md border transition-all duration-200 text-left ${
            clientType === "private"
              ? "border-emerald-500 bg-emerald-50"
              : "border-border hover:border-emerald-200 hover:bg-accent"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full border ${
                clientType === "private"
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-muted-foreground"
              }`}
            >
              {clientType === "private" && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Privatperson
              </p>
              <p className="text-xs text-muted-foreground">
                Für Rechnungen an Privatkunden
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-2 px-4 text-sm rounded-md font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          Weiter zum Hochladen
        </button>
      </div>
    </div>
  );
}
