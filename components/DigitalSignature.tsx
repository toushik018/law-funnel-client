"use client";

import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import useCaseStore from "../stores/caseStore";

export interface DigitalSignatureData {
  signature: string; // Base64 encoded signature (for display only)
  powerOfAttorneyConfirmed: boolean;
  signatureDate: string;
  signerName: string;
  isCompleted: boolean; // New field for backend boolean status
}

interface DigitalSignatureProps {
  userName: string;
  onComplete: (data: DigitalSignatureData) => void;
  onBack: () => void;
}

export default function DigitalSignature({
  userName,
  onComplete,
  onBack,
}: DigitalSignatureProps) {
  const { currentCase, updateDigitalSignatureStatus, loading, error } =
    useCaseStore();

  const signatureRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [powerOfAttorneyConfirmed, setPowerOfAttorneyConfirmed] =
    useState(false);
  const [localError, setLocalError] = useState<string>("");
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 200 });

  // Initialize state from current case if signature is already completed
  useEffect(() => {
    if (currentCase?.isDigitalSignatureCompleted) {
      setHasSignature(true);
      setPowerOfAttorneyConfirmed(true);
    }
  }, [currentCase?.isDigitalSignatureCompleted]);

  // Fix: keep canvas pixel resolution in sync with display size + Retina scale
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current || !signatureRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const width = Math.min(600, containerWidth - 20); // 10px padding each side
      const height = 200;

      // Set displayed (CSS) size
      setCanvasSize({ width, height });

      // Handle HiDPI/Retina so coordinates match and lines are crisp
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const canvas = signatureRef.current.getCanvas();
      const ctx = canvas.getContext("2d");

      // Preserve existing strokes during resize
      const existing = signatureRef.current.toData();

      // Set internal bitmap resolution (actual pixels)
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);

      // Set CSS size (what the user sees)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        // Map 1 unit in API to 1 CSS pixel
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset just in case
        ctx.scale(ratio, ratio);

        // Ensure white background (optional but matches your previous look)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      // Restore strokes (if any)
      if (existing && existing.length) {
        signatureRef.current.fromData(existing);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleSignatureStart = () => {
    setHasSignature(true);
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setHasSignature(false);
    }
  };

  const handleSubmit = async () => {
    setLocalError("");

    if (!hasSignature || !signatureRef.current) {
      setLocalError(
        "Bitte stellen Sie Ihre digitale Unterschrift zur Verfügung"
      );
      return;
    }

    if (!powerOfAttorneyConfirmed) {
      setLocalError("Sie müssen die Vollmachtsvereinbarung bestätigen");
      return;
    }

    if (signatureRef.current.isEmpty()) {
      setLocalError(
        "Bitte stellen Sie Ihre digitale Unterschrift zur Verfügung"
      );
      return;
    }

    try {
      // Update backend with boolean status (not signature data)
      await updateDigitalSignatureStatus(true);

      // Keep signature data for local display/callback (not sent to backend)
      const signatureData = signatureRef.current.toDataURL();

      const data: DigitalSignatureData = {
        signature: signatureData, // For local display only
        powerOfAttorneyConfirmed: true,
        signatureDate: new Date().toISOString(),
        signerName: userName,
        isCompleted: true, // Boolean status for backend
      };

      onComplete(data);
    } catch (error) {
      console.error("Failed to save signature status:", error);
      // Error is handled by the store, but we show additional feedback
      setLocalError(
        "Unterschriftsstatus konnte nicht gespeichert werden. Bitte versuchen Sie es erneut."
      );
    }
  };

  return (
    <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Digitale Unterschrift & Vollmacht
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Unterschreiben Sie digital, um die Vollmacht zu bestätigen und die
          Erstellung rechtsgültiger Zahlungsaufforderungen zu autorisieren.
        </p>
      </div>

      <div className="space-y-4">
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
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
                <p className="text-xs font-medium text-red-800">Fehler</p>
                <p className="text-xs text-red-700 mt-0.5">
                  {error || localError}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentCase?.isDigitalSignatureCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
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
                <p className="text-xs font-medium text-emerald-800">
                  Unterschrift abgeschlossen
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Der digitale Unterschriftsstatus wurde in Ihrem Fall
                  gespeichert.
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground mb-2">
            Digitale Unterschrift <span className="text-red-500">*</span>
          </label>
          <div
            ref={containerRef}
            className="border border-dashed border-border rounded-lg p-2"
          >
            <div
              className="border border-border rounded bg-background"
              style={{
                width: "100%",
                height: `${canvasSize.height}px`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <SignatureCanvas
                ref={signatureRef}
                penColor="#1f2937"
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  style: {
                    display: "block",
                    touchAction: "none",
                    cursor: "crosshair",
                    userSelect: "none",
                  },
                }}
                onBegin={handleSignatureStart}
                backgroundColor="#ffffff"
                throttle={8}
                minWidth={1}
                maxWidth={2}
                velocityFilterWeight={0.7}
                dotSize={1}
              />
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-xs text-muted-foreground">
                Unterschreiben Sie oben mit Ihrer Maus oder Ihrem Touchgerät
              </p>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-emerald-600 hover:text-emerald-800 underline"
              >
                Unterschrift löschen
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={powerOfAttorneyConfirmed}
              onChange={(e) => setPowerOfAttorneyConfirmed(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-amber-300 rounded focus:ring-emerald-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-amber-800">
                Ich bestätige und stimme der Vollmacht zu{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Durch das Ankreuzen dieses Kästchens und das Bereitstellen
                meiner digitalen Unterschrift autorisiere ich LegalTech
                Solutions Inc. rechtlich, in meinem Namen für die Erstellung und
                Durchsetzung von Zahlungsaufforderungen zu handeln. Ich verstehe
                die rechtlichen Konsequenzen und bestätige, dass ich die
                Befugnis habe, diese Vollmacht zu erteilen.
              </p>
            </div>
          </label>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
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
              <p className="text-xs font-medium text-red-800">
                Rechtliche Verantwortung
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Ihre digitale Unterschrift erstellt eine rechtlich bindende
                Vereinbarung. Sie sind verantwortlich für die Richtigkeit aller
                bereitgestellten Informationen und die rechtlichen Konsequenzen
                autorisierter Handlungen.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors text-sm"
          >
            Zurück
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasSignature || !powerOfAttorneyConfirmed || loading}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
              hasSignature && powerOfAttorneyConfirmed && !loading
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-current"
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
              {loading
                ? "Speichere..."
                : "Autorisierung abschließen & Fortfahren"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
