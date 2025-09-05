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
              Terms and Conditions
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
                  1. Acceptance of Terms
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                By accessing and using Law Funnel ("the Service"), you accept
                and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  2. Service Description
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Law Funnel is a legal document processing platform that uses
                artificial intelligence to analyze and extract information from
                legal documents. The service is designed to assist legal
                professionals and individuals in processing legal documents more
                efficiently.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  3. User Responsibilities
                </h3>
              </div>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials
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
                  You agree not to use the service for any unlawful or
                  prohibited activities
                </li>
                <li>
                  You understand that the AI analysis is for assistance purposes
                  and should not replace professional legal advice
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  4. Privacy and Data Protection
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We are committed to protecting your privacy and the
                confidentiality of your legal documents. Your documents are
                processed securely, and we implement appropriate technical and
                organizational measures to protect your personal data. We do not
                share your documents or extracted data with third parties
                without your explicit consent.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  5. Intellectual Property
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of Law
                Funnel and its licensors. The service is protected by copyright,
                trademark, and other laws.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  6. Disclaimer of Warranties
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The information provided by Law Funnel is for general
                informational purposes only. While we strive for accuracy, we
                make no warranties or representations about the accuracy,
                reliability, completeness, or timeliness of the content. The AI
                analysis should not be considered as professional legal advice.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  7. Limitation of Liability
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                In no event shall Law Funnel, its directors, employees, or
                agents be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses resulting from your use of the service.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  8. Subscription and Payment
                </h3>
              </div>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                <li>
                  Some features of the service may require a paid subscription
                </li>
                <li>
                  Subscription fees are billed in advance on a monthly or annual
                  basis
                </li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>
                  We reserve the right to modify subscription pricing with 30
                  days notice
                </li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  9. Termination
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We may terminate or suspend your account and bar access to the
                service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  10. Changes to Terms
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  11. Governing Law
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the
                jurisdiction in which Law Funnel operates, without regard to its
                conflict of law provisions.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-0">
                  12. Contact Information
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                If you have any questions about these Terms and Conditions,
                please contact us at legal@lawfunnel.com
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
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
