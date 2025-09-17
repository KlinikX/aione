"use client";

import { useEffect, useState } from "react";
import { apiInstance } from "@/services";
import { getUserProfile } from "@/constant/endpoint";
import { useRouter } from "next/navigation";
import { hasCompletedOnboarding, markOnboardingComplete } from "@/utils/onboarding";

const REQUIRED_KEYS = [
  "full_name",
  "current_position",
  "industry_specialty",
  "years_experience",
  "location",
  "company_name",
  "company_size",
  "communication_style",
  "writing_style",
  "posting_frequency",
  "preferred_post_length",
  "post_language",
];

export function useOnboardingGate() {
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // First check localStorage flag
        if (hasCompletedOnboarding()) {
          console.log('Onboarding already completed (localStorage), skipping API check');
          setNeedsOnboarding(false);
          setChecking(false);
          return;
        }

        // Only make API call if localStorage flag is not set
        console.log('Checking onboarding status via API...');
        const { data } = await apiInstance.get(getUserProfile);
        const missing = REQUIRED_KEYS.some((k) => !data || !String(data[k] ?? "").trim());
        
        if (!missing) {
          // Profile is complete, mark onboarding as done
          markOnboardingComplete();
          console.log('Profile complete, marking onboarding as done');
        }
        
        setNeedsOnboarding(missing);
      } catch (error) {
        console.log('Profile not found, needs onboarding');
        // If profile not found yet, send to onboarding
        setNeedsOnboarding(true);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!checking && needsOnboarding) {
      console.log('Redirecting to onboarding...');
      router.replace("/onboarding");
    }
  }, [checking, needsOnboarding, router]);

  return { checking, needsOnboarding };
}
