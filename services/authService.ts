import { User } from '../stores';

const API_BASE = 'http://localhost:5000/api';

/**
 * API Response interfaces
 */
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface LoginResponse {
    user: User;
    // No token in response - it's set as httpOnly cookie
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    acceptedTerms: boolean;
}

interface LoginData {
    email: string;
    password: string;
}

interface UpdateProfileData {
    name?: string;
    email?: string;
    company?: string;
    address?: string;
    phone?: string;
    bankName?: string;
    iban?: string;
    bic?: string;
    lawFirm?: string;
}

/**
 * API Service for authentication with secure cookie handling
 */
export class AuthService {
    /**
     * Make authenticated API request with credentials (cookies)
     */
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE}${endpoint}`;

        const response = await fetch(url, {
            credentials: 'include', // IMPORTANT: Include cookies in requests
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    }

    /**
     * Register new user
     */
    static async register(userData: RegisterData): Promise<ApiResponse<User>> {
        return this.request<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    /**
     * Login user - token is set as httpOnly cookie by server
     */
    static async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    /**
     * Logout user - server clears the httpOnly cookie
     */
    static async logout(): Promise<ApiResponse<{}>> {
        return this.request<{}>('/auth/logout', {
            method: 'POST',
        });
    }

    /**
     * Get user profile (token automatically included via cookies)
     */
    static async getProfile(): Promise<ApiResponse<User>> {
        return this.request<User>('/auth/profile');
    }

    /**
     * Update user profile
     */
    static async updateProfile(profileData: UpdateProfileData): Promise<ApiResponse<User>> {
        return this.request<User>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    /**
     * Check if user is authenticated (useful for app initialization)
     */
    static async checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
        try {
            const response = await this.getProfile();
            return {
                isAuthenticated: true,
                user: response.data
            };
        } catch (error) {
            return {
                isAuthenticated: false
            };
        }
    }
}