/**
 * Case Store using Zustand
 * Manages case state and provides actions for case operations
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import caseService, {
    CaseData,
    CaseStatus,
    CaseStatistics,
    LegalQualificationAnswers
} from '../services/caseService';

interface CaseStore {
    // State
    currentCase: CaseData | null;
    cases: CaseData[];
    statistics: CaseStatistics | null;
    loading: boolean;
    error: string | null;

    // Actions
    createCase: (title?: string) => Promise<CaseData>;
    loadCase: (caseId: string) => Promise<void>;
    loadUserCases: (page?: number, limit?: number, status?: CaseStatus) => Promise<void>;
    loadStatistics: () => Promise<void>;

    // Workflow actions
    updateLegalQualification: (answers: LegalQualificationAnswers) => Promise<void>;
    updateDigitalSignatureStatus: (isCompleted: boolean) => Promise<void>;
    updateClientType: (clientType: 'company' | 'private') => Promise<void>;
    updatePaymentNoticeStatus: (isGenerated: boolean) => Promise<void>;
    markLawyerSearch: () => Promise<void>;

    // Case management
    completeCase: () => Promise<void>;
    cancelCase: () => Promise<void>;
    deleteCase: (caseId: string) => Promise<void>;

    // Utility actions
    clearCurrentCase: () => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

export const useCaseStore = create<CaseStore>()(
    devtools(
        (set, get) => ({
            // Initial state
            currentCase: null,
            cases: [],
            statistics: null,
            loading: false,
            error: null,

            // Create a new case
            createCase: async (title?: string) => {
                set({ loading: true, error: null });
                try {
                    const newCase = await caseService.createCase(title);
                    set({ currentCase: newCase, loading: false });
                    return newCase;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to create case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Load a specific case
            loadCase: async (caseId: string) => {
                set({ loading: true, error: null });
                try {
                    const caseData = await caseService.getCaseById(caseId);
                    set({ currentCase: caseData, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to load case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Load user cases
            loadUserCases: async (page = 1, limit = 20, status?: CaseStatus) => {
                set({ loading: true, error: null });
                try {
                    const response = await caseService.getUserCases(page, limit, status);
                    set({ cases: response.cases, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to load cases';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Load statistics
            loadStatistics: async () => {
                set({ loading: true, error: null });
                try {
                    const statistics = await caseService.getCaseStatistics();
                    set({ statistics, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to load statistics';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update legal qualification answers
            updateLegalQualification: async (answers: LegalQualificationAnswers) => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to update');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.updateLegalQualification(currentCase.id, answers);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update legal qualification';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update digital signature status
            updateDigitalSignatureStatus: async (isCompleted: boolean) => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to update');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.updateDigitalSignatureStatus(currentCase.id, isCompleted);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update digital signature status';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update client type
            updateClientType: async (clientType: 'company' | 'private') => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to update');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.updateClientType(currentCase.id, clientType);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update client type';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update payment notice status
            updatePaymentNoticeStatus: async (isGenerated: boolean) => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to update');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.updatePaymentNoticeStatus(currentCase.id, isGenerated);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update payment notice status';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            markLawyerSearch: async () => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to update');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.markLawyerSearch(currentCase.id);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to submit case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Complete case
            completeCase: async () => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to complete');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.completeCase(currentCase.id);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to complete case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Cancel case
            cancelCase: async () => {
                const { currentCase } = get();
                if (!currentCase) {
                    throw new Error('No current case to cancel');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCase = await caseService.cancelCase(currentCase.id);
                    set({ currentCase: updatedCase, loading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Delete case
            deleteCase: async (caseId: string) => {
                set({ loading: true, error: null });
                try {
                    await caseService.deleteCase(caseId);
                    const { cases } = get();
                    set({
                        cases: cases.filter(c => c.id !== caseId),
                        loading: false,
                        currentCase: get().currentCase?.id === caseId ? null : get().currentCase
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete case';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Clear current case
            clearCurrentCase: () => {
                set({ currentCase: null });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Set loading
            setLoading: (loading: boolean) => {
                set({ loading });
            },
        }),
        {
            name: 'case-store', // Name for devtools
        }
    )
);

export default useCaseStore;