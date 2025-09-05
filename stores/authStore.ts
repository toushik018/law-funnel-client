import { create } from 'zustand';

/**
 * User interface
 */
export interface User {
    id: string;
    name: string;
    email: string;

    // Profile completion tracking
    profileCompleted?: boolean;

    // Company Information
    company?: string;

    // Contact Information
    address?: string;
    phone?: string;

    // Banking Information
    bankName?: string;
    iban?: string;
    bic?: string;

    // Legal Information
    lawFirm?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Auth Store Interface
 */
interface AuthStore {
    // Auth state
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitializing: boolean; // For initial auth check on app startup

    // Actions
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setInitializing: (initializing: boolean) => void;
    setUser: (user: User | null) => void;

    // API helpers
    getAuthHeaders: () => Record<string, string>;
}

/**
 * Auth Store - NO localStorage/sessionStorage
 * Tokens are stored in secure httpOnly cookies by the server
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true, // Start as true, will be set to false after initial auth check

    // Actions
    login: (user: User) => {
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitializing: false
        });
    },

    logout: () => {
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitializing: false
        });
    },

    setLoading: (isLoading: boolean) => {
        set({ isLoading });
    },

    setInitializing: (isInitializing: boolean) => {
        set({ isInitializing });
    },

    setUser: (user: User | null) => {
        set({
            user,
            isAuthenticated: !!user,
            isInitializing: false
        });
    },

    // Helper to get auth headers for API calls
    getAuthHeaders: () => {
        // No need for manual headers - token is automatically added by AuthService
        return {
            'Content-Type': 'application/json',
        };
    },
}));