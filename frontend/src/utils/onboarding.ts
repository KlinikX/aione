/**
 * Utility functions for managing onboarding state
 */

// Key for localStorage
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
};

/**
 * Mark onboarding as completed
 */
export const markOnboardingComplete = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
};

/**
 * Reset onboarding status (for testing or re-onboarding)
 */
export const resetOnboardingStatus = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
};

/**
 * Check if user should be redirected to onboarding
 */
export const shouldRedirectToOnboarding = (): boolean => {
  return !hasCompletedOnboarding();
};
