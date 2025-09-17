"use client";

import { ComponentProps } from "react";
import {
  Sparkles,
  SquareTerminal,
  CalendarCheck,
  CreditCard,
  Settings2,
  Bookmark,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "./ThemeToggle";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
  SidebarTrigger,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  dashboard,
  generatePost,
  schedulePost,
  billing,
  settings,
  savedPosts,
} from "@/constant/routes";

// Sidebar items
const data = [
  { title: "Dashboard", url: dashboard, icon: SquareTerminal },
  { title: "Generate Post", url: generatePost, icon: Sparkles },
  { title: "Saved Posts", url: savedPosts, icon: Bookmark },
  { title: "Schedule", url: schedulePost, icon: CalendarCheck },
  { title: "Billings", url: billing, icon: CreditCard },
  { title: "Settings", url: settings, icon: Settings2 },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <>
      {/* Mobile: Always show a hamburger trigger so it's never lost after refresh */}
      <SidebarTrigger
        className="sidebar-trigger fixed top-2 left-4 z-[80] h-10 w-10 rounded-lg
                   border border-white/20 text-white
                   hover:bg-sidebar-primary hover:text-sidebar-primary-foreground
                   flex items-center justify-center md:hidden"
      />

      {/* Desktop: show trigger only when sidebar is collapsed */}
      {!open && (
        <SidebarTrigger
          className="sidebar-trigger fixed top-2 left-14 z-[70] h-10 w-10 rounded-lg
                     border border-white/20 text-white
                     hover:bg-sidebar-primary hover:text-sidebar-primary-foreground
                     hidden md:flex items-center justify-center"
        />
      )}

      {/* Sidebar */}
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Linked AI</span>
                <span className="truncate text-xs">Pro</span>
              </div>
            </SidebarMenuButton>

            {/* Inside toggle & theme toggle only when open */}
            {open && (
              <div className="flex items-center gap-2">
                <ThemeToggle variant="sidebar" />
                <SidebarTrigger className="sidebar-trigger h-8 w-8" />
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  );
}
