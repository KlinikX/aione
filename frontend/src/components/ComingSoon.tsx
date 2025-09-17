import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const ComingSoon = ({
  title = "Coming Soon!",
  description = "This section is under development. Check back soon for new features!",
  showButton = true,
  buttonText = "Back to Dashboard",
  buttonHref = "/dashboard",
}: {
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonHref?: string;
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 bg-white text-gray-900 dark:bg-[#18181b] dark:text-gray-100 transition-colors">
      <div className="mb-6">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-6 shadow-lg">
          <Clock className="h-12 w-12 text-white" />
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
        {description}
      </p>
      {showButton && (
        <Link href={buttonHref}>
          <Button className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg rounded-full dark:from-indigo-600 dark:to-purple-700 dark:text-white">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};
