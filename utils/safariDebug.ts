/**
 * Safari Authentication Debug Utility
 * Use this in browser console to diagnose authentication issues
 */

import { AuthService } from '../services/authService';

declare global {
    interface Window {
        debugSafariAuth: () => Promise<void>;
        testAuthFlow: () => Promise<void>;
    }
}

// Safari authentication debugger
window.debugSafariAuth = async () => {
    console.log('🔍 Starting Safari Authentication Debug...');

    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    console.log('Browser Info:', {
        isSafari,
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        domain: window.location.hostname,
        protocol: window.location.protocol,
        origin: window.location.origin
    });

    if (isSafari) {
        console.log('🦋 Safari detected - running Safari-specific tests...');

        try {
            const testResult = await AuthService.testSafariAuth();
            console.log('Safari Auth Test Result:', testResult);

            if (!testResult.success) {
                console.log('❌ Safari authentication issues detected:');
                console.log('Possible solutions:');
                console.log('1. Check if third-party cookies are enabled');
                console.log('2. Verify the API URL is correct');
                console.log('3. Check if running in private browsing mode');
                console.log('4. Ensure the backend is properly setting cookies');
            } else {
                console.log('✅ Safari authentication working correctly!');
            }
        } catch (error) {
            console.error('Error during Safari test:', error);
        }
    } else {
        console.log('Not Safari browser - running general auth check...');

        try {
            const authCheck = await AuthService.checkAuth();
            console.log('Auth Check Result:', authCheck);
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }
};

// Test complete authentication flow
window.testAuthFlow = async () => {
    console.log('🧪 Testing complete authentication flow...');

    try {
        // Test profile access
        console.log('Testing profile access...');
        const profileResponse = await AuthService.getProfile();
        console.log('✅ Profile access successful:', profileResponse);

    } catch (error) {
        console.log('❌ Profile access failed:', error);

        // Show debugging info
        const compatInfo = AuthService.getBrowserCompatibilityInfo();
        console.log('Browser Compatibility Info:', compatInfo);

        if (compatInfo.isSafari) {
            console.log('Safari-specific troubleshooting:');
            console.log('1. Disable "Prevent cross-site tracking" in Safari preferences');
            console.log('2. Check if "Block all cookies" is disabled');
            console.log('3. Try clearing Safari cookies and cache');
            console.log('4. Ensure you\'re not in private browsing mode');
        }
    }
};

console.log('🛠️ Safari debug utilities loaded!');
console.log('Use window.debugSafariAuth() to test Safari authentication');
console.log('Use window.testAuthFlow() to test complete auth flow');