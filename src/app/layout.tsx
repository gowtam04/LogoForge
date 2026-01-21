import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "@/theme/ThemeRegistry";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogoForge - AI Logo Generator",
  description: "From idea to App Store-ready icons in under 5 minutes. Generate professional logos with AI and export ready-to-use icon bundles for iOS, Android, and Web.",
  keywords: ["logo generator", "AI logo", "app icons", "favicon generator", "iOS icons", "Android icons"],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <ErrorBoundaryWrapper>
            {children}
          </ErrorBoundaryWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
