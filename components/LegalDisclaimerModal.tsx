import React, { useState } from 'react';

interface LegalDisclaimerModalProps {
    onAcknowledge: (dismiss: boolean) => void;
}

const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ onAcknowledge }) => {
    const [dismiss, setDismiss] = useState(false);

    const handleAcknowledge = () => {
        onAcknowledge(dismiss);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 transform transition-all scale-100 opacity-100">
                <h2 className="text-xl font-bold text-zinc-800">Wichtiger rechtlicher Hinweis</h2>
                <p className="mt-4 text-zinc-600">
                    Mir ist bewusst, dass diese Webapp lediglich eine technische Unterstützung zur Erstellung und Verwaltung von Rechnungen und Mahnungen bereitstellt. Die rechtliche Verantwortung für Inhalt, Zulässigkeit und Wirksamkeit der Rechnungen und Mahnungen liegt ausschließlich bei mir.
                </p>
                <div className="mt-6 flex items-start">
                    <input
                        id="dismiss-checkbox"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500 mt-1"
                        checked={dismiss}
                        onChange={(e) => setDismiss(e.target.checked)}
                    />
                    <label htmlFor="dismiss-checkbox" className="ml-3 block text-sm text-zinc-700 cursor-pointer">
                        Nicht erneut anzeigen (für 30 Tage)
                    </label>
                </div>
                <div className="mt-8 text-right">
                    <button
                        onClick={handleAcknowledge}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        Verstanden & Akzeptiert
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalDisclaimerModal;
