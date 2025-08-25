import React from 'react';
import { CompanyDetails, LawyerDetails } from '../types';

interface SettingsFormProps {
    companyDetails: CompanyDetails;
    lawyerDetails: LawyerDetails;
    onSettingsChange: (company: CompanyDetails, lawyer: LawyerDetails) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ companyDetails, lawyerDetails, onSettingsChange }) => {

    const handleCompanyChange = (field: keyof CompanyDetails, value: string) => {
        const newDetails = { ...companyDetails, [field]: value };
        onSettingsChange(newDetails, lawyerDetails);
    };

    const handleLawyerChange = (field: keyof LawyerDetails, value: string) => {
        const newDetails = { ...lawyerDetails, [field]: value };
        onSettingsChange(companyDetails, newDetails);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md text-sm shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

    return (
        <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-4">
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700">Ihr Unternehmen / Ihre Kanzlei</label>
                <input
                    type="text"
                    id="companyName"
                    value={companyDetails.name}
                    onChange={(e) => handleCompanyChange('name', e.target.value)}
                    className={inputClasses}
                    placeholder="Musterfirma GmbH"
                />
            </div>
            <div>
                <label htmlFor="signerName" className="block text-sm font-medium text-zinc-700">Ihr Name (für die Unterschrift)</label>
                <input
                    type="text"
                    id="signerName"
                    value={companyDetails.signerName || ''}
                    onChange={(e) => handleCompanyChange('signerName', e.target.value)}
                    className={inputClasses}
                    placeholder="Max Mustermann"
                />
            </div>
            <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-zinc-700">Ihre Adresse</label>
                <input
                    type="text"
                    id="companyAddress"
                    value={companyDetails.address}
                    onChange={(e) => handleCompanyChange('address', e.target.value)}
                    className={inputClasses}
                    placeholder="Musterstraße 1, 12345 Musterstadt"
                />
            </div>
            <div>
                <label htmlFor="companyContact" className="block text-sm font-medium text-zinc-700">Ihre Kontaktdaten (E-Mail / Telefon)</label>
                <input
                    type="text"
                    id="companyContact"
                    value={companyDetails.contact}
                    onChange={(e) => handleCompanyChange('contact', e.target.value)}
                    className={inputClasses}
                    placeholder="kontakt@musterfirma.de / 0123-456789"
                />
            </div>
             <div className="border-t border-zinc-200 pt-4 space-y-4">
                <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-zinc-700">Name der Bank</label>
                    <input
                        type="text"
                        id="bankName"
                        value={companyDetails.bankName}
                        onChange={(e) => handleCompanyChange('bankName', e.target.value)}
                        className={inputClasses}
                        placeholder="Musterbank AG"
                    />
                </div>
                 <div>
                    <label htmlFor="iban" className="block text-sm font-medium text-zinc-700">IBAN</label>
                    <input
                        type="text"
                        id="iban"
                        value={companyDetails.iban}
                        onChange={(e) => handleCompanyChange('iban', e.target.value)}
                        className={inputClasses}
                        placeholder="DE89 3704 0044 0532 0130 00"
                    />
                </div>
                 <div>
                    <label htmlFor="bic" className="block text-sm font-medium text-zinc-700">BIC</label>
                    <input
                        type="text"
                        id="bic"
                        value={companyDetails.bic}
                        onChange={(e) => handleCompanyChange('bic', e.target.value)}
                        className={inputClasses}
                        placeholder="MARKDEFFXXX"
                    />
                </div>
            </div>
            <div className="border-t border-zinc-200 pt-4">
                <label htmlFor="lawyerName" className="block text-sm font-medium text-zinc-700">Anwaltskanzlei / Inkassobüro</label>
                <input
                    type="text"
                    id="lawyerName"
                    value={lawyerDetails.name}
                    onChange={(e) => handleLawyerChange('name', e.target.value)}
                    className={inputClasses}
                    placeholder="Kanzlei Schnell & Partner"
                />
                 <p className="mt-1 text-xs text-zinc-500">Wird in der Mahnung als nächster Eskalationsschritt genannt.</p>
            </div>
        </div>
    );
};

export default SettingsForm;