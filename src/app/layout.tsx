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

const siteUrl = "https://logoforge.gowtam.ai";
const siteName = "LogoForge";
const siteDescription = "From idea to App Store-ready icons in under 5 minutes. Generate professional logos with AI and export ready-to-use icon bundles for iOS, Android, and Web.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LogoForge - AI Logo Generator",
    template: "%s | LogoForge",
  },
  description: siteDescription,
  keywords: [
    "logo generator",
    "AI logo",
    "app icons",
    "favicon generator",
    "iOS icons",
    "Android icons",
    "free logo maker",
    "logo design AI",
    "app icon generator",
    "PWA icons",
    "icon bundle generator",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: 'LogoForge - AI Logo Generator',
    description: siteDescription,
    // Images are auto-generated from opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogoForge - AI Logo Generator',
    description: siteDescription,
    // Images are auto-generated from twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'AI-powered logo generation',
        'Multiple logo styles',
        'iOS icon bundle export',
        'Android icon bundle export',
        'Web favicon and PWA icon export',
        'Reference image upload',
        'AI interview for guided creation',
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/apple-touch-icon.png`,
    },
    {
      '@type': 'HowTo',
      '@id': `${siteUrl}/#howto`,
      name: 'How to create a logo with LogoForge',
      description: 'Create professional logos in three simple steps',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Describe',
          text: 'Tell us about your brand and style preferences. Upload references if you have them.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Generate',
          text: 'AI creates 4 unique logo variations tailored to your vision in seconds.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Export',
          text: 'Download complete icon bundles ready for iOS, Android, and Web.',
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
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
