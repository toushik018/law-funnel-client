import { User } from '../stores';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
     * Enhanced with debugging and error handling for cookie issues
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
            // Enhanced error logging for authentication issues
            if (response.status === 401) {
                console.error('Authentication Error Details:', {
                    status: response.status,
                    message: data.message,
                    url,
                    userAgent: navigator.userAgent,
                    cookiesEnabled: navigator.cookieEnabled,
                    // Log browser info for debugging
                    browserInfo: {
                        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
                        isChrome: /Chrome/.test(navigator.userAgent),
                        isFirefox: /Firefox/.test(navigator.userAgent),
                        platform: navigator.platform
                    }
                });
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
     * Enhanced with cookie debugging
     */
    static async checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
        try {
            // Debug cookie information
            const cookieDebugInfo = {
                userAgent: navigator.userAgent,
                cookiesEnabled: navigator.cookieEnabled,
                currentDomain: window.location.hostname,
                protocol: window.location.protocol,
                // Check if we can access document.cookie (should be empty for httpOnly)
                documentCookie: document.cookie ? 'present' : 'empty'
            };

            console.log('Auth Check Debug Info:', cookieDebugInfo);

            const response = await this.getProfile();
            return {
                isAuthenticated: true,
                user: response.data
            };
        } catch (error) {
            console.log('Authentication check failed:', error);
            return {
                isAuthenticated: false
            };
        }
    }

    /**
     * Debug utility to check browser compatibility
     */
    static getBrowserCompatibilityInfo() {
        const ua = navigator.userAgent;
        return {
            isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
            isChrome: /Chrome/.test(ua),
            isFirefox: /Firefox/.test(ua),
            isMacOS: /Mac OS X/.test(ua),
            cookiesEnabled: navigator.cookieEnabled,
            platform: navigator.platform,
            userAgent: ua,
            secureContext: location.protocol === 'https:',
            thirdPartyCookiesBlocked: this.checkThirdPartyCookies()
        };
    }

    /**
     * Check if third-party cookies are blocked
     */
    private static checkThirdPartyCookies(): boolean {
        try {
            // Simple check - this is not 100% accurate but gives us an indication
            document.cookie = 'test-cookie=test; SameSite=None; Secure';
            const hasTestCookie = document.cookie.includes('test-cookie=test');
            // Clean up
            document.cookie = 'test-cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            return !hasTestCookie;
        } catch (e) {
            return true; // Assume blocked if we can't test
        }
    }
}