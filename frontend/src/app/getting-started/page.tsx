"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme-toggle";

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-700">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="absolute top-12 right-12 sm:top-6 sm:right-12">
            <ThemeToggle />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl" />
              <svg
                className="w-32 h-32 sm:w-40 sm:h-40 mx-auto relative"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="96" height="96" rx="20" fill="#7B61FF" />
                <path
                  d="M48 28C41.3726 28 36 33.3726 36 40C36 46.6274 41.3726 52 48 52C54.6274 52 60 46.6274 60 40C60 33.3726 54.6274 28 48 28ZM48 50C43.0294 50 39 45.9706 39 41C39 36.0294 43.0294 32 48 32C52.9706 32 57 36.0294 57 41C57 45.9706 52.9706 50 48 50Z"
                  fill="#fff"
                />
                <rect
                  x="28"
                  y="60"
                  width="40"
                  height="8"
                  rx="4"
                  fill="#fff"
                  fillOpacity="0.8"
                />
              </svg>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Welcome to LinkedIn AI!
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
          >
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur shadow-lg">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                AI-Driven Healthcare Content
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Generate insightful, compliant LinkedIn posts for healthcare
                professionals—instantly.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur shadow-lg">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Personalized & Effortless
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get tailored, algorithm-optimized content with just a few
                clicks. No writing skills required!
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center space-y-8"
          >
            <p className="text-lg text-gray-600 dark:text-gray-200 max-w-xl mx-auto">
              Set up your profile and preferences to unlock the power of
              AI-driven healthcare LinkedIn posts.
              <br />
              Start sharing valuable, professional content with your network in
              minutes!
            </p>

            <Link href="/dashboard" className="inline-block">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600"
              >
                Get Started →
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
