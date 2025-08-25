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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-red-600"
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
            <div>
              <p className="text-sm font-medium text-red-800">
                Unable to load statistics
              </p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Cases</p>
            <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
            <p className="text-xs text-gray-500 mt-1">All time processing</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
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

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Recent Activity</p>
            <p className="text-2xl font-bold text-gray-900">{recentActivity}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
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

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {completedCases} of {totalCases} completed
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {(statistics?.byStatus[CaseStatus.DRAFT] || 0) +
                (statistics?.byStatus[CaseStatus.QUALIFICATION_COMPLETE] || 0) +
                (statistics?.byStatus[CaseStatus.SIGNATURE_COMPLETE] || 0) +
                (statistics?.byStatus[CaseStatus.CLIENT_TYPE_SELECTED] || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active workflows</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-600"
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
