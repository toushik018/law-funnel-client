"use client";

/**
 * Case History Page
 * Displays user's cases with filtering, status tracking, and management options
 */

import { useEffect, useState } from "react";
import useCaseStore from "../stores/caseStore";
import { CaseStatus } from "../services/caseService";

interface CaseHistoryProps {
  onNavigateBack: () => void;
}

export default function CaseHistory({ onNavigateBack }: CaseHistoryProps) {
  const { cases, loadUserCases, deleteCase, loading, error } = useCaseStore();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());

  // Toggle case expansion
  const toggleCaseExpansion = (caseId: string) => {
    setExpandedCases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

  // Utility functions
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: CaseStatus) => {
    const statusClass = getStatusBadgeClass(status);
    const statusText = formatCaseStatus(status).label;
    return <span className={statusClass}>{statusText}</span>;
  };

  // Load cases when component mounts or filter changes
  useEffect(() => {
    const statusFilter = selectedStatus === "all" ? undefined : selectedStatus;
    loadUserCases(currentPage, 20, statusFilter).then(() => {
      // Calculate total pages based on cases length (simplified)
      setTotalPages(Math.max(1, Math.ceil(cases.length / 20)));
    });
  }, [loadUserCases, currentPage, selectedStatus, cases.length]);

  const handleDeleteCase = async (caseId: string) => {
    try {
      await deleteCase(caseId);
      setShowDeleteConfirm(null);
      // Reload cases after deletion
      const statusFilter =
        selectedStatus === "all" ? undefined : selectedStatus;
      loadUserCases(currentPage, 20, statusFilter);
    } catch (error) {
      console.error("Failed to delete case:", error);
    }
  };

  const formatCaseStatus = (status: CaseStatus) => {
    // Simple status formatting for display
    return {
      label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      color: "gray", // Default color
      progress: 50, // Default progress
    };
  };

  const getStatusBadgeClass = (status: CaseStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    switch (status) {
      case CaseStatus.COMPLETED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case CaseStatus.NOTICE_GENERATED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case CaseStatus.CLIENT_TYPE_SELECTED:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case CaseStatus.CANCELLED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Case History
              </h1>
              <p className="text-muted-foreground text-sm">
                View and manage your payment notice cases
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-card rounded-lg border border-border/50 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">
                Filter:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as CaseStatus | "all");
                  setCurrentPage(1);
                }}
                className="border border-border rounded-md px-3 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Cases</option>
                <option value={CaseStatus.DRAFT}>Draft</option>
                <option value={CaseStatus.QUALIFICATION_COMPLETE}>
                  Legal Questions Complete
                </option>
                <option value={CaseStatus.SIGNATURE_COMPLETE}>
                  Signature Complete
                </option>
                <option value={CaseStatus.CLIENT_TYPE_SELECTED}>
                  Client Type Selected
                </option>
                <option value={CaseStatus.NOTICE_GENERATED}>
                  Notice Generated
                </option>
                <option value={CaseStatus.COMPLETED}>Completed</option>
                <option value={CaseStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              {cases.length} cases
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-destructive font-semibold text-sm mb-1">
                  Error Loading Cases
                </h3>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-card rounded-lg border border-border/50 p-12 text-center">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-muted-foreground/30 border-t-primary"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading cases...
            </h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we fetch your cases
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
            {cases.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-muted-foreground"
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
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No cases found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                  {selectedStatus === "all"
                    ? "You haven't created any cases yet. Start by creating your first payment notice case."
                    : `No cases found with status "${selectedStatus}". Try adjusting your filter or create a new case.`}
                </p>
                <button
                  onClick={onNavigateBack}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm"
                >
                  Create Your First Case
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {cases.map((case_) => (
                  <div
                    key={case_.id}
                    className="p-5 hover:bg-accent/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {case_.title || case_.caseNumber}
                          </h3>
                          {getStatusBadge(case_.status)}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Case:
                              </span>
                              <span className="font-mono font-medium text-foreground bg-accent px-2 py-1 rounded text-xs">
                                {case_.caseNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Created:
                              </span>
                              <span className="text-foreground font-medium">
                                {formatDate(case_.createdAt)}
                              </span>
                            </div>
                            {case_.completedAt && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                  Completed:
                                </span>
                                <span className="text-foreground font-medium">
                                  {formatDate(case_.completedAt)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              {case_.legalQualificationAnswers ? (
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-muted rounded-full"></div>
                              )}
                              <span className="text-muted-foreground">
                                Legal
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {case_.isDigitalSignatureCompleted ? (
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-muted rounded-full"></div>
                              )}
                              <span className="text-muted-foreground">
                                Signature
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {case_.clientType ? (
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-muted rounded-full"></div>
                              )}
                              <span className="text-muted-foreground">
                                Client{" "}
                                {case_.clientType && `(${case_.clientType})`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {case_.isNoticeGenerated ? (
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-muted rounded-full"></div>
                              )}
                              <span className="text-muted-foreground">
                                Notice
                              </span>
                            </div>
                            {case_.legalQualificationAnswers && (
                              <button
                                onClick={() => toggleCaseExpansion(case_.id)}
                                className="flex items-center gap-1 text-foreground hover:text-primary font-medium px-2 py-1 rounded hover:bg-accent transition-all duration-200 ml-auto"
                              >
                                <span className="text-sm">Details</span>
                                <svg
                                  className={`w-3 h-3 transition-transform duration-200 ${
                                    expandedCases.has(case_.id)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>

                          {expandedCases.has(case_.id) &&
                            case_.legalQualificationAnswers && (
                              <div className="mt-4 pt-4 border-t border-border/50">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                  Legal Qualification Details
                                </h4>
                                <div className="bg-accent/30 rounded-lg p-4 space-y-4">
                                  <div>
                                    <h5 className="font-medium text-foreground mb-2 text-sm">
                                      Contract Situation
                                    </h5>
                                    <p className="text-muted-foreground text-sm bg-card p-3 rounded border border-border/50">
                                      {
                                        case_.legalQualificationAnswers
                                          .contractSituation
                                      }
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-card p-3 rounded border border-border/50">
                                      <h5 className="font-medium text-foreground mb-1 text-sm">
                                        Invoice Sent
                                      </h5>
                                      <p className="text-muted-foreground text-sm">
                                        {formatDate(
                                          case_.legalQualificationAnswers
                                            .invoiceSentDate
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  {case_.legalQualificationAnswers
                                    .completedAt && (
                                    <div className="pt-3 border-t border-border/50">
                                      <p className="text-muted-foreground text-sm">
                                        <span className="font-medium">
                                          Completed:
                                        </span>{" "}
                                        {formatDate(
                                          case_.legalQualificationAnswers
                                            .completedAt
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex items-start ml-4">
                        {case_.status !== CaseStatus.COMPLETED &&
                          case_.status !== CaseStatus.NOTICE_GENERATED && (
                            <button
                              onClick={() => setShowDeleteConfirm(case_.id)}
                              className="flex items-center justify-center w-8 h-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
                              title="Delete case"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-muted-foreground text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full mx-4 border border-border">
            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-destructive"
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
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
              Delete Case
            </h3>
            <p className="text-muted-foreground mb-6 text-center text-sm">
              Are you sure you want to delete this case? This action cannot be
              undone and all associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCase(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-200 font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
