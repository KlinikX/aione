import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const otpFormSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters" }),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpVerificationProps {
  onVerify: (otp: string) => Promise<void>;
  onBack?: () => void;
  className?: string;
  isSubmitting?: boolean;
  skipOtp?: boolean; // <--- new prop to skip OTP
}

export default function OtpVerification({
  onVerify,
  onBack,
  className,
  isSubmitting = false,
  skipOtp = false,
}: OtpVerificationProps) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Automatically skip OTP if skipOtp is true
  useEffect(() => {
    if (skipOtp) {
      const dummyOtp = "000000";
      form.setValue("otp", dummyOtp);
      onVerify(dummyOtp);
    }
  }, [skipOtp, form, onVerify]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(0, 1);
    setOtpValues(newOtpValues);

    const otpString = newOtpValues.join("");
    form.setValue("otp", otpString);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").substring(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtpValues = [...otpValues];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtpValues[i] = pastedData[i];
    }

    setOtpValues(newOtpValues);
    form.setValue("otp", newOtpValues.join(""));

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (values: OtpFormValues) => {
    await onVerify(values.otp);
  };

  // If skipping OTP, do not render inputs
  if (skipOtp) return null;

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <div className="flex gap-2 justify-between">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        type="text"
                        value={otpValues[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-12 text-center text-xl p-0"
                        maxLength={1}
                        ref={setInputRef(index)}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Verify OTP
          </Button>
          {onBack && (
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={onBack}
            >
              Back
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
