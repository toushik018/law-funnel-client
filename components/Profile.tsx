"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { AuthService } from "../services/authService";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowLeft,
  Edit3,
  User,
  Building2,
  Phone,
  Home,
  Banknote,
  FileText,
  Check,
  X,
  CheckCircle,
} from "lucide-react";
import PhoneInput from "./PhoneInput";

interface ProfileProps {
  onNavigateBack?: () => void;
}

export default function Profile({ onNavigateBack }: ProfileProps) {
  const { user, setUser, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    phone: "",
    bankName: "",
    iban: "",
    bic: "",
    lawFirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        address: user.address || "",
        phone: user.phone || "",
        bankName: user.bankName || "",
        iban: user.iban || "",
        bic: user.bic || "",
        lawFirm: user.lawFirm || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await AuthService.updateProfile(formData);
      setUser(response.data);
      setSuccess("✅ Profil erfolgreich aktualisiert!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Profil konnte nicht aktualisiert werden");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        address: user.address || "",
        phone: user.phone || "",
        bankName: user.bankName || "",
        iban: user.iban || "",
        bic: user.bic || "",
        lawFirm: user.lawFirm || "",
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Zurück</span>
            </button>

            <div className="text-center flex-1 mx-2">
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                <span className="hidden sm:inline">Profil Dashboard</span>
                <span className="sm:hidden">Profil</span>
              </h1>
              <p className="text-muted-foreground text-xs hidden md:block">
                Verwalten Sie Ihre Informationen
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 bg-primary text-primary-foreground text-xs md:text-sm rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Bearbeiten</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Alerts */}
      <div className="max-w-5xl mx-auto px-3 md:px-4 pt-3">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
              {error}
            </div>
          </div>
        )}
        {success && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {success}
            </div>
          </div>
        )}
      </div>

      {/* Ultra-Compact Dashboard Grid */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4"
      >
        {/* Personal & Company Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* Personal Info */}
          <div className="bg-card rounded-lg border border-border p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Persönlich
                </h2>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Grundlegende Angaben
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                name="name"
                disabled={!isEditing}
                placeholder="Vollständiger Name"
                className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                disabled={!isEditing}
                placeholder="E-Mail-Adresse"
                className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Company */}
          <div className="bg-card rounded-lg border border-border p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-secondary/10 rounded-md">
                <Building2 className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Unternehmen
                </h2>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Geschäftsinformationen
                </p>
              </div>
            </div>
            <input
              name="company"
              disabled={!isEditing}
              placeholder="Firmenname"
              className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-card rounded-lg border border-border p-3 md:p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-accent/10 rounded-md">
              <Home className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-card-foreground">
                Kontakt
              </h2>
              <p className="text-muted-foreground text-xs hidden sm:block">
                Wie man Sie erreicht
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <textarea
                name="address"
                disabled={!isEditing}
                placeholder="Vollständige Adresse"
                rows={2}
                className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                disabled={!isEditing}
                placeholder="Telefonnummer eingeben"
                defaultCountry="DE"
              />
            </div>
          </div>
        </div>

        {/* Banking & Legal Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* Banking */}
          <div className="bg-card rounded-lg border border-border p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-chart-1/10 rounded-md">
                <Banknote className="w-4 h-4 text-chart-1" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Banking
                </h2>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Finanzielle Details
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                name="bankName"
                disabled={!isEditing}
                placeholder="Bankname"
                className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.bankName}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="iban"
                  disabled={!isEditing}
                  placeholder="IBAN"
                  className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                  value={formData.iban}
                  onChange={handleChange}
                />
                <input
                  name="bic"
                  disabled={!isEditing}
                  placeholder="BIC"
                  className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                  value={formData.bic}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-card rounded-lg border border-border p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-destructive/10 rounded-md">
                <FileText className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Rechtliches
                </h2>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Rechtliche Informationen
                </p>
              </div>
            </div>
            <input
              name="lawFirm"
              disabled={!isEditing}
              placeholder="Anwaltskanzlei / Inkassobüro"
              className="w-full bg-input border border-border px-3 py-2.5 md:py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
              value={formData.lawFirm}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Compact Actions */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-2 bg-secondary text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 transition-colors order-2 sm:order-1"
            >
              <X className="w-4 h-4" />
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors order-1 sm:order-2"
            >
              <Check className="w-4 h-4" />
              {isLoading ? "Speichere..." : "Speichern"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
