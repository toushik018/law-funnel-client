import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData, PaymentNoticeContent, CompanyDetails, LawyerDetails, ClientType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INVOICE_EXTRACTION_MODEL = 'gemini-2.5-flash';
const NOTICE_GENERATION_MODEL = 'gemini-2.5-flash';

/**
 * Extracts structured data from raw invoice text using Gemini.
 * @param text The raw text extracted from the invoice PDF.
 * @returns A promise that resolves with the structured invoice data.
 */
export const extractInvoiceData = async (text: string): Promise<InvoiceData> => {
  const prompt = `
    You are an expert financial assistant. Analyze the following text extracted from an invoice PDF.
    Identify the following fields:
    - clientName: The name of the company or person receiving the invoice.
    - clientAddress: The full address of the client.
    - invoiceNumber: The unique invoice identifier ('Invoice No.', 'Invoice Number', 'Rechnungsnummer').
    - invoiceDate: The date the invoice was issued ('Invoice Date', 'Date', 'Rechnungsdatum'), in YYYY-MM-DD format.
    - dueDate: The payment due date ('Due Date', 'Payment Due', 'Fälligkeitsdatum'), in YYYY-MM-DD format.
    - totalAmount: The final total amount in Euros ('Total Amount', 'Total', 'Gesamtbetrag', etc.). It is a number.

    Respond only with a JSON object. The current date is ${new Date().toLocaleDateString('en-CA')}.

    Extracted Text:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: INVOICE_EXTRACTION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientName: { type: Type.STRING, description: "Name of the client." },
            clientAddress: { type: Type.STRING, description: "Full address of the client." },
            invoiceNumber: { type: Type.STRING, description: "The invoice number." },
            invoiceDate: { type: Type.STRING, description: "The invoice issue date in YYYY-MM-DD format." },
            dueDate: { type: Type.STRING, description: "The payment due date in YYYY-MM-DD format." },
            totalAmount: { type: Type.NUMBER, description: "The final total amount due in Euros." },
          },
          required: ["clientName", "clientAddress", "invoiceNumber", "invoiceDate", "dueDate", "totalAmount"],
        },
      },
    });
    
    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    if (!result.dueDate || !result.totalAmount || !result.clientName || !result.invoiceNumber) {
        throw new Error("The AI could not extract the required fields. The response was incomplete.");
    }
    
    return result;

  } catch (error: any) {
    console.error("Error extracting invoice data from Gemini:", error);
    throw new Error("Die KI konnte die Rechnung nicht analysieren. Die PDF ist möglicherweise unklar oder hat ein nicht unterstütztes Format.");
  }
};

interface NoticeDetails extends InvoiceData {
  daysOverdue: number;
  interestAmount: number;
  flatFee: number;
  newTotal: number;
}

interface NoticeGenerationSettings {
  ownCompany: CompanyDetails;
  lawyer: LawyerDetails;
}


/**
 * Generates a professional overdue payment notice in German using Gemini.
 * @param details The details extracted and calculated from the invoice.
 * @returns A promise that resolves with the structured content for the notice.
 */
export const generatePaymentNotice = async (details: NoticeDetails, settings: NoticeGenerationSettings, clientType: ClientType): Promise<PaymentNoticeContent> => {
  const { 
    invoiceNumber, invoiceDate, clientName, dueDate, totalAmount, 
    daysOverdue, interestAmount, flatFee, newTotal 
  } = details;

  const { lawyer } = settings;

  const prompt = `
    Erstellen Sie den Inhalt für eine "Mahnung" auf Deutsch basierend auf den folgenden Details.

    Rechnungsdetails:
    - Rechnungsnummer: ${invoiceNumber}
    - Rechnungsdatum: ${new Date(invoiceDate).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
    - Kundenname: ${clientName}
    - Ursprüngliches Fälligkeitsdatum: ${new Date(dueDate).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
    - Tage im Verzug: ${daysOverdue}
    - Kundentyp: ${clientType === 'company' ? 'Unternehmen' : 'Privatperson'}
    - Name der Anwaltskanzlei/des Inkassobüros: ${lawyer.name || 'unsere Rechtsabteilung'}

    Finanzielle Aufstellung:
    - Hauptforderung: ${totalAmount.toFixed(2)} €
    - Verzugszinsen: ${interestAmount.toFixed(2)} €
    - Verzugspauschale: ${flatFee > 0 ? `${flatFee.toFixed(2)} €` : 'N/A'}
    - Neuer Gesamtbetrag: ${newTotal.toFixed(2)} €

    Ihre Aufgabe ist es, ein JSON-Objekt mit drei Teilen zu generieren:
    1.  'subject': Eine Betreffzeile nach dem Format: "Mahnung zur Rechnung Nr. [Rechnungsnummer] vom [Rechnungsdatum]". Verwenden Sie die tatsächliche Rechnungsnummer und das Datum.
    2.  'body': Ein Array von Zeichenketten, wobei jede Zeichenkette ein Absatz für den Brieftext ist. Der Text muss:
        - Absatz 1: Feststellen, dass die angegebene Rechnung trotz vorheriger Zahlungserinnerung noch unbezahlt ist.
        - Absatz 2: Für 'Unternehmen' als Kunden den Rechtsgrund für den Verzug angeben: "Da Sie Unternehmer im Sinne des § 14 BGB sind, befinden Sie sich gemäß §§ 286, 288 BGB mit Ablauf der Zahlungsfrist in Verzug." Für 'Privatperson' als Kunden nur auf den Verzug hinweisen, ohne die Paragraphen.
        - Absatz 3: Formell die Zahlung des neuen Gesamtbetrags innerhalb einer neuen Frist von 7 Tagen nach Erhalt dieses Schreibens fordern.
        - Absatz 4: Warnen, dass bei Nichtbeachtung dieser Mahnung ohne weitere Ankündigung rechtliche Schritte über die angegebene Kanzlei/das Inkassobüro eingeleitet werden, was zu erheblichen zusätzlichen Kosten für den Kunden führt.
    3.  'demands': Ein JSON-Objekt mit der finanziellen Aufstellung. Formatieren Sie alle Werte als deutsche Währungszeichenketten mit einem Punkt als Tausendertrennzeichen und einem Komma als Dezimaltrennzeichen (z.B. "3.000,00 €").
        - mainAmount: Der ursprüngliche Rechnungsbetrag.
        - interestAmount: Die berechneten Zinsen.
        - flatFee: Die Pauschale (40,00 € für Unternehmen). Falls nicht zutreffend (für Privatkunden), einen leeren String bereitstellen.
        - totalAmount: Der neue Gesamtbetrag.
  `;

  try {
    const response = await ai.models.generateContent({
      model: NOTICE_GENERATION_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "Sie sind ein deutscher Rechtsanwaltsgehilfe, der auf Inkasso spezialisiert ist. Ihr Ton ist formell, autoritär und nicht verhandelbar. Sie schreiben eine Mahnung. Erstellen Sie Inhalte für eine rechtlich relevante Zahlungsaufforderung auf Deutsch. Fügen Sie keine Anreden, Daten, Adressen oder Unterschriften ein; liefern Sie nur den Betreff, die Textabsätze und eine Kostenaufstellung wie im JSON-Schema gefordert.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "Formale deutsche Betreffzeile. Beispiel: 'Mahnung zur Rechnung Nr. 12345 vom 01.01.2024'",
            },
            body: {
              type: Type.ARRAY,
              description: "Der Text der Mahnung auf Deutsch, als Array von Strings. Jeder String ist ein Absatz.",
              items: {
                type: Type.STRING,
              },
            },
            demands: {
              type: Type.OBJECT,
              description: "Eine Aufschlüsselung der fälligen Beträge, formatiert als deutsche Währungs-Strings.",
              properties: {
                mainAmount: { type: Type.STRING, description: 'Hauptforderung als "1.234,56 €"' },
                interestAmount: { type: Type.STRING, description: 'Verzugszinsen als "12,34 €"' },
                flatFee: { type: Type.STRING, description: 'Verzugspauschale als "40,00 €" oder ""' },
                totalAmount: { type: Type.STRING, description: 'Gesamtbetrag als "1.286,90 €"' }
              },
              required: ["mainAmount", "interestAmount", "flatFee", "totalAmount"]
            }
          },
          required: ["subject", "body", "demands"],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    if (!result.subject || !result.body || !Array.isArray(result.body) || result.body.length === 0 || !result.demands) {
      throw new Error("Die KI konnte den erforderlichen Mahnungsinhalt nicht im richtigen Format erstellen.");
    }
    
    return result;

  } catch (error: any) {
    console.error("Error generating payment notice from Gemini:", error);
    throw new Error("Die KI konnte den Mahnungsinhalt nicht erstellen.");
  }
};