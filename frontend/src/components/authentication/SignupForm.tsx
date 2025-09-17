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
import { cn } from "@/lib/utils";
import { apiInstance } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setToken } from "@/utils/cookies";
import { generatePost } from "@/constant/routes";
import { signup } from "@/constant/endpoint";
import { PasswordInput } from "@/components/ui/password-input";
import { resetOnboardingStatus } from "@/utils/onboarding";

const passwordValidationRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const formSchema = z
  .object({
    full_name: z.string().min(3, {
      message: "Full name must be at least 3 characters long",
    }),
  email: z.string().trim().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string({
        required_error: "Password is required!",
      })
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(passwordValidationRegex, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    confirmPassword: z.string({
      required_error: "Confirm password is required!",
    }),
    countryCode: z
      .string({
        required_error: "Please select a country code",
      })
      .trim()
      .regex(/^\+[0-9]{1,3}$/, {
        message: "Enter a valid country code like +1, +44, +91",
      }),
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .trim()
      .min(8, { message: "Phone number must be at least 8 digits" })
      .max(15, { message: "Phone number cannot exceed 15 digits" })
      .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // Validate combined E.164 total length (country code + national number) is 8-15 digits
    const ccDigits = data.countryCode.replace(/\D/g, "");
    const numDigits = data.phoneNumber.replace(/\D/g, "");
    const total = ccDigits.length + numDigits.length;
    return total >= 8 && total <= 15;
  }, {
    message: "Phone with country code must be 8–15 digits in total",
    path: ["phoneNumber"],
  });

const SignupForm = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      confirmPassword: "",
      countryCode: "+91",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await apiInstance.post(
        signup,
        {
          name: values.full_name,
          email: values.email,
          password: values.password,
          mobile: `${values.countryCode} ${values.phoneNumber}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.bearer_token) {
        setToken(response.data.bearer_token);
      }

      // Clear any existing onboarding flag for new users
      resetOnboardingStatus();

      toast({
        title: "Success",
        description: "User registered successfully!",
      });

      // Redirect new users to onboarding instead of generate-post
      router.push("/onboarding");
    } catch (err) {
      console.error(err);

      const error = err as any;

      const errorMessage =
        error.response?.data?.detail || // Common backend key
        error.response?.data?.error ||   // Sometimes named `error`
        "An unexpected error occurred";  // Fallback

      toast({
        title: "Warning",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-4 max-h-[calc(100vh-2rem)] overflow-hidden", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1"
                      {...field}
                      className="text-center"
                      inputMode="numeric"
                      pattern="^\+[0-9]{1,3}$"
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="1234567890"
                      {...field}
                      inputMode="numeric"
                      pattern="^[0-9]{8,15}$"
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
