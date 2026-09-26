import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './features/chat/components/Providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sudeshi-ai-chat.vercel.app'),

  title: {
    default: 'Sudeshi AI Chat — AI Assistant for Indian Languages',
    template: '%s | Sudeshi AI Chat',
  },

  description:
    'Sudeshi is a multilingual AI chat assistant for Indian languages. Chat, learn, translate, write, and explore with AI in the languages you use every day.',

  applicationName: 'Sudeshi AI Chat',

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://sudeshi-ai-chat.vercel.app/',
  },

  openGraph: {
    type: 'website',
    url: 'https://sudeshi-ai-chat.vercel.app/',
    siteName: 'Sudeshi AI Chat',
    title: 'Sudeshi AI Chat — AI Assistant for Indian Languages',
    description:
      'A multilingual AI chat assistant built for natural conversations across Indian languages.',
    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sudeshi AI Chat — AI Assistant for Indian Languages',
    description:
      'A multilingual AI chat assistant built for natural conversations across Indian languages.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
