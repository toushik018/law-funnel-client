import React, { useState } from "react";
import { AuthService } from "../services/authService";
import { useAuthStore } from "@/stores/authStore";
import { User, Mail, Lock, Shield, Check } from "lucide-react";
import TermsAndConditions from "./TermsAndConditions";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const { login, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions to create an account");
      return;
    }

    setLoading(true);

    try {
      // First register the user
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        acceptedTerms: acceptedTerms,
      });

      // Then automatically log them in
      const loginResponse = await AuthService.login({
        email: formData.email,
        password: formData.password,
      });

      login(loginResponse.data.user);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary rounded-xl">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Konto erstellen
          </h1>
          <p className="text-muted-foreground">
            Treten Sie Law Funnel bei, um Rechtsdokumente zu verarbeiten
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-destructive-foreground text-xs font-bold">
                    !
                  </span>
                </div>
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Vollständiger Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="Geben Sie Ihren vollständigen Namen ein"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email-Adresse
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="Geben Sie Ihre E-Mail ein"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Passwort
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="Erstellen Sie ein Passwort"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Passwort bestätigen
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="Bestätigen Sie Ihr Passwort"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring focus:ring-2 focus:ring-offset-0"
                  required
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="terms"
                  className="font-medium text-foreground cursor-pointer"
                >
                  Ich stimme den{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                  >
                    Allgemeinen Geschäftsbedingungen
                  </button>{" "}
                  zu
                  <span className="text-destructive ml-1">*</span>
                </label>
                <p className="text-muted-foreground text-xs mt-1">
                  Sie müssen unsere Allgemeinen Geschäftsbedingungen lesen und
                  akzeptieren, bevor Sie ein Konto erstellen.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptedTerms}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Konto wird erstellt...</span>
                </div>
              ) : (
                "Konto erstellen"
              )}
            </button>

            {/* Switch to Login */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Haben Sie bereits ein Konto?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                >
                  Anmelden
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Terms and Conditions Modal */}
        <TermsAndConditions
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
        />
      </div>
    </div>
  );
}
