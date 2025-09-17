"use client"

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    customElement?: React.ReactNode
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title}>
            {item.customElement ? (
              <SidebarMenuItem className="py-3 px-4 text-lg">
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className="flex items-center gap-3"
                  isActive={pathname === item.url}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="mr-auto">{item.title}</span>
                  {item.customElement}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <Link href={item.url}>
                <SidebarMenuItem className="py-1 text-lg">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="flex items-center gap-3"
                    isActive={pathname === item.url}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
