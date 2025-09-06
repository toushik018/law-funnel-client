import React from "react";
import {
  X,
  FileText,
  Shield,
  User,
  CreditCard,
  AlertTriangle,
  Scale,
  Mail,
} from "lucide-react";

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsAndConditions({
  isOpen,
  onClose,
}: TermsAndConditionsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-4xl max-h-[85vh] w-full overflow-hidden flex flex-col border border-border shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Allgemeine Geschäftsbedingungen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none text-foreground">
            {/* Section 1 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  1. Annahme der Bedingungen
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Durch den Zugriff auf und die Nutzung von Law Funnel („der
                Dienst“) akzeptieren Sie diese Vereinbarung und stimmen zu, an
                deren Bestimmungen gebunden zu sein. Wenn Sie nicht mit den oben
                genannten Bedingungen einverstanden sind, nutzen Sie diesen
                Dienst bitte nicht.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  2. Dienstbeschreibung
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Law Funnel ist eine Plattform zur Verarbeitung von
                Rechtsdokumenten, die künstliche Intelligenz zur Analyse und
                Extraktion von Informationen aus Rechtsdokumenten verwendet. Der
                Dienst ist darauf ausgelegt, Rechtsexperten und Privatpersonen
                bei der effizienteren Verarbeitung von Rechtsdokumenten zu
                unterstützen.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  3. Nutzerverantwortlichkeiten
                </h3>
              </div>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                <li>
                  Sie sind für die Vertraulichkeit Ihrer Anmeldedaten
                  verantwortlich
                </li>
                <li>
                  Sie verpflichten sich, genaue und vollständige Informationen
                  bei der Kontoerstellung anzugeben
                </li>
                <li>
                  Sie sind für alle Aktivitäten verantwortlich, die unter Ihrem
                  Konto auftreten
                </li>
                <li>
                  Sie verpflichten sich, den Dienst nicht für rechtswidrige oder
                  verbotene Aktivitäten zu nutzen
                </li>
                <li>
                  Sie verstehen, dass die KI-Analyse zur Unterstützung dient und
                  professionelle Rechtsberatung nicht ersetzen sollte
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  4. Datenschutz und Datensicherheit
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Wir verpflichten uns, Ihre Privatsphäre und die Vertraulichkeit
                Ihrer Rechtsdokumente zu schützen. Ihre Dokumente werden sicher
                verarbeitet, und wir implementieren angemessene technische und
                organisatorische Maßnahmen zum Schutz Ihrer personenbezogenen
                Daten. Wir teilen Ihre Dokumente oder extrahierte Daten nicht
                ohne Ihre ausdrückliche Zustimmung mit Dritten.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  5. Geistiges Eigentum
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Der Dienst und seine ursprünglichen Inhalte, Funktionen und
                Funktionalitäten sind und bleiben das ausschließliche Eigentum
                von Law Funnel und seinen Lizenzgebern. Der Dienst ist durch
                Urheberrecht, Markenrecht und andere Gesetze geschützt.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  6. Gewährleistungsausschluss
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Die von Law Funnel bereitgestellten Informationen dienen nur
                allgemeinen Informationszwecken. Während wir um Genauigkeit
                bemüht sind, geben wir keine Gewährleistungen oder Zusicherungen
                bezüglich der Genauigkeit, Zuverlässigkeit, Vollständigkeit oder
                Aktualität der Inhalte ab. Die KI-Analyse sollte nicht als
                professionelle Rechtsberatung betrachtet werden.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  7. Haftungsbegrenzung
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                In keinem Fall haften Law Funnel, seine Direktoren, Mitarbeiter
                oder Vertreter für indirekte, beiläufige, besondere, Folge- oder
                Strafschäden, einschließlich, aber nicht beschränkt auf Verlust
                von Gewinnen, Daten, Nutzung, Goodwill oder andere immaterielle
                Verluste, die aus Ihrer Nutzung des Dienstes resultieren.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  8. Abonnement und Zahlung
                </h3>
              </div>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                <li>
                  Einige Funktionen des Dienstes erfordern möglicherweise ein
                  kostenpflichtiges Abonnement
                </li>
                <li>
                  Abonnementgebühren werden im Voraus monatlich oder jährlich
                  abgerechnet
                </li>
                <li>
                  Alle Gebühren sind nicht erstattungsfähig, sofern nicht anders
                  angegeben
                </li>
                <li>
                  Wir behalten uns das Recht vor, Abonnementpreise mit
                  30-tägiger Vorankündigung zu ändern
                </li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  9. Kündigung
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Wir können Ihr Konto kündigen oder sperren und den Zugang zum
                Dienst sofort ohne vorherige Ankündigung oder Haftung nach
                unserem alleinigen Ermessen aus beliebigen Gründen verweigern,
                einschließlich, aber nicht beschränkt darauf, wenn Sie gegen die
                Bedingungen verstoßen.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  10. Änderungen der Bedingungen
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Wir behalten uns das Recht vor, nach unserem alleinigen Ermessen
                diese Bedingungen jederzeit zu ändern oder zu ersetzen. Bei
                wesentlichen Änderungen werden wir mindestens 30 Tage vor
                Inkrafttreten der neuen Bedingungen eine Benachrichtigung
                versenden.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  11. Geltendes Recht
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Diese Bedingungen sind nach den Gesetzen der Jurisdiktion, in
                der Law Funnel tätig ist, zu interpretieren und zu regeln, ohne
                Rücksicht auf deren Kollisionsrecht.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  12. Kontaktinformationen
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Wenn Sie Fragen zu diesen Allgemeinen Geschäftsbedingungen
                haben, kontaktieren Sie uns bitte unter legal@lawfunnel.com
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            Ich verstehe & Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
