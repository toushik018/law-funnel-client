import React from "react";

interface AssignmentChecklistProps {
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const AssignmentChecklist: React.FC<AssignmentChecklistProps> = ({
  onCancel,
  onConfirm,
  isSubmitting,
  error,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Checkliste zur Abtretungserklärung
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bitte bestätige die folgenden Punkte, bevor der Fall an Susko übermittelt wird.
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-3 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>
                Die Abtretungserklärung ist vollständig ausgefüllt und von beiden Parteien unterschrieben.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>
                Alle Nachweise zur Forderung (Rechnung, Mahnschreiben, Korrespondenz) liegen digital vor.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>
                Die Kontaktdaten der zahlungspflichtigen Partei sind aktuell und vollständig.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>
                Deine eigenen Kontaktdaten sowie Bankverbindung für den Zahlungseingang wurden geprüft.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>
                Du bist mit der Weitergabe der Daten an eine Partnerkanzlei zur anwaltlichen Prüfung einverstanden.
              </span>
            </div>
          </div>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Wird übermittelt..." : "Bestätigen & abschicken"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentChecklist;
