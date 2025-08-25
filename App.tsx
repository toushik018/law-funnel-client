import React, { useState, useCallback, useEffect } from "react";
import {
  AppState,
  InvoiceData,
  PaymentNoticeContent,
  ClientType,
  CompanyDetails,
  LawyerDetails,
} from "./types";
import { extractTextFromPdf } from "./services/pdfReaderService";
import {
  extractInvoiceData,
  generatePaymentNotice,
} from "./services/geminiService";
import { AuthService } from "./services/authService";
import AuthWrapper from "./components/AuthWrapper";
import FileUpload from "./components/FileUpload";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import InvoiceSummary from "./components/InvoiceSummary";
import NoticePreview from "./components/NoticePreview";
import DocumentIcon from "./components/icons/DocumentIcon";
import LegalDisclaimerModal from "./components/LegalDisclaimerModal";
import Impressum from "./components/Impressum";
import { useAuthStore } from "./stores/authStore";
import Profile from "./components/Profile";
import DashboardHeader from "./components/Dashboard/DashboardHeader";
import DashboardStats from "./components/Dashboard/DashboardStats";
import Footer from "./components/Dashboard/Footer";
import LegalQualification, {
  LegalQualificationData,
} from "./components/LegalQualification";
import DigitalSignature, {
  DigitalSignatureData,
} from "./components/DigitalSignature";
import useCaseStore from "./stores/caseStore";
import CaseHistory from "./components/CaseHistory";
import ModernStepper from "./components/ModernStepper";
import ClientTypeSelection from "./components/ClientTypeSelection";
import InvoiceUpload from "./components/InvoiceUpload";

// Base interest rate as of January 1st, 2024. This should be updated semi-annually.
// Source: https://www.bundesbank.de/de/bundesbank/organisation/agb-und-regelungen/basiszinssatz-607820
const BASISZINSSATZ = 0.0362; // 3.62%

