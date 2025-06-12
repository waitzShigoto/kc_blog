import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import GoogleAdSense from '@/components/ads/GoogleAdSense';
import { siteConfig } from '@/lib/config';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KC Blog",
  description: "開發技術分享",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
        {siteConfig.analytics?.googleAnalyticsId && (
          <GoogleAnalytics gaId={siteConfig.analytics.googleAnalyticsId} />
        )}
        <GoogleAdSense />
      </body>
    </html>
  );
}
