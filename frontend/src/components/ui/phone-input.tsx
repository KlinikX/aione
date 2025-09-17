"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./country-select";
import { Input } from "./input";
import { motion } from "framer-motion";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  className?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ countryCode, onCountryCodeChange, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="relative">
        <motion.div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-background px-3 py-2",
            isFocused && "ring-2 ring-ring ring-offset-2",
            className
          )}
          initial={false}
          animate={{
            borderColor: isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
          }}
          transition={{ duration: 0.2 }}
        >
          <CountrySelect
            value={countryCode}
            onChange={onCountryCodeChange}
            className="w-[120px]"
          />
          <div className="h-6 w-px bg-border" />
          <Input
            ref={ref}
            type="tel"
            className="border-0 bg-transparent pl-2 focus-visible:ring-0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </motion.div>
        <motion.div
          className="absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground"
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0,
            y: isFocused ? 0 : 10,
          }}
          transition={{ duration: 0.2 }}
        >
          Phone Number
        </motion.div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput }; 