export default function App() {
  // Auth store
  const { user, logout, setUser, setInitializing } = useAuthStore();

  // Case store for integrated case management
  const {
    currentCase,
    createCase,
    updateLegalQualification,
    updateClientType,
    updatePaymentNoticeStatus,
    completeCase,
    clearCurrentCase,
    loading: caseLoading,
    error: caseError,
  } = useCaseStore();

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<{
    message: string;
    title?: string;
  } | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [paymentNotice, setPaymentNotice] =
    useState<PaymentNoticeContent | null>(null);
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [flatFee, setFlatFee] = useState(0);
  const [clientType, setClientType] = useState<ClientType>("company");

  // State for legal confirmations
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Legal qualification workflow state - now integrated with case management
  const [legalQualificationData, setLegalQualificationData] =
    useState<LegalQualificationData | null>(null);
  const [digitalSignatureData, setDigitalSignatureData] =
    useState<DigitalSignatureData | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "legal" | "signature" | "client" | "upload" | "processing"
  >("legal");

  // Track if we've created a case for this session
  const [caseCreated, setCaseCreated] = useState(false);

  // Simple routing state
  const [route, setRoute] = useState(window.location.pathname);

  const lateFee = interestAmount + flatFee;

  useEffect(() => {
    const initializeApp = async () => {
      // Start initializing (this will show global loading)
      setInitializing(true);

      try {
        // Check authentication first
        const authResult = await AuthService.checkAuth();
        if (authResult.isAuthenticated && authResult.user) {
          setUser(authResult.user);
        }
      } catch (error) {
        // User is not authenticated, which is fine for public access
        console.log("Not authenticated:", error);
      }

      // Check for startup legal disclaimer
      try {
        const dismissedUntil = localStorage.getItem(
          "legalDisclaimerDismissedUntil"
        );
        if (
          !dismissedUntil ||
          new Date().getTime() > parseInt(dismissedUntil, 10)
        ) {
          setShowLegalModal(true);
        }
      } catch (e) {
        console.error("Failed to check legal disclaimer status", e);
        setShowLegalModal(true); // Show disclaimer if there's any issue
      }

      // Finish initializing
      setInitializing(false);
    };

    initializeApp();

    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [setUser, setInitializing]);

  // Auto-create case when user starts the workflow (when they are authenticated)
  // NOTE: Case creation moved to handleLegalQualificationComplete to avoid creating
  // draft cases on page reload. Cases are now created when user actually progresses.

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const handleAcknowledgeDisclaimer = (dismiss: boolean) => {
    if (dismiss) {
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      const expiry = new Date().getTime() + oneMonth;
      localStorage.setItem("legalDisclaimerDismissedUntil", expiry.toString());
    }
    setShowLegalModal(false);
  };

  // Handle logout with server call to clear cookies
  const handleLogout = async () => {
    try {
      // Call server to clear httpOnly cookies
      await AuthService.logout();
    } catch (error) {
      // Log error but don't block logout
      console.error("Server logout error:", error);
    } finally {
      // Always clear local auth state regardless of server response
      logout();
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setError(null);
    setPdfFile(null);
    setInvoiceData(null);
    setPaymentNotice(null);
    setDaysOverdue(0);
    setInterestAmount(0);
    setFlatFee(0);
    setLegalQualificationData(null);
    setDigitalSignatureData(null);
    setCurrentStep("legal");
    setCaseCreated(false);
    // Clear current case to start fresh
    clearCurrentCase();
    // Do not reset clientType, companyDetails, or lawyerDetails
  };

  const generateNotice = useCallback(
    async (
      data: InvoiceData,
      overdue: number,
      interest: number,
      flat: number
    ) => {
      setAppState(AppState.GENERATING_NOTICE);
      const newTotal = data.totalAmount + interest + flat;

      // Create company details from user profile
      const ownCompanyDetails: CompanyDetails = {
        name: user?.company || "",
        address: user?.address || "",
        contact: user?.email || "",
        bankName: user?.bankName || "",
        iban: user?.iban || "",
        bic: user?.bic || "",
        signerName: user?.name || "",
      };

      // Create lawyer details from user profile
      const lawyerDetails: LawyerDetails = {
        name: user?.lawFirm || "",
      };

      const notice = await generatePaymentNotice(
        {
          ...data,
          daysOverdue: overdue,
          interestAmount: interest,
          flatFee: flat,
          newTotal: newTotal,
        },
        { ownCompany: ownCompanyDetails, lawyer: lawyerDetails },
        clientType
      );

      setPaymentNotice(notice);

      // Update case with payment notice generation status
      if (currentCase) {
        try {
          await updatePaymentNoticeStatus(true);
          // Mark case as completed
          await completeCase();
        } catch (error) {
          console.error(
            "Failed to update case with payment notice status:",
            error
          );
          // Don't block the user workflow
        }
      }

      setAppState(AppState.SUCCESS);
    },
    [user, clientType, currentCase, updatePaymentNoticeStatus, completeCase]
  );

  const processFile = useCallback(
    async (file: File) => {
      try {
        setPdfFile(file);
        setCurrentStep("processing");
        setAppState(AppState.PROCESSING_PDF);
        const text = await extractTextFromPdf(file);
        if (!text.trim()) {
          throw new Error(
            "Aus der PDF-Datei konnte kein Text extrahiert werden. Es könnte sich um eine reine Bild-PDF handeln."
          );
        }

        setAppState(AppState.EXTRACTING_DATA);
        const data = await extractInvoiceData(text);

        const invoiceDate = new Date(data.invoiceDate);
        const todayForValidation = new Date();
        invoiceDate.setHours(0, 0, 0, 0);
        todayForValidation.setHours(0, 0, 0, 0);

        if (isNaN(invoiceDate.getTime())) {
          throw new Error(
            `Die KI hat ein ungültiges Datumsformat für das Rechnungsdatum zurückgegeben: "${data.invoiceDate}". Bitte überprüfen Sie die PDF.`
          );
        }

        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const ageInMs = todayForValidation.getTime() - invoiceDate.getTime();

        if (ageInMs < thirtyDaysInMs) {
          const formattedInvoiceDate = new Date(
            data.invoiceDate
          ).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          });
          setError({
            title: "Rechnung zu neu für eine Mahnung",
            message: `Eine Mahnung kann erst 30 Tage nach Rechnungsdatum erstellt werden. Diese Rechnung wurde am ${formattedInvoiceDate} ausgestellt.`,
          });
          setAppState(AppState.ERROR);
          return;
        }

        const dueDate = new Date(data.dueDate);
        const today = new Date();
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (isNaN(dueDate.getTime())) {
          throw new Error(
            `Die KI hat ein ungültiges Datumsformat für das Fälligkeitsdatum zurückgegeben: "${data.dueDate}". Bitte überprüfen Sie die PDF.`
          );
        }

        const overdue = Math.max(
          0,
          Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          )
        );

        const invoiceAmount = data.totalAmount;
        const annualInterestFactor = overdue / 365;
        let calculatedInterest = 0;
        let calculatedFlatFee = 0;

        if (overdue > 0) {
          if (clientType === "private") {
            const interestRate = 0.05 + BASISZINSSATZ;
            calculatedInterest =
              invoiceAmount * interestRate * annualInterestFactor;
          } else {
            const interestRate = 0.09 + BASISZINSSATZ;
            calculatedFlatFee = 40;
            calculatedInterest =
              invoiceAmount * interestRate * annualInterestFactor;
          }
        }

        setInvoiceData(data);
        setDaysOverdue(overdue);
        setInterestAmount(calculatedInterest);
        setFlatFee(calculatedFlatFee);

        await generateNotice(
          data,
          overdue,
          calculatedInterest,
          calculatedFlatFee
        );
      } catch (err: any) {
        console.error(err);
        setError({
          message: err.message || "Ein unbekannter Fehler ist aufgetreten.",
        });
        setAppState(AppState.ERROR);
      }
    },
    [clientType, generateNotice]
  );

  const handleRegenerateNotice = useCallback(async () => {
    if (!invoiceData) return;
    try {
      await generateNotice(invoiceData, daysOverdue, interestAmount, flatFee);
    } catch (err: any) {
      console.error(err);
      setError({
        message:
          err.message || "Die Mahnung konnte nicht neu generiert werden.",
      });
      setAppState(AppState.ERROR);
    }
  }, [invoiceData, daysOverdue, interestAmount, flatFee, generateNotice]);

  // Handle legal qualification completion
  const handleLegalQualificationComplete = async (
    data: LegalQualificationData
  ) => {
    setLegalQualificationData(data);

    // Create case when user actually completes legal qualification (if not already created)
    if (user && !currentCase && !caseCreated) {
      try {
        const newCase = await createCase(
          `Law Funnel Case - ${new Date().toLocaleDateString()}`
        );
        setCaseCreated(true);

        // After case is created and returned, save the legal qualification data
        // Use the returned case to ensure we have the case data
        await updateLegalQualification(data);
      } catch (error) {
        console.error(
          "Failed to create case or save legal qualification:",
          error
        );
        // Don't block the workflow, user can still continue without persistence
      }
    } else if (currentCase) {
      // If case already exists, just update the legal qualification data
      try {
        await updateLegalQualification(data);
      } catch (error) {
        console.error("Failed to save legal qualification:", error);
        // Don't block the workflow
      }
    }

    setCurrentStep("signature");
  };

  // Handle digital signature completion
  const handleDigitalSignatureComplete = (data: DigitalSignatureData) => {
    setDigitalSignatureData(data);
    setCurrentStep("client");
  };

  // Handle back navigation in workflow
  const handleWorkflowBack = () => {
    if (currentStep === "signature") {
      setCurrentStep("legal");
    } else if (currentStep === "client") {
      setCurrentStep("signature");
    } else if (currentStep === "upload") {
      setCurrentStep("client");
    }
  };

  // Handle client type selection and move to upload step
  const handleClientTypeSelected = async (selectedClientType: ClientType) => {
    setClientType(selectedClientType);

    // Update case with client type
    if (currentCase) {
      try {
        await updateClientType(selectedClientType);
      } catch (error) {
        console.error("Failed to update case with client type:", error);
        // Don't block workflow
      }
    }
    setCurrentStep("upload");
  };

  const renderRightPanelContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
            <DocumentIcon className="w-20 h-20 mb-4 text-zinc-300" />
            <h2 className="text-xl font-semibold text-zinc-600">
              Ihre generierte Mahnung wird hier angezeigt
            </h2>
            <p className="max-w-xs mt-2 text-sm">
              Geben Sie links Ihre Daten ein und laden Sie eine Rechnung hoch,
              um zu beginnen.
            </p>
          </div>
        );
      case AppState.PROCESSING_PDF:
        return <Loader text="Lese PDF-Dokument..." />;
      case AppState.EXTRACTING_DATA:
        return <Loader text="Analysiere Rechnung mit KI..." />;
      case AppState.GENERATING_NOTICE:
        return <Loader text="Entwerfe Mahnung..." />;
      case AppState.SUCCESS:
        if (!invoiceData || !paymentNotice)
          return (
            <ErrorMessage
              message="Etwas ist schiefgegangen."
              onRetry={handleReset}
            />
          );
        return (
          <div className="w-full animate-fade-in">
            <InvoiceSummary
              invoiceData={invoiceData}
              daysOverdue={daysOverdue}
              lateFee={lateFee}
              clientType={clientType}
              onInvoiceDataChange={setInvoiceData}
              onRegenerate={handleRegenerateNotice}
            />
            <NoticePreview
              noticeContent={paymentNotice}
              ownCompanyDetails={{
                name: user?.company || "",
                address: user?.address || "",
                contact: user?.email || "",
                bankName: user?.bankName || "",
                iban: user?.iban || "",
                bic: user?.bic || "",
                signerName: user?.name || "",
              }}
              invoiceData={invoiceData}
            />
          </div>
        );
      case AppState.ERROR:
        return (
          <ErrorMessage
            title={error?.title}
            message={
              error?.message || "Ein unerwarteter Fehler ist aufgetreten."
            }
            onRetry={handleReset}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (route === "/impressum") {
      return <Impressum onNavigateBack={() => navigate("/")} />;
    }

    if (route === "/profile") {
      return <Profile />;
    }

    if (route === "/cases") {
      return <CaseHistory onNavigateBack={() => navigate("/")} />;
    }

    return (
      <div
        className={`min-h-screen bg-gray-50 ${showLegalModal ? "blur-sm" : ""}`}
      >
        {/* Dashboard Header */}
        <div className={showLegalModal ? "pointer-events-none" : ""}>
          <DashboardHeader
            user={user}
            onNavigateProfile={() => navigate("/profile")}
            onNavigateCases={() => navigate("/cases")}
            onLogout={handleLogout}
          />
        </div>

        {/* Dashboard Content */}
        <main
          className={`max-w-7xl mx-auto px-6 lg:px-8 py-8 ${
            showLegalModal ? "pointer-events-none" : ""
          }`}
        >
          {appState === AppState.IDLE ? (
            // Dashboard View with Legal Qualification Workflow
            <div className="space-y-8">
              {/* Stats Cards */}
              <DashboardStats />

              {/* Legal Qualification Workflow */}
              <div className="max-w-4xl mx-auto">
                {/* Case Status Display - Only show after case is created */}
                {currentCase && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Case Created: {currentCase.caseNumber}
                        </p>
                        <p className="text-xs text-blue-600">
                          Your progress is being saved automatically
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case Error Display - Only show when there's actually an error */}
                {caseError && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Case Management Warning
                        </p>
                        <p className="text-xs text-yellow-600">
                          {caseError} - You can continue, but progress may not
                          be saved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Modern Stepper Component */}
                <ModernStepper
                  currentStep={currentStep}
                  steps={[
                    { key: "legal", label: "Questions", step: 1 },
                    { key: "signature", label: "Signature", step: 2 },
                    { key: "client", label: "Client Type", step: 3 },
                    { key: "upload", label: "Upload Invoice", step: 4 },
                  ]}
                  loading={caseLoading}
                />

                {/* Step Content */}
                {currentStep === "legal" && (
                  <LegalQualification
                    onComplete={handleLegalQualificationComplete}
                  />
                )}

                {currentStep === "signature" && (
                  <DigitalSignature
                    userName={user?.name || ""}
                    onComplete={handleDigitalSignatureComplete}
                    onBack={handleWorkflowBack}
                  />
                )}

                {currentStep === "client" && (
                  <ClientTypeSelection
                    initialClientType={clientType}
                    onComplete={handleClientTypeSelected}
                    onBack={handleWorkflowBack}
                  />
                )}

                {currentStep === "upload" && (
                  <InvoiceUpload
                    onFileProcessing={processFile}
                    onBack={handleWorkflowBack}
                  />
                )}
              </div>
            </div>
          ) : (
            // Processing/Results View
            <div className="space-y-6">
              {/* Current File Info */}
              {pdfFile && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DocumentIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Processing Invoice
                      </p>
                      <p className="text-lg font-semibold text-slate-900 truncate">
                        {pdfFile.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        Size: {(pdfFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    {(appState === AppState.SUCCESS ||
                      appState === AppState.ERROR) && (
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                      >
                        Process New Invoice
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-96 p-6">
                {renderRightPanelContent()}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return (
    <AuthWrapper>
      {showLegalModal && (
        <LegalDisclaimerModal onAcknowledge={handleAcknowledgeDisclaimer} />
      )}
      {renderContent()}
    </AuthWrapper>
  );
}
