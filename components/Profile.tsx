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
      setSuccess("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
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
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">
                Profile Dashboard
              </h1>
              <p className="text-muted-foreground text-xs">
                Manage your information
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Alerts */}
      <div className="max-w-5xl mx-auto px-4 pt-3">
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
        className="max-w-5xl mx-auto px-4 py-4 space-y-4"
      >
        {/* Personal & Company Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Personal Info */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Personal
                </h2>
                <p className="text-muted-foreground text-xs">Basic details</p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                name="name"
                disabled={!isEditing}
                placeholder="Full Name"
                className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                disabled={!isEditing}
                placeholder="Email Address"
                className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Company */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-secondary/10 rounded-md">
                <Building2 className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Company
                </h2>
                <p className="text-muted-foreground text-xs">Business info</p>
              </div>
            </div>
            <input
              name="company"
              disabled={!isEditing}
              placeholder="Company Name"
              className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-accent/10 rounded-md">
              <Home className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-card-foreground">
                Contact
              </h2>
              <p className="text-muted-foreground text-xs">How to reach you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <textarea
                name="address"
                disabled={!isEditing}
                placeholder="Full Address"
                rows={2}
                className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/4">
                <Phone className="w-3 h-3 text-muted-foreground" />
              </div>
              <input
                name="phone"
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-input border border-border pl-9 pr-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Banking & Legal Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Banking */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-chart-1/10 rounded-md">
                <Banknote className="w-4 h-4 text-chart-1" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Banking
                </h2>
                <p className="text-muted-foreground text-xs">
                  Financial details
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                name="bankName"
                disabled={!isEditing}
                placeholder="Bank Name"
                className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                value={formData.bankName}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="iban"
                  disabled={!isEditing}
                  placeholder="IBAN"
                  className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                  value={formData.iban}
                  onChange={handleChange}
                />
                <input
                  name="bic"
                  disabled={!isEditing}
                  placeholder="BIC"
                  className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
                  value={formData.bic}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-destructive/10 rounded-md">
                <FileText className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Legal
                </h2>
                <p className="text-muted-foreground text-xs">
                  Legal information
                </p>
              </div>
            </div>
            <input
              name="lawFirm"
              disabled={!isEditing}
              placeholder="Law Firm / Collection Agency"
              className="w-full bg-input border border-border px-3 py-2 text-sm rounded-md disabled:bg-muted disabled:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors placeholder:text-muted-foreground"
              value={formData.lawFirm}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Compact Actions */}
        {isEditing && (
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
