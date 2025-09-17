'use client';
import { verifyToken } from "@/constant/endpoint";
import { useUser } from "@/context/UserProvider";
import { apiInstance } from "@/services";
import { getToken } from "@/utils/cookies";
import { useEffect, useState } from "react";

interface AuthCheckResult {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuthCheck(): AuthCheckResult {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setUserState } = useUser();

  useEffect(() => {
    const verifyAuthToken = async () => {
      try {
        const token = getToken();

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await apiInstance.get(verifyToken);

        const { data } = response;
        setIsAuthenticated(data.valid);
        setUserState({
          name: data.user.name,
          email: data.user.email,
          profilePicture: data.user.profile_picture,
        });
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthToken();
  }, []);

  return { isAuthenticated, isLoading };
}
