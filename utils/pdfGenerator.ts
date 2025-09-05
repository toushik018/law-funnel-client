import { PaymentNoticeContent, CompanyDetails, InvoiceData } from "../types";

declare global {
    interface Window {
        jspdf: {
            jsPDF: new (options?: any) => any;
        };
    }
}

// Make sure jsPDF is loaded
const jspdf = (window as any).jspdf;

interface PDFGeneratorOptions {
    noticeContent: PaymentNoticeContent;
    ownCompanyDetails: CompanyDetails;
    invoiceData: InvoiceData;
}

class PDFGenerator {
    private doc: any;
    private pageWidth = 595.28;
    private pageHeight = 841.89;
    private margin = 60;
    private contentWidth: number;
    private yPosition = 0;

    // Professional color palette (RGB values)
    private colors = {
        darkGray: [30, 41, 59], // #1e293b - for headings
        mediumGray: [51, 65, 85], // #334155 - for main text
        lightGray: [148, 163, 184], // #94a3b8 - for labels
        veryLightGray: [248, 250, 252], // #f8fafc - for subtle boxes
        borderGray: [226, 232, 240], // #e2e8f0 - for borders
        mutedGray: [241, 245, 249], // #f1f5f9 - for bank box (subtle)
    };

    constructor() {
        const { jsPDF } = jspdf;
        this.doc = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4",
            putOnlyUsedFonts: true,
        });
        this.contentWidth = this.pageWidth - 2 * this.margin;
        this.yPosition = this.margin;
    }

    private addText(
        text: string,
        fontSize: number = 10,
        isBold: boolean = false,
        align: "left" | "center" | "right" = "left",
        color: number[] = this.colors.mediumGray,
        maxWidth: number = this.contentWidth
    ): number {
        this.doc.setFontSize(fontSize);
        this.doc.setFont("helvetica", isBold ? "bold" : "normal");
        this.doc.setTextColor(color[0], color[1], color[2]);

        const lines = this.doc.splitTextToSize(text, maxWidth);

        lines.forEach((line: string) => {
            let xPosition = this.margin;
            if (align === "center") {
                xPosition = this.pageWidth / 2 - this.doc.getTextWidth(line) / 2;
            } else if (align === "right") {
                xPosition = this.pageWidth - this.margin - this.doc.getTextWidth(line);
            }

            this.doc.text(line, xPosition, this.yPosition);
            this.yPosition += fontSize * 1.4; // Better line height
        });

        return this.yPosition;
    }

    private addStyledBox(
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: number[],
        borderColor: number[] = this.colors.borderGray,
        borderWidth: number = 1
    ): void {
        // Fill
        this.doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        this.doc.rect(x, y, width, height, "F");

        // Border
        this.doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        this.doc.setLineWidth(borderWidth);
        this.doc.rect(x, y, width, height, "S");
    }

    private addLine(
        y: number,
        width: number = this.contentWidth,
        color: number[] = this.colors.borderGray
    ): void {
        this.doc.setDrawColor(color[0], color[1], color[2]);
        this.doc.setLineWidth(1);
        this.doc.line(this.margin, y, this.margin + width, y);
    }

    /**
     * Enhanced function to extract city from address with multiple fallback strategies
     * More user-friendly approach for various address formats
     * Now includes smart fallback to use the address itself when no city is found
     */
    private getCityFromAddress(address: string): string {
        if (!address) return "";

        // Strategy 1: Full German format (12345 Berlin)
        const fullFormatMatch = address.match(/\d{5}\s+([a-zA-Z\säöüÄÖÜß.-]+)$/);
        if (fullFormatMatch && fullFormatMatch[1]) {
            return fullFormatMatch[1].trim();
        }

        // Strategy 2: Postal code at beginning (12345 Berlin, Hauptstraße 1)
        const postalAtStartMatch = address.match(/^\d{5}\s+([a-zA-Z\säöüÄÖÜß.-]+)/);
        if (postalAtStartMatch && postalAtStartMatch[1]) {
            const cityPart = postalAtStartMatch[1].split(',')[0].trim();
            if (cityPart) return cityPart;
        }

        // Strategy 3: Line-based approach (address on multiple lines)
        const lines = address.split(/[\n\r]+/).map(line => line.trim()).filter(line => line);
        for (const line of lines) {
            // Check if line contains postal code + city
            const lineMatch = line.match(/\d{5}\s+([a-zA-Z\säöüÄÖÜß.-]+)/);
            if (lineMatch && lineMatch[1]) {
                return lineMatch[1].trim();
            }
        }

        // Strategy 4: Comma-separated format (Street, City)
        const commaParts = address.split(',').map(part => part.trim());
        if (commaParts.length > 1) {
            const lastPart = commaParts[commaParts.length - 1];
            // Remove any postal codes and numbers to get city name
            const cityOnly = lastPart.replace(/^\d{5}\s*/, '').replace(/\d+/g, '').trim();
            if (cityOnly && cityOnly.length > 2) return cityOnly;
        }

        // Strategy 5: Known German city names (common cities)
        const commonGermanCities = [
            'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf',
            'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg',
            'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe',
            'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach',
            'Braunschweig', 'Chemnitz', 'Kiel', 'Aachen', 'Halle', 'Magdeburg', 'Freiburg',
            'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel',
            'Hagen', 'Potsdam', 'Saarbrücken', 'Hamm', 'Mülheim', 'Ludwigshafen', 'Leverkusen',
            'Oldenburg', 'Osnabrück', 'Solingen', 'Heidelberg', 'Herne', 'Neuss', 'Darmstadt',
            'Paderborn', 'Regensburg', 'Ingolstadt', 'Würzburg', 'Fürth', 'Wolfsburg',
            'Offenbach', 'Ulm', 'Heilbronn', 'Pforzheim', 'Göttingen', 'Bottrop', 'Trier',
            'Recklinghausen', 'Reutlingen', 'Bremerhaven', 'Koblenz', 'Bergisch Gladbach',
            'Jena', 'Remscheid', 'Erlangen', 'Moers', 'Siegen', 'Hildesheim', 'Salzgitter'
        ];

        for (const city of commonGermanCities) {
            if (address.toLowerCase().includes(city.toLowerCase())) {
                return city;
            }
        }

        // Strategy 6: Intelligent word extraction (excluding obvious street indicators)
        const words = address.split(/[\s,.-]+/).filter(word => {
            const lowerWord = word.toLowerCase();
            return word.length > 2 &&
                !/^\d+$/.test(word) && // Not just numbers
                !/^\d{5}$/.test(word) && // Not postal code
                !/(^str$|^straße$|^allee$|^weg$|^platz$|^gasse$|^ring$|^damm$)$/i.test(word) && // Not street indicators
                !/^(nr|no|nummer)$/i.test(word); // Not number indicators
        });

        if (words.length > 0) {
            return words[words.length - 1];
        }

        // Strategy 7: Use the full address as location identifier for partial addresses
        // This is more user-friendly than showing "[Ihre Stadt]"
        const cleanAddress = address.trim();
        if (cleanAddress.length > 0 && cleanAddress.length <= 50) {
            // For short addresses like "Herderstr. 11", use them as location identifier
            return cleanAddress;
        }

        return "";
    }

    private addCompanyHeader(ownCompanyDetails: CompanyDetails): void {
        this.yPosition += 5;
        this.addText(
            ownCompanyDetails.name || "[Ihr Firmenname]",
            11,
            true,
            "left",
            this.colors.darkGray
        );
        this.yPosition += 2;
        this.addText(
            ownCompanyDetails.address || "[Ihre Adresse]",
            9,
            false,
            "left",
            this.colors.mediumGray
        );
        this.yPosition += 2;
        this.addText(
            ownCompanyDetails.contact || "[Ihre Kontaktdaten]",
            9,
            false,
            "left",
            this.colors.mediumGray
        );
        this.yPosition += 8;
        this.addLine(this.yPosition, this.contentWidth, this.colors.lightGray);
        this.yPosition += 25;
    }

    private addAddressAndDate(invoiceData: InvoiceData, ownCompanyDetails: CompanyDetails): void {
        const addressSectionY = this.yPosition;

        // Client address (left side)
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.lightGray[0],
            this.colors.lightGray[1],
            this.colors.lightGray[2]
        );
        this.doc.text("An", this.margin, this.yPosition);
        this.yPosition += 15;

        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(
            this.colors.darkGray[0],
            this.colors.darkGray[1],
            this.colors.darkGray[2]
        );
        this.doc.text(invoiceData.clientName, this.margin, this.yPosition);
        this.yPosition += 15;

        // Client address lines
        const addressLines = invoiceData.clientAddress.split("\n");
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.mediumGray[0],
            this.colors.mediumGray[1],
            this.colors.mediumGray[2]
        );
        addressLines.forEach((line) => {
            this.doc.text(line, this.margin, this.yPosition);
            this.yPosition += 13;
        });

        // Date and location (right side)
        const rightColumnX = this.pageWidth - this.margin - 180;
        let rightY = addressSectionY;

        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.mediumGray[0],
            this.colors.mediumGray[1],
            this.colors.mediumGray[2]
        );

        const extractedLocation = this.getCityFromAddress(ownCompanyDetails.address);
        const cityText = `Ort: ${extractedLocation || "[Ihre Stadt]"}`;
        this.doc.text(cityText, rightColumnX, rightY);
        rightY += 13;

        const currentDate = new Date().toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const dateText = `Datum: ${currentDate}`;
        this.doc.text(dateText, rightColumnX, rightY);

        this.yPosition = Math.max(this.yPosition, rightY) + 35;
    }

    private addSubject(noticeContent: PaymentNoticeContent): void {
        this.doc.setFontSize(13);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(
            this.colors.darkGray[0],
            this.colors.darkGray[1],
            this.colors.darkGray[2]
        );
        const subjectLines = this.doc.splitTextToSize(
            `Betreff: ${noticeContent.subject}`,
            this.contentWidth
        );
        subjectLines.forEach((line: string) => {
            this.doc.text(line, this.margin, this.yPosition);
            this.yPosition += 16;
        });
        this.yPosition += 15;
    }

    private addGreetingAndBody(noticeContent: PaymentNoticeContent): void {
        // Greeting
        this.addText(
            "Sehr geehrte Damen und Herren,",
            10,
            false,
            "left",
            this.colors.mediumGray
        );
        this.yPosition += 8;

        // Body paragraphs
        noticeContent.body.forEach((paragraph) => {
            const cleanText = paragraph
                .replace(/<[^>]*>/g, "")
                .replace(/\[([^\]]+)\]/g, "$1");
            this.addText(cleanText, 10, false, "left", this.colors.mediumGray);
            this.yPosition += 8;
        });

        this.yPosition += 15;
    }

    private addDemandsBox(noticeContent: PaymentNoticeContent): void {
        const boxStartY = this.yPosition;
        const boxHeight = 120;
        const boxPadding = 15;

        // Draw styled box
        this.addStyledBox(
            this.margin,
            boxStartY,
            this.contentWidth,
            boxHeight,
            this.colors.veryLightGray,
            this.colors.borderGray
        );

        // Demands title
        this.yPosition = boxStartY + boxPadding + 14;
        this.doc.setFontSize(11);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(
            this.colors.darkGray[0],
            this.colors.darkGray[1],
            this.colors.darkGray[2]
        );
        this.doc.text("Forderungsaufstellung:", this.margin + boxPadding, this.yPosition);
        this.yPosition += 20;

        // Demands table
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.mediumGray[0],
            this.colors.mediumGray[1],
            this.colors.mediumGray[2]
        );

        const tableData = [
            ["Hauptforderung:", noticeContent.demands.mainAmount],
            ["Verzugszinsen:", noticeContent.demands.interestAmount],
        ];

        if (noticeContent.demands.flatFee) {
            tableData.push([
                "Verzugspauschale (§ 288 Abs. 5 BGB):",
                noticeContent.demands.flatFee,
            ]);
        }

        // Draw demands table
        tableData.forEach(([label, amount]) => {
            this.doc.text(label, this.margin + boxPadding, this.yPosition);
            const amountWidth = this.doc.getTextWidth(amount);
            this.doc.text(
                amount,
                this.pageWidth - this.margin - boxPadding - amountWidth,
                this.yPosition
            );
            this.yPosition += 14;
        });

        // Total line
        this.yPosition += 8;
        const lineY = this.yPosition - 5;
        this.doc.setDrawColor(
            this.colors.lightGray[0],
            this.colors.lightGray[1],
            this.colors.lightGray[2]
        );
        this.doc.setLineWidth(1);
        this.doc.line(
            this.margin + boxPadding,
            lineY,
            this.pageWidth - this.margin - boxPadding,
            lineY
        );
        this.yPosition += 8;

        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(
            this.colors.darkGray[0],
            this.colors.darkGray[1],
            this.colors.darkGray[2]
        );
        this.doc.text("Gesamtbetrag:", this.margin + boxPadding, this.yPosition);
        const totalWidth = this.doc.getTextWidth(noticeContent.demands.totalAmount);
        this.doc.text(
            noticeContent.demands.totalAmount,
            this.pageWidth - this.margin - boxPadding - totalWidth,
            this.yPosition
        );

        this.yPosition = boxStartY + boxHeight + 25;
    }

    private addBankInformation(ownCompanyDetails: CompanyDetails, invoiceData: InvoiceData): void {
        this.addText(
            "Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto:",
            10,
            false,
            "left",
            this.colors.mediumGray
        );
        this.yPosition += 10;

        // Bank info box - subtle and formal
        const bankBoxHeight = 75;
        this.addStyledBox(
            this.margin,
            this.yPosition,
            this.contentWidth,
            bankBoxHeight,
            this.colors.mutedGray,
            this.colors.borderGray,
            1
        );

        this.yPosition += 18;
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.mediumGray[0],
            this.colors.mediumGray[1],
            this.colors.mediumGray[2]
        );

        const bankInfo = [
            `Bank: ${ownCompanyDetails.bankName || "[Name der Bank]"}`,
            `IBAN: ${ownCompanyDetails.iban || "[IBAN]"}`,
            `BIC: ${ownCompanyDetails.bic || "[BIC]"}`,
            `Verwendungszweck: Rechnung ${invoiceData.invoiceNumber} / ${invoiceData.clientName}`,
        ];

        bankInfo.forEach((info) => {
            this.doc.text(info, this.margin + 12, this.yPosition);
            this.yPosition += 13;
        });

        this.yPosition += 15;
    }

    private addClosingAndSignature(ownCompanyDetails: CompanyDetails): void {
        // Add proper top margin before closing
        this.yPosition += 20; // Top margin for "Mit freundlichen Grüßen"

        // Closing
        this.addText("Mit freundlichen Grüßen,", 10, false, "left", this.colors.mediumGray);
        this.yPosition += 3; // Reduced gap between closing and signature (much smaller)

        // Signature section
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(
            this.colors.darkGray[0],
            this.colors.darkGray[1],
            this.colors.darkGray[2]
        );
        this.doc.text(ownCompanyDetails.signerName || "[Ihr Name]", this.margin, this.yPosition);
        this.yPosition += 14;

        this.doc.setFontSize(9);
        this.doc.setTextColor(
            this.colors.lightGray[0],
            this.colors.lightGray[1],
            this.colors.lightGray[2]
        );
        this.doc.text(ownCompanyDetails.name || "[Ihr Firmenname]", this.margin, this.yPosition);
    }

    public generatePDF(options: PDFGeneratorOptions): void {
        const { noticeContent, ownCompanyDetails, invoiceData } = options;

        // Build the PDF sections
        this.addCompanyHeader(ownCompanyDetails);
        this.addAddressAndDate(invoiceData, ownCompanyDetails);
        this.addSubject(noticeContent);
        this.addGreetingAndBody(noticeContent);
        this.addDemandsBox(noticeContent);
        this.addBankInformation(ownCompanyDetails, invoiceData);
        this.addClosingAndSignature(ownCompanyDetails);

        // Save the PDF
        this.doc.save(`Mahnung_${invoiceData.invoiceNumber}.pdf`);
    }
}

// Utility function to generate payment notice PDF
export const generatePaymentNoticePDF = async (
    noticeContent: PaymentNoticeContent,
    ownCompanyDetails: CompanyDetails,
    invoiceData: InvoiceData
): Promise<void> => {
    try {
        const generator = new PDFGenerator();
        generator.generatePDF({ noticeContent, ownCompanyDetails, invoiceData });
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw new Error("Entschuldigung, beim Erstellen der PDF-Datei ist ein Fehler aufgetreten.");
    }
};