import React from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-3">
              1. Acceptance of Terms
            </h3>
            <p className="mb-4">
              By accessing and using Law Funnel ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by the above, please do not use this
              service.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              2. Service Description
            </h3>
            <p className="mb-4">
              Law Funnel is a legal document processing platform that uses
              artificial intelligence to analyze and extract information from
              legal documents. The service is designed to assist legal
              professionals and individuals in processing legal documents more
              efficiently.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              3. User Responsibilities
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You agree to provide accurate and complete information when
                creating your account
              </li>
              <li>
                You are responsible for all activities that occur under your
                account
              </li>
              <li>
                You agree not to use the service for any unlawful or prohibited
                activities
              </li>
              <li>
                You understand that the AI analysis is for assistance purposes
                and should not replace professional legal advice
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">
              4. Privacy and Data Protection
            </h3>
            <p className="mb-4">
              We are committed to protecting your privacy and the
              confidentiality of your legal documents. Your documents are
              processed securely, and we implement appropriate technical and
              organizational measures to protect your personal data. We do not
              share your documents or extracted data with third parties without
              your explicit consent.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              5. Intellectual Property
            </h3>
            <p className="mb-4">
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of Law Funnel and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              6. Disclaimer of Warranties
            </h3>
            <p className="mb-4">
              The information provided by Law Funnel is for general
              informational purposes only. While we strive for accuracy, we make
              no warranties or representations about the accuracy, reliability,
              completeness, or timeliness of the content. The AI analysis should
              not be considered as professional legal advice.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              7. Limitation of Liability
            </h3>
            <p className="mb-4">
              In no event shall Law Funnel, its directors, employees, or agents
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses resulting from
              your use of the service.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              8. Subscription and Payment
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Some features of the service may require a paid subscription
              </li>
              <li>
                Subscription fees are billed in advance on a monthly or annual
                basis
              </li>
              <li>All fees are non-refundable unless otherwise specified</li>
              <li>
                We reserve the right to modify subscription pricing with 30 days
                notice
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">9. Termination</h3>
            <p className="mb-4">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>

            <h3 className="text-lg font-semibold mb-3">10. Changes to Terms</h3>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>

            <h3 className="text-lg font-semibold mb-3">11. Governing Law</h3>
            <p className="mb-4">
              These Terms shall be interpreted and governed by the laws of the
              jurisdiction in which Law Funnel operates, without regard to its
              conflict of law provisions.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              12. Contact Information
            </h3>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please
              contact us at legal@lawfunnel.com
            </p>

            <p className="text-sm text-gray-600 mt-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
