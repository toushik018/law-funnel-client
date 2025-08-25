import React from "react";

interface ImpressumProps {
  onNavigateBack: () => void;
}

const Impressum: React.FC<ImpressumProps> = ({ onNavigateBack }) => {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans p-6 sm:p-8 md:p-12 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-zinc-200">
        <button
          onClick={onNavigateBack}
          className="mb-8 text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Zurück zum Generator
        </button>

        <h1 className="text-3xl font-bold text-zinc-900 mb-8 border-b pb-4">
          Impressum
        </h1>

        <div className="space-y-6 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">
              Angaben gemäß § 5 TMG
            </h2>
            <p>Anwaltskanzlei Gür</p>
            <p>Fatih Mehmet Gür</p>
            <p>Alter Wall 69</p>
            <p>20457 Hamburg</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">
              Kontakt
            </h2>
            <p>Telefon: 040 57309020</p>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:info@kanzlei-guer.de"
                className="text-indigo-600 hover:underline"
              >
                info@kanzlei-guer.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">
              Aufsichtsbehörde
            </h2>
            <p>Hanseatische Rechtsanwaltskammer Hamburg</p>
            <p>Valentinskamp 88</p>
            <p>20355 Hamburg</p>
            <a
              href="https://www.rak-hamburg.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              https://www.rak-hamburg.de/
            </a>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">
              Berufsbezeichnung und berufsrechtliche Regelungen
            </h2>
            <p>
              <strong>Berufsbezeichnung:</strong> Rechtsanwalt
            </p>
            <p>
              <strong>Zuständige Kammer:</strong> Rechtsanwaltskammer Hamburg,
              Valentinskamp 88, 20355 Hamburg
            </p>
            <p>
              <strong>Verliehen in:</strong> Deutschland
            </p>
            <p className="mt-2">
              <strong>Es gelten folgende berufsrechtliche Regelungen:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>
                <a
                  href="https://www.gesetze-im-internet.de/brao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Bundesrechtsanwaltsordnung (BRAO)
                </a>
              </li>
              <li>
                <a
                  href="https://www.gesetze-im-internet.de/brago/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Bundesrechtsanwaltsgebührenordnung (BRAGO)
                </a>
              </li>
              <li>
                <a
                  href="https://www.gesetze-im-internet.de/rvg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Rechtsanwaltsvergütungsgesetz (RVG)
                </a>
              </li>
              <li>
                <a
                  href="https://www.brak.de/die-brak/organisation-der-brak/berufsrecht/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Berufsordnung der Rechtsanwälte (BORA)
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">
              Angaben zur Berufshaftpflichtversicherung
            </h2>
            <p>
              <strong>Name und Sitz des Versicherers:</strong>
            </p>
            <p>V-A V Allgemeine Versicherung AG</p>
            <p>Raiffeisenplatz 1</p>
            <p>65189 Wiesbaden</p>
            <p className="mt-2">
              <strong>Geltungsraum der Versicherung:</strong> Deutschland
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
