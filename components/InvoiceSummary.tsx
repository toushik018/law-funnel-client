import React, { useMemo, useState } from "react";
import { InvoiceData, ClientType } from "../types";
import DollarSignIcon from "./icons/DollarSignIcon";
import CalendarIcon from "./icons/CalendarIcon";
import WarningIcon from "./icons/WarningIcon";
import CheckCircleIcon from "./icons/CheckCircleIcon";
import DocumentIcon from "./icons/DocumentIcon"; // Using for invoice number
import UserIcon from "./icons/UserIcon"; // New icon for client details
import RefreshIcon from "./icons/RefreshIcon";
import { computeRvgFee } from "../utils/rvgFee";
import { rvgTable } from "../utils/rvgTable";

interface InvoiceSummaryProps {
  invoiceData: InvoiceData;
  daysOverdue: number;
  lateFee: number;
  clientType: ClientType;
  onInvoiceDataChange: (data: InvoiceData) => void;
  onRegenerate: () => void;
}

const SummaryCard: React.FC<{ icon: React.ReactElement<any>; title: string; value: string | React.ReactNode; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-card border border-border/60 p-4 rounded-xl flex items-start gap-4 hover:shadow-sm transition-colors">
    <div className="p-3 mt-1 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
      {React.cloneElement(icon, { className: `w-6 h-6`, style: { color } })}
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{title}</p>
      <div className="text-lg font-semibold text-card-foreground break-words">{value}</div>
    </div>
  </div>
);

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoiceData, daysOverdue, lateFee, clientType, onInvoiceDataChange, onRegenerate }) => {
  const [isDirty, setIsDirty] = useState(false);

  const originalAmount = invoiceData.totalAmount;
  const newTotal = originalAmount + lateFee;
  const dueDate = new Date(invoiceData.dueDate);
  const invoiceDate = new Date(invoiceData.invoiceDate);

  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) return "Ungültiges Datum";
    return date.toLocaleDateString("de-DE", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" });
  };

  const handleRegenerateClick = () => {
    onRegenerate();
    setIsDirty(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  };

  const rvg = useMemo(() => {
    try {
      const gegenstandswert = newTotal;
      const geschaeftsgebuehr = 1.3;
      return computeRvgFee(gegenstandswert, geschaeftsgebuehr, rvgTable, { withAuslagenPauschale: true, withVAT: true });
    } catch {
      return null;
    }
  }, [newTotal]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-zinc-800 mb-4 flex items-center">
        <CheckCircleIcon className="w-7 h-7 text-green-500 mr-2.5" />
        Rechnungsanalyse abgeschlossen
      </h2>

      {isDirty && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800 font-medium">Kundendaten wurden geändert. Aktualisieren Sie die Mahnung, um die Änderungen zu übernehmen.</p>
          <button onClick={handleRegenerateClick} className="flex-shrink-0 flex items-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
            <RefreshIcon className="w-4 h-4 mr-2" />
            Aktualisieren
          </button>
        </div>
      )}

      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Zusammenfassung</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="bg-card border border-border/60 p-4 rounded-xl flex items-start gap-4">
          <div className="p-3 mt-1 rounded-full flex items-center justify-center bg-purple-500/20">
            <UserIcon className="w-6 h-6 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-600 font-medium">Kunde (bearbeitbar)</p>
            <input
              type="text"
              aria-label="Client Name"
              value={invoiceData.clientName}
              onChange={(e) => {
                onInvoiceDataChange({ ...invoiceData, clientName: e.target.value });
                setIsDirty(true);
              }}
              className="text-lg font-semibold text-card-foreground bg-transparent w-full focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-indigo-400 rounded px-1 -mx-1"
            />
            <textarea
              aria-label="Client Address"
              value={invoiceData.clientAddress}
              onChange={(e) => {
                onInvoiceDataChange({ ...invoiceData, clientAddress: e.target.value });
                setIsDirty(true);
              }}
              className="mt-1 text-sm font-normal text-muted-foreground bg-transparent w-full h-auto resize-none focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-indigo-400 rounded px-1 -mx-1"
              rows={2}
            />
          </div>
        </div>

        <SummaryCard
          icon={<DocumentIcon />}
          title="Rechnungsdetails"
          value={
            <>
              <p>Nr: {invoiceData.invoiceNumber}</p>
              <p className="text-sm font-normal text-zinc-500"> vom {formatDate(invoiceDate)}</p>
            </>
          }
          color="#3b82f6" // blue-500
        />
        <SummaryCard
          icon={<CalendarIcon />}
          title="Ursprüngliches Fälligkeitsdatum"
          value={formatDate(dueDate)}
          color="#60a5fa" // blue-400
        />
        <SummaryCard
          icon={<DollarSignIcon />}
          title="Ursprünglicher Rechnungsbetrag"
          value={formatCurrency(originalAmount)}
          color="#34d399" // emerald-400
        />
        <SummaryCard
          icon={<WarningIcon />}
          title="Tage überfällig"
          value={`${daysOverdue} Tag${daysOverdue !== 1 ? "e" : ""}`}
          color="#f59e0b" // amber-500
        />
        <div className="ring-1 ring-rose-200/60 rounded-xl">
          <SummaryCard
            icon={<DollarSignIcon />}
            title="Neuer Gesamtbetrag"
            value={formatCurrency(newTotal)}
            color="#be123c" // rose-700
          />
        </div>
      </div>
      <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg" role="alert">
        <div className="flex">
          <div className="py-1">
            <WarningIcon className="w-5 h-5 text-rose-500 mr-3" />
          </div>
          <div>
            <p className="font-bold">Handlung erforderlich</p>
            <p className="text-sm text-rose-700">
              Mahngebühren in Höhe von <span className="font-semibold">{formatCurrency(lateFee)}</span> wurden berechnet. (
              {clientType === "company" ? "Pauschale + Zinsen für Unternehmen" : "Zinsen für Privatkunden"})
            </p>
          </div>
        </div>
      </div>

      {rvg && (
        <div className="mt-3 bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-3 rounded-lg" role="status">
          <div className="flex">
            <div className="py-1">
              <DollarSignIcon className="w-5 h-5 text-indigo-500 mr-3" />
            </div>
            <div>
              <p className="font-bold">Voraussichtliche Anwaltsgebühren (RVG)</p>
              <p className="text-sm">
                1,3-Geschäftsgebühr auf Basis Gegenstandswert {formatCurrency(newTotal)}: Gebühr {formatCurrency(rvg.fee)}, Auslagen {formatCurrency(rvg.auslagen)}, USt {formatCurrency(rvg.vat)},
                Gesamt {formatCurrency(rvg.total)}.
              </p>
              <p className="text-[11px] text-indigo-700 mt-1">Unverbindliche Berechnung auf Grundlage der RVG-Tabelle. Bitte rechtliche Angaben prüfen.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSummary;
