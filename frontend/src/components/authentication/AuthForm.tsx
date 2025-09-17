"use client";

import { Button } from "@/components/ui/button";
import { generatePost } from "@/constant/routes";
import { useAuthCheck } from "@/hooks/use-authCheck";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";
import SignupForm from "./SignupForm";
import { Loader } from "@/components/Loader";

const Authform = () => {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const router = useRouter();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthCheck();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(generatePost);
    }
  }, [isAuthenticated, router]);

  if (isAuthLoading) {
    return <Loader />;
  }

  const handleResetSuccess = () => {
    setMode("login");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to login to your account"
            : "Enter your details below to create an account"}
        </p>
      </div>
      {mode === "login" && (
        <>
          <LoginForm />
          <div className="text-center flex justify-between">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("signup")}
            >
              Need an Account? Sign Up
            </Button>
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("reset")}
            >
              Forget Password?
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <SignupForm />
          <div className="text-center ">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Already have an Account? Login
            </Button>
          </div>
          <p className="px-0 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </>
      )}
      {mode === "reset" && (
        <>
          <ResetPassword onSuccess={handleResetSuccess} />
          <div className="text-center ">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Authform;
