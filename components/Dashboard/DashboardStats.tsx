import React, { useEffect } from "react";
import useCaseStore from "../../stores/caseStore";
import { CaseStatus } from "../../services/caseService";

export default function DashboardStats() {
  const { statistics, loadStatistics, loading, error } = useCaseStore();

  // Load statistics when component mounts
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Calculate derived statistics
  const totalCases = statistics?.total || 0;
  const recentActivity = statistics?.recentActivity || 0;
  const completedCases = statistics?.byStatus[CaseStatus.COMPLETED] || 0;
  const successRate =
    totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-100 animate-pulse"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="h-3 md:h-4 bg-gray-200 rounded w-12 md:w-20 mb-1 md:mb-2"></div>
                <div className="h-5 md:h-8 bg-gray-200 rounded w-8 md:w-12"></div>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-md md:rounded-xl mt-2 md:mt-0 self-end md:self-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="col-span-2 lg:col-span-4 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
          <div className="flex items-start space-x-2">
            <svg
              className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
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
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-medium text-red-800 leading-tight">
                Fehler beim Laden
              </p>
              <p className="text-xs text-red-600 mt-0.5 break-words">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
              Gesamt
            </p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
              {totalCases}
            </p>
            <p className="text-xs text-gray-500 leading-tight hidden md:block">
              Gesamte Bearbeitung
            </p>
          </div>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-md md:rounded-xl flex items-center justify-center mt-2 md:mt-0 self-end md:self-auto flex-shrink-0">
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-blue-600"
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
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
              Letzte 30T
            </p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
              {recentActivity}
            </p>
            <p className="text-xs text-gray-500 leading-tight hidden md:block">
              Letzte 30 Tage
            </p>
          </div>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-md md:rounded-xl flex items-center justify-center mt-2 md:mt-0 self-end md:self-auto flex-shrink-0">
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
              Erfolg
            </p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
              {successRate}%
            </p>
            <p className="text-xs text-gray-500 leading-tight hidden md:block">
              {completedCases} von {totalCases} abgeschlossen
            </p>
          </div>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-md md:rounded-xl flex items-center justify-center mt-2 md:mt-0 self-end md:self-auto flex-shrink-0">
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
              Aktiv
            </p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
              {(statistics?.byStatus[CaseStatus.DRAFT] || 0) +
                (statistics?.byStatus[CaseStatus.QUALIFICATION_COMPLETE] || 0) +
                (statistics?.byStatus[CaseStatus.SIGNATURE_COMPLETE] || 0) +
                (statistics?.byStatus[CaseStatus.CLIENT_TYPE_SELECTED] || 0)}
            </p>
            <p className="text-xs text-gray-500 leading-tight hidden md:block">
              Aktive Workflows
            </p>
          </div>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-md md:rounded-xl flex items-center justify-center mt-2 md:mt-0 self-end md:self-auto flex-shrink-0">
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
