import { AuthService } from './authService';

/**
 * Simplified Case Service
 * Handles API communication with the simplified backend
 * Focuses on protocol compliance data only
 */

// Types matching the simplified backend
export interface LegalQualificationAnswers {
    contractSituation: string;
    invoiceSentDate: string;
}

export interface CaseData {
    id: string;
    userId: string;
    caseNumber: string;
    status: CaseStatus;
    title?: string;
    legalQualificationAnswers?: LegalQualificationAnswers & { completedAt: Date };
    isDigitalSignatureCompleted: boolean;
    clientType?: 'company' | 'private';
    isNoticeGenerated: boolean;
    workflowStartedAt: Date;
    lastUpdatedAt: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum CaseStatus {
    DRAFT = 'draft',
    QUALIFICATION_COMPLETE = 'qualification_complete',
    SIGNATURE_COMPLETE = 'signature_complete',
    CLIENT_TYPE_SELECTED = 'client_type_selected',
    NOTICE_GENERATED = 'notice_generated',
    LAWYER_SEARCH = 'lawyer_search',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface CaseStatistics {
    total: number;
    byStatus: Record<CaseStatus, number>;
    recentActivity: number;
}

export interface CasesResponse {
    cases: CaseData[];
    total: number;
    page: number;
    totalPages: number;
}

class CaseService {
    private baseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cases`;

    /**
     * Helper method to make authenticated API requests
     */
    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = localStorage.getItem('auth_token');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Create a new case
     */
    async createCase(title?: string): Promise<CaseData> {
        return this.makeRequest<CaseData>(this.baseUrl, {
            method: 'POST',
            body: JSON.stringify({ title }),
        });
    }

    /**
     * Get user cases with pagination
     */
    async getUserCases(page = 1, limit = 20, status?: CaseStatus): Promise<CasesResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) {
            params.set('status', status);
        }

        return this.makeRequest<CasesResponse>(`${this.baseUrl}?${params}`);
    }

    /**
     * Get case by ID
     */
    async getCaseById(caseId: string): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}`);
    }

    /**
     * Update legal qualification answers
     */
    async updateLegalQualification(
        caseId: string,
        answers: LegalQualificationAnswers
    ): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/legal-qualification`, {
            method: 'PUT',
            body: JSON.stringify(answers),
        });
    }

    /**
     * Update digital signature status
     */
    async updateDigitalSignatureStatus(caseId: string, isCompleted: boolean): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/digital-signature`, {
            method: 'PUT',
            body: JSON.stringify({ isCompleted }),
        });
    }

    /**
     * Update client type
     */
    async updateClientType(caseId: string, clientType: 'company' | 'private'): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/client-type`, {
            method: 'PUT',
            body: JSON.stringify({ clientType }),
        });
    }

    /**
     * Update payment notice status
     */
    async updatePaymentNoticeStatus(caseId: string, isGenerated: boolean): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/payment-notice`, {
            method: 'PUT',
            body: JSON.stringify({ isGenerated }),
        });
    }

    async markLawyerSearch(caseId: string): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/lawyer-search`, {
            method: 'PUT',
        });
    }

    /**
     * Complete a case
     */
    async completeCase(caseId: string): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/complete`, {
            method: 'PUT',
        });
    }

    /**
     * Cancel a case
     */
    async cancelCase(caseId: string): Promise<CaseData> {
        return this.makeRequest<CaseData>(`${this.baseUrl}/${caseId}/cancel`, {
            method: 'PUT',
        });
    }

    /**
     * Delete a case
     */
    async deleteCase(caseId: string): Promise<void> {
        await this.makeRequest<void>(`${this.baseUrl}/${caseId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Get case statistics for dashboard
     */
    async getCaseStatistics(): Promise<CaseStatistics> {
        return this.makeRequest<CaseStatistics>(`${this.baseUrl}/statistics`);
    }
}

export const caseService = new CaseService();
export default caseService;