// components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import AppSidebar from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { memo } from "react"

const ProvidersComponent = function ({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

ProvidersComponent.displayName = "Providers";

export const Providers = memo(ProvidersComponent);