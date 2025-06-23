"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isRoot = item.url === "/dashboard";
            const isActive = isRoot
              ? pathname === item.url // Match exato para /dashboard
              : pathname.startsWith(item.url); // Match parcial para subrotas

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={clsx(
                    "flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                  )}
                >
                  <Link href={item.url}>
                    <>
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.title}</span>
                    </>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
