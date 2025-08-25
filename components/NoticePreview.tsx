import React, { useRef, useState, useEffect } from "react";
import DocumentIcon from "./icons/DocumentIcon";
import { PaymentNoticeContent, CompanyDetails, InvoiceData } from "../types";
import DownloadIcon from "./icons/DownloadIcon";

interface NoticePreviewProps {
  noticeContent: PaymentNoticeContent;
  ownCompanyDetails: CompanyDetails;
  invoiceData: InvoiceData;
}

const NoticePreview: React.FC<NoticePreviewProps> = ({
  noticeContent,
  ownCompanyDetails,
  invoiceData,
}) => {
  const noticeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [feesConfirmed, setFeesConfirmed] = useState(false);

  // Reset confirmation when new content is loaded
  useEffect(() => {
    setFeesConfirmed(false);
  }, [noticeContent]);

  const formatPlaceholders = (text: string): string => {
    return text.replace(
      /(\[.*?\])/g,
      '<span class="placeholder-span inline-block bg-amber-100 text-amber-800 font-medium py-0.5 px-2 rounded-md mx-1">$1</span>'
    );
  };

  const handleDownloadPdf = async () => {
    const element = noticeRef.current;
    if (!element) {
      alert("Der zu druckende Inhalt konnte nicht gefunden werden.");
      return;
    }

    setIsDownloading(true);

    const placeholders = Array.from(
      element.querySelectorAll<HTMLElement>(".placeholder-span")
    );
    const originalStyles = placeholders.map((p) => p.style.cssText);

    placeholders.forEach((p) => {
      p.style.backgroundColor = "transparent";
      p.style.color = "inherit";
      p.style.padding = "0";
      p.style.margin = "0";
      p.style.borderRadius = "0";
      p.style.display = "inline";
      p.style.fontWeight = "normal";
    });

    try {
      const { jsPDF } = jspdf;
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true,
      });

      await doc.html(element, {
        margin: [60, 60, 60, 60], // [top, right, bottom, left] in points
        autoPaging: "text",
        width: 475, // A4 width (595pt) - margins (60 + 60)
        windowWidth: element.scrollWidth,
      });

      doc.save(`Mahnung_${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(
        "Entschuldigung, beim Erstellen der PDF-Datei ist ein Fehler aufgetreten."
      );
    } finally {
      placeholders.forEach((p, i) => (p.style.cssText = originalStyles[i]));
      setIsDownloading(false);
    }
  };

  const getCityFromAddress = (address: string): string => {
    if (!address) return "";
    const postalCodeMatch = address.match(/\d{5}\s+([a-zA-Z\säöüÄÖÜß.-]+)$/);
    if (postalCodeMatch && postalCodeMatch[1]) {
      return postalCodeMatch[1].trim();
    }
    const commaParts = address.split(",");
    if (commaParts.length > 1) {
      const lastPart = commaParts[commaParts.length - 1].trim();
      const cityOnly = lastPart.replace(/\d+/g, "").trim();
      if (cityOnly) return cityOnly;
    }
    return "";
  };

  const city = getCityFromAddress(ownCompanyDetails.address);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-zinc-800 mb-4 flex items-center">
        <DocumentIcon className="w-7 h-7 text-indigo-500 mr-2.5" />
        Vorschau der generierten Mahnung
      </h2>
      <div className="rounded-lg border border-zinc-200/80 shadow-sm overflow-hidden">
        {/* The ref is now on an inner div to avoid capturing the parent's padding in the PDF */}
        <div className="bg-white p-8 sm:p-12">
          <div
            ref={noticeRef}
            style={{
              fontFamily: "sans-serif",
              color: "#334155",
              fontSize: "10pt",
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                fontSize: "9pt",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "0.5rem",
                marginBottom: "2rem",
              }}
            >
              <p style={{ fontWeight: "bold", margin: 0 }}>
                {ownCompanyDetails.name || "[Ihr Firmenname]"}
              </p>
              <p style={{ margin: 0 }}>
                {ownCompanyDetails.address || "[Ihre Adresse]"}
              </p>
              <p style={{ margin: 0 }}>
                {ownCompanyDetails.contact || "[Ihre Kontaktdaten]"}
              </p>
            </div>

            <table
              style={{
                width: "100%",
                marginBottom: "2rem",
                fontSize: "9pt",
                verticalAlign: "top",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ width: "60%" }}>
                    <p style={{ margin: 0 }}>An</p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      {invoiceData.clientName}
                    </p>
                    <div>
                      {invoiceData.clientAddress.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Ort:</strong>{" "}
                      {city ? (
                        city
                      ) : (
                        <span className="placeholder-span">[Ihre Stadt]</span>
                      )}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Datum:</strong>{" "}
                      {new Date().toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            <p
              style={{
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "2rem",
                fontSize: "12pt",
              }}
            >
              Betreff: {noticeContent.subject}
            </p>

            <p style={{ marginBottom: "1.5rem" }}>
              Sehr geehrte Damen und Herren,
            </p>

            {noticeContent.body.map((paragraph, index) => (
              <p
                key={index}
                style={{ marginBottom: "1rem" }}
                dangerouslySetInnerHTML={{
                  __html: formatPlaceholders(paragraph),
                }}
              />
            ))}

            <div
              style={{
                margin: "2rem 0",
                backgroundColor: "#f8fafc",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  fontStyle: "italic",
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                  fontSize: "10pt",
                }}
              >
                Forderungsaufstellung:
              </p>
              <table
                style={{
                  fontSize: "9pt",
                  color: "#334155",
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Hauptforderung:</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right" }}>
                      {noticeContent.demands.mainAmount}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Verzugszinsen:</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right" }}>
                      {noticeContent.demands.interestAmount}
                    </td>
                  </tr>
                  {noticeContent.demands.flatFee && (
                    <tr>
                      <td
                        style={{ padding: "0.25rem 0", verticalAlign: "top" }}
                      >
                        Verzugspauschale (§ 288 Abs. 5 BGB):
                      </td>
                      <td style={{ padding: "0.25rem 0", textAlign: "right" }}>
                        {noticeContent.demands.flatFee}
                      </td>
                    </tr>
                  )}
                  {/* Spacer row to ensure consistent spacing before the total line in the PDF */}
                  <tr>
                    <td colSpan={2} style={{ paddingTop: "0.5rem" }} />
                  </tr>
                  <tr
                    style={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      color: "#1e293b",
                    }}
                  >
                    <td
                      style={{
                        borderTop: "1px solid #cbd5e1",
                        paddingTop: "0.75rem",
                      }}
                    >
                      Gesamtbetrag:
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        borderTop: "1px solid #cbd5e1",
                        paddingTop: "0.75rem",
                      }}
                    >
                      {noticeContent.demands.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ margin: "1.5rem 0" }}>
              <p style={{ marginBottom: "0.5rem" }}>
                Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto:
              </p>
              <div
                style={{
                  backgroundColor: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontSize: "9pt",
                }}
              >
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>Bank:</strong>{" "}
                  {ownCompanyDetails.bankName ? (
                    ownCompanyDetails.bankName
                  ) : (
                    <span className="placeholder-span">[Name der Bank]</span>
                  )}
                </p>
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>IBAN:</strong>{" "}
                  {ownCompanyDetails.iban ? (
                    ownCompanyDetails.iban
                  ) : (
                    <span className="placeholder-span">[IBAN]</span>
                  )}
                </p>
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>BIC:</strong>{" "}
                  {ownCompanyDetails.bic ? (
                    ownCompanyDetails.bic
                  ) : (
                    <span className="placeholder-span">[BIC]</span>
                  )}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Verwendungszweck:</strong> Rechnung{" "}
                  {invoiceData.invoiceNumber} / {invoiceData.clientName}
                </p>
              </div>
            </div>

            <p style={{ marginBottom: "1rem" }}>Mit freundlichen Grüßen,</p>

            <div
              style={{ marginTop: "1rem", fontSize: "10pt", color: "#475569" }}
            >
              <p style={{ margin: 0 }}>
                {ownCompanyDetails.signerName || (
                  <span className="placeholder-span">[Ihr Name]</span>
                )}
              </p>
              <p style={{ margin: 0, fontSize: "9pt" }}>
                {ownCompanyDetails.name || (
                  <span className="placeholder-span">[Ihr Firmenname]</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-4">
        <div className="w-full bg-rose-50 p-3 rounded-lg border border-rose-200">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500 mt-1 flex-shrink-0"
              checked={feesConfirmed}
              onChange={(e) => setFeesConfirmed(e.target.checked)}
            />
            <span className="ml-3 text-sm text-rose-800">
              Ich bestätige, dass ich berechtigt bin, die in dieser Mahnung
              angegebenen Mahngebühren zu verlangen, und dass ich für die
              rechtliche Zulässigkeit der Höhe und Art der Mahngebühr selbst
              verantwortlich bin.
            </span>
          </label>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading || !feesConfirmed}
          className="self-end w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-sm disabled:bg-indigo-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isDownloading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Wird heruntergeladen...
            </>
          ) : (
            <>
              <DownloadIcon className="w-5 h-5 mr-2" />
              PDF herunterladen
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NoticePreview;
