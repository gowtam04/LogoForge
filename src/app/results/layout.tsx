import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Generated Logos',
  description: 'View and select from your AI-generated logo variations. Choose the perfect design and export it for iOS, Android, and Web platforms.',
  openGraph: {
    title: 'Your Generated Logos | LogoForge',
    description: 'View and select from your AI-generated logo variations. Choose the perfect design for your brand.',
  },
  twitter: {
    title: 'Your Generated Logos | LogoForge',
    description: 'View and select from your AI-generated logo variations. Choose the perfect design for your brand.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
