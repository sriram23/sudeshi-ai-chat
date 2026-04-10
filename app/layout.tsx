import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./features/chat/components/Providers";

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
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
        <Providers>
              <main>
                {children}
              </main>
        </Providers>
      </body>
    </html>
  );
}
