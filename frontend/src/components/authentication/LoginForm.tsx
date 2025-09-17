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
import { login } from "@/constant/endpoint";
import { PasswordInput } from "@/components/ui/password-input";
import { hasCompletedOnboarding } from "@/utils/onboarding";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string({
      required_error: "Password is required!",
    })
    .min(1, {
      message: "Password is required",
    }),
});

const LoginForm = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await apiInstance.post(
        login,
        {
          email: values.email,
          password: values.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      // Store token in cookies
      if (data.bearer_token) {
        setToken(data.bearer_token);
      }

      toast({
        title: "Success",
        description: data.message || "Login successful",
      });

      setIsLoading(false);
      
      // Check if user has completed onboarding before redirecting
      if (hasCompletedOnboarding()) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          const errorMessage = data.detail?.[0]?.msg || "Invalid credentials";
          toast({
            title: "Warning",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Warning",
            description: data.detail || "Invalid email or password",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Warning",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-4", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your email address"
                    {...field}
                  />
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
                  <PasswordInput
                    placeholder="Enter your Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
