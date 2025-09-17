"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { authentication } from "@/constant/routes";
import { useAuthCheck } from "@/hooks/use-authCheck";
import dynamic from "next/dynamic";
import { useOnboardingGate } from "@/hooks/use-onboardingGate";

const AuthLoader = dynamic(
  () => import("@/components/authentication/AuthLoader"), {
  ssr: false,
  loading: () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"/>
  ),
}
);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthCheck();
  const { checking: checkingOnboarding } = useOnboardingGate();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(authentication);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || checkingOnboarding) {
    return <AuthLoader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 pt-0">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
