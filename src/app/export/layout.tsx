import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export Icon Bundle',
  description: 'Export your logo as platform-ready icon bundles for iOS, Android, and Web. Get all required sizes in one download.',
  openGraph: {
    title: 'Export Icon Bundle | LogoForge',
    description: 'Export your logo as platform-ready icon bundles for iOS, Android, and Web.',
  },
  twitter: {
    title: 'Export Icon Bundle | LogoForge',
    description: 'Export your logo as platform-ready icon bundles for iOS, Android, and Web.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
