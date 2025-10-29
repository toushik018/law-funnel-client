import React, { useRef } from "react";
import DocumentIcon from "./icons/DocumentIcon";
import { PaymentNoticeContent, CompanyDetails, InvoiceData } from "../types";

interface NoticePreviewProps {
  noticeContent: PaymentNoticeContent;
  ownCompanyDetails: CompanyDetails;
  invoiceData: InvoiceData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const NoticePreview: React.FC<NoticePreviewProps> = ({ noticeContent, ownCompanyDetails, invoiceData, onSubmit, isSubmitting }) => {
  const noticeRef = useRef<HTMLDivElement>(null);

  const formatPlaceholders = (text: string): string => {
    return text.replace(/(\[.*?\])/g, '<span class="placeholder-span inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 mx-1 text-xs">$1</span>');
  };

  const getCityFromAddress = (address: string): string => {
    if (!address) return "";

    // Strategy 1: Full German format (12345 Berlin)
    const postalCodeMatch = address.match(/\d{5}\s+([a-zA-Z\säöüÄÖÜß.-]+)$/);
    if (postalCodeMatch && postalCodeMatch[1]) {
      return postalCodeMatch[1].trim();
    }

    // Strategy 2: Comma-separated format (Street, City)
    const commaParts = address.split(",");
    if (commaParts.length > 1) {
      const lastPart = commaParts[commaParts.length - 1].trim();
      const cityOnly = lastPart.replace(/\d+/g, "").trim();
      if (cityOnly && cityOnly.length > 2) return cityOnly;
    }

    // Strategy 3: Known German city names (common cities)
    const commonGermanCities = [
      "Berlin",
      "Hamburg",
      "München",
      "Köln",
      "Frankfurt",
      "Stuttgart",
      "Düsseldorf",
      "Dortmund",
      "Essen",
      "Leipzig",
      "Bremen",
      "Dresden",
      "Hannover",
      "Nürnberg",
      "Duisburg",
      "Bochum",
      "Wuppertal",
      "Bielefeld",
      "Bonn",
      "Münster",
      "Karlsruhe",
      "Mannheim",
      "Augsburg",
      "Wiesbaden",
      "Gelsenkirchen",
      "Mönchengladbach",
      "Braunschweig",
      "Chemnitz",
      "Kiel",
      "Aachen",
      "Halle",
      "Magdeburg",
      "Freiburg",
    ];

    for (const city of commonGermanCities) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }

    // Strategy 4: Intelligent word extraction
    const words = address.split(/[\s,.-]+/).filter((word) => {
      const lowerWord = word.toLowerCase();
      return (
        word.length > 2 &&
        !/^\d+$/.test(word) && // Not just numbers
        !/^\d{5}$/.test(word) && // Not postal code
        !/(^str$|^straße$|^allee$|^weg$|^platz$|^gasse$|^ring$|^damm$)$/i.test(word) && // Not street indicators
        !/^(nr|no|nummer)$/i.test(word)
      ); // Not number indicators
    });

    if (words.length > 0) {
      return words[words.length - 1];
    }

    // Strategy 5: Use the full address as location identifier for partial addresses
    const cleanAddress = address.trim();
    if (cleanAddress.length > 0 && cleanAddress.length <= 50) {
      // For short addresses like "Herderstr. 11", use them as location identifier
      return cleanAddress;
    }

    return "";
  };

  const city = getCityFromAddress(ownCompanyDetails.address);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DocumentIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Vorschau der generierten Mahnung</h2>
          </div>
        </div>
      </div>

