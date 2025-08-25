/**
 * Simplified Case Service
 * Handles API communication with the simplified backend
 * Focuses on protocol compliance data only
 */

// Types matching the simplified backend
export interface LegalQualificationAnswers {
    contractSituation: string;
    fulfillmentDate: string;
    invoiceWrittenDate: string;
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
    private baseUrl = 'http://localhost:5000/api/cases';

    /**
     * Create a new case
     */
    async createCase(title?: string): Promise<CaseData> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include httpOnly cookies
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            throw new Error('Failed to create case');
        }

        const result = await response.json();
        return result.data;
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

        const response = await fetch(`${this.baseUrl}?${params}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cases');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Get case by ID
     */
    async getCaseById(caseId: string): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch case');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Update legal qualification answers
     */
    async updateLegalQualification(
        caseId: string,
        answers: LegalQualificationAnswers
    ): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/legal-qualification`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(answers),
        });

        if (!response.ok) {
            throw new Error('Failed to update legal qualification');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Update digital signature status
     */
    async updateDigitalSignatureStatus(caseId: string, isCompleted: boolean): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/digital-signature`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ isCompleted }),
        });

        if (!response.ok) {
            throw new Error('Failed to update digital signature status');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Update client type
     */
    async updateClientType(caseId: string, clientType: 'company' | 'private'): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/client-type`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ clientType }),
        });

        if (!response.ok) {
            throw new Error('Failed to update client type');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Update payment notice status
     */
    async updatePaymentNoticeStatus(caseId: string, isGenerated: boolean): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/payment-notice`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ isGenerated }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment notice status');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Complete a case
     */
    async completeCase(caseId: string): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/complete`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to complete case');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Cancel a case
     */
    async cancelCase(caseId: string): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/${caseId}/cancel`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to cancel case');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Delete a case
     */
    async deleteCase(caseId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${caseId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete case');
        }
    }

    /**
     * Get case statistics for dashboard
     */
    async getCaseStatistics(): Promise<CaseStatistics> {
        const response = await fetch(`${this.baseUrl}/statistics`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch case statistics');
        }

        const result = await response.json();
        return result.data;
    }
}

export const caseService = new CaseService();
export default caseService;