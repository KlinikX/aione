"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { forgotPassword, resetPassword, verifyOtp } from "@/constant/endpoint";
import { cn } from "@/lib/utils";
import { apiInstance } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OtpVerification from "./OtpVerification";
import ChangePassword from "./ChangePassword";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword: React.FC<{
  className?: string;
  onSuccess?: () => void;
}> = ({ className, onSuccess }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<"email" | "otp" | "changePassword">("email");
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChangePasswordSubmitting, setIsChangePasswordSubmitting] =
    useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const response = await apiInstance.post(
        forgotPassword,
        `"${values.email}"`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setEmail(values.email);
      setStep("otp");

      toast({
        title: "Success",
        description: data.message || "OTP sent to your email",
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setIsOtpSubmitting(true);
    try {
      await apiInstance.post(
        verifyOtp,
        { otp, email, purpose: "reset_password" },
        { headers: { "Content-Type": "application/json" } }
      );
      setStep("changePassword");
    } catch (error) {
      console.error("Error in OTP verification:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    setIsChangePasswordSubmitting(true);
    try {
      const resetResponse = await apiInstance.post(
        resetPassword,
        { email, new_password: newPassword },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = resetResponse.data;

      toast({
        title: "Success",
        description: data.message || "Password reset successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in password reset:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangePasswordSubmitting(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      {step === "email" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Send OTP
            </Button>
          </form>
        </Form>
      )}

      {step === "otp" && (
        <OtpVerification
          onVerify={handleOtpVerify}
          onBack={() => setStep("email")}
          className={className}
          isSubmitting={isOtpSubmitting}
        />
      )}

      {step === "changePassword" && (
        <ChangePassword
          onSubmit={handlePasswordChange}
          onBack={() => setStep("otp")}
          className={className}
          isSubmitting={isChangePasswordSubmitting}
        />
      )}
    </div>
  );
};

export default ResetPassword;
