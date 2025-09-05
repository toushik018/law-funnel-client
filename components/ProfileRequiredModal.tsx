import React from "react";
import {
  User,
  Building2,
  Phone,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react";

interface ProfileRequiredModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export default function ProfileRequiredModal({
  isOpen,
  onContinue,
}: ProfileRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-card rounded-xl shadow-2xl max-w-lg w-full animate-fade-in border border-border">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
            <User className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-2xl font-bold text-foreground text-center mb-2">
            Complete Your Profile
          </h3>

          <p className="text-muted-foreground text-center text-sm">
            To continue using Law Funnel, please complete your profile
            information
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Company</p>
                <p className="text-xs text-muted-foreground">
                  Business details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-accent/50 rounded-md">
                <Phone className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Contact</p>
                <p className="text-xs text-muted-foreground">Address & phone</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-secondary/50 rounded-md">
                <CreditCard className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Banking</p>
                <p className="text-xs text-muted-foreground">Payment details</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-destructive/10 rounded-md">
                <FileText className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Legal</p>
                <p className="text-xs text-muted-foreground">
                  Firm information
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">
                Important
              </p>
              <p className="text-sm text-amber-700">
                This information is required to generate proper legal notices
                and invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            Continue to Profile Setup
          </button>
        </div>
      </div>
    </div>
  );
}
