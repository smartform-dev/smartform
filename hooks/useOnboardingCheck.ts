"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";

type OnboardingStatus = "loading" | "onboarded" | "needs_company";

export function useOnboardingCheck() {
  const { user } = useUser();
  const [status, setStatus] = useState<OnboardingStatus>("loading");

  const checkOnboardingStatus = useCallback(async () => {
    if (user) {
      setStatus("loading");
      try {
        // 1. Check if user exists in our DB
        const userResponse = await fetch(`/api/users?external_id=${user.id}`);
        if (userResponse.status === 404) {
          // Create user if not found
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              external_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              first_name: user.firstName,
              last_name: user.lastName,
              image_url: user.imageUrl,
            }),
          });
        }

        // 2. Check if the user has a company
        const companyResponse = await fetch(`/api/company`);
        if (companyResponse.status === 404) {
          setStatus("needs_company");
        } else {
          setStatus("onboarded");
        }
      } catch (error) {
        console.error("Error during onboarding check:", error);
        setStatus("onboarded"); // Default to onboarded to avoid blocking UI on error
      }
    }
  }, [user]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  return { status, recheck: checkOnboardingStatus };
}