      {/* Document Preview Card */}
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        {/* The ref is now on an inner div to avoid capturing the parent's padding in the PDF */}
        <div className="bg-background p-6 sm:p-8">
          <div
            ref={noticeRef}
            style={{
              fontFamily: "sans-serif",
              color: "#334155",
              fontSize: "10pt",
              lineHeight: 1.6,
              maxWidth: "100%",
            }}>
            <div
              data-pdf-header
              style={{
                fontSize: "9pt",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "0.5rem",
                marginBottom: "2rem",
              }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{ownCompanyDetails.name || "[Ihr Firmenname]"}</p>
              <p style={{ margin: 0 }}>{ownCompanyDetails.address || "[Ihre Adresse]"}</p>
              <p style={{ margin: 0 }}>{ownCompanyDetails.contact || "[Ihre Kontaktdaten]"}</p>
            </div>

            <table
              style={{
                width: "100%",
                marginBottom: "2rem",
                fontSize: "9pt",
                verticalAlign: "top",
              }}>
              <tbody>
                <tr>
                  <td data-pdf-address style={{ width: "60%" }}>
                    <p style={{ margin: 0 }}>An</p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>{invoiceData.clientName}</p>
                    <div>
                      {invoiceData.clientAddress.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </td>
                  <td data-pdf-date style={{ textAlign: "right" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Ort:</strong> {city ? city : <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[Ihre Stadt]</span>}
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
              data-pdf-subject
              style={{
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "2rem",
                fontSize: "12pt",
              }}>
              Betreff: {noticeContent.subject}
            </p>

            <p style={{ marginBottom: "1.5rem" }}>Sehr geehrte Damen und Herren,</p>

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
              data-pdf-demands-box
              style={{
                margin: "2rem 0",
                backgroundColor: "#f8fafc",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}>
              <p
                data-pdf-demands-title
                style={{
                  fontWeight: "600",
                  fontStyle: "italic",
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                  fontSize: "10pt",
                }}>
                Forderungsaufstellung:
              </p>
              <table
                style={{
                  fontSize: "9pt",
                  color: "#334155",
                  width: "100%",
                  borderCollapse: "collapse",
                }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Hauptforderung:</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right" }}>{noticeContent.demands.mainAmount}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Verzugszinsen:</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right" }}>{noticeContent.demands.interestAmount}</td>
                  </tr>
                  {noticeContent.demands.flatFee && (
                    <tr>
                      <td style={{ padding: "0.25rem 0", verticalAlign: "top" }}>Verzugspauschale (§ 288 Abs. 5 BGB):</td>
                      <td style={{ padding: "0.25rem 0", textAlign: "right" }}>{noticeContent.demands.flatFee}</td>
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
                    }}>
                    <td
                      style={{
                        borderTop: "1px solid #cbd5e1",
                        paddingTop: "0.75rem",
                      }}>
                      Gesamtbetrag:
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        borderTop: "1px solid #cbd5e1",
                        paddingTop: "0.75rem",
                      }}>
                      {noticeContent.demands.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ margin: "1.5rem 0" }}>
              <p style={{ marginBottom: "0.5rem" }}>Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto:</p>
              <div
                style={{
                  backgroundColor: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontSize: "9pt",
                }}>
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>Bank:</strong>{" "}
                  {ownCompanyDetails.bankName ? (
                    ownCompanyDetails.bankName
                  ) : (
                    <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[Name der Bank]</span>
                  )}
                </p>
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>IBAN:</strong>{" "}
                  {ownCompanyDetails.iban ? (
                    ownCompanyDetails.iban
                  ) : (
                    <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[IBAN]</span>
                  )}
                </p>
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>BIC:</strong>{" "}
                  {ownCompanyDetails.bic ? ownCompanyDetails.bic : <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[BIC]</span>}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Verwendungszweck:</strong> Rechnung {invoiceData.invoiceNumber} / {invoiceData.clientName}
                </p>
              </div>
            </div>

            <p style={{ marginBottom: "0.4rem" }}>Mit freundlichen Grüßen,</p>

            <div style={{ marginTop: "1rem", fontSize: "10pt", color: "#475569" }}>
              <p style={{ margin: 0 }}>
                {ownCompanyDetails.signerName || <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[Ihr Name]</span>}
              </p>
              <p style={{ margin: 0, fontSize: "9pt" }}>
                {ownCompanyDetails.name || <span className="inline-block bg-amber-50 text-amber-700 font-medium py-1 px-2 rounded border border-amber-200 text-xs">[Ihr Firmenname]</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Confirmation & Download Section */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-card-foreground">Letzter Schritt vor dem Abschicken</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bitte überprüfe, ob alle Angaben stimmen und bestätige, dass du die folgenden Unterlagen zur Abtretung bereit hältst. Diese Informationen werden dem ausgewählten Anwalt zur weiteren
            Bearbeitung übermittelt.
          </p>
          <ul className="space-y-2 text-xs text-card-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Vollständig ausgefüllte Abtretungserklärung zwischen dir und dem Mandanten (inkl. Datum und Unterschrift).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Nachweis der offenen Forderung (Rechnung, Mahnschreiben, Zahlungsbelege).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Kontaktdaten der zahlungspflichtigen Partei inklusive Anschrift und Kommunikationsweg.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Deine eigenen Unternehmens- und Bankdaten für den Eingang der Zahlung.</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Wird übermittelt...</span>
              </>
            ) : (
              <span>Abschicken</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePreview;
