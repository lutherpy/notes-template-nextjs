"use client";

import * as React from "react";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { data } from "./nav-main-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Image src="/cmc_logo.png" alt="Logo" width={30} height={30} />
                <span className="text-base font-semibold">Modelo DSA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Aqui você pode passar o pathname para o componente de navegação */}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name || "Unknown User",
            email: session?.user?.email || "unknown@email.com",
            avatar: session?.user?.image || "0",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
