import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/features/chat/components/app-sidebar";
import { ThemeProvider } from "next-themes";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Sudeshi AI Chat",
  description: "AI-powered multilingual chat assistant built with Sarvam AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main>
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
