import { User } from '../stores';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

/**
 * Token Storage Utilities
 * Simple and reliable localStorage-based token management
 */
class TokenStorage {
    static setToken(token: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000): void {
        const expiryTime = Date.now() + expiresIn;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        console.log('🔑 Token stored in localStorage');
    }

    static getToken(): string | null {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

        if (!token || !expiry) {
            return null;
        }

        // Check if token is expired
        if (Date.now() > parseInt(expiry)) {
            console.log('🕐 Token expired, clearing storage');
            this.clearToken();
            return null;
        }

        return token;
    }

    static clearToken(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        console.log('🗑️ Token cleared from localStorage');
    }

    static hasValidToken(): boolean {
        return this.getToken() !== null;
    }
}

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
    token: string; // Now includes token in response
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
     * Make authenticated API request with token from localStorage
     */
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE}${endpoint}`;
        const token = TokenStorage.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add Authorization header if token exists
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            // Enhanced error logging for authentication issues
            if (response.status === 401) {
                console.error('Authentication Error Details:', {
                    status: response.status,
                    message: data.message,
                    url,
                    hasToken: !!token,
                    userAgent: navigator.userAgent,
                });

                // Clear invalid token
                TokenStorage.clearToken();
            }
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
     * Login user - token is stored in localStorage
     */
    static async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
        const response = await this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Store the token in localStorage
        if (response.data.token) {
            TokenStorage.setToken(response.data.token);
        }

        return response;
    }

    /**
     * Logout user - clear token from localStorage
     */
    static async logout(): Promise<void> {
        try {
            // Call server logout endpoint (optional, for server-side cleanup)
            await this.request('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            // Even if server call fails, clear local token
            console.log('Server logout failed, but continuing with local cleanup:', error);
        } finally {
            // Always clear local token
            TokenStorage.clearToken();
        }
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
     * Check if user is authenticated - simple and reliable
     */
    static async checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
        try {
            // Check if we have a valid token
            if (!TokenStorage.hasValidToken()) {
                console.log('🔴 No valid token found in localStorage');
                return { isAuthenticated: false };
            }

            console.log('🔑 Valid token found, checking with server...');

            // Verify token with server and get user data
            const response = await this.getProfile();
            console.log('✅ Authentication successful');

            return {
                isAuthenticated: true,
                user: response.data
            };
        } catch (error) {
            console.log('❌ Authentication check failed:', error instanceof Error ? error.message : 'Unknown error');

            // Clear invalid token
            TokenStorage.clearToken();

            return {
                isAuthenticated: false
            };
        }
    }

    /**
     * Get browser compatibility info (simplified)
     */
    static getBrowserCompatibilityInfo() {
        const ua = navigator.userAgent;
        return {
            isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
            isChrome: /Chrome/.test(ua),
            isFirefox: /Firefox/.test(ua),
            platform: navigator.platform,
            userAgent: ua
        };
    }

    /**
     * Get basic browser info for debugging
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        return {
            isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
            isChrome: /Chrome/.test(ua),
            isFirefox: /Firefox/.test(ua),
            platform: navigator.platform,
            userAgent: ua
        };
    }
}