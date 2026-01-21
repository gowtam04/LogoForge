import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Logo',
  description: 'Design your perfect logo with AI. Choose from text description, reference images, or guided AI interview to create professional logos for your app or brand.',
  openGraph: {
    title: 'Create Your Logo | LogoForge',
    description: 'Design your perfect logo with AI. Choose from text description, reference images, or guided AI interview.',
  },
  twitter: {
    title: 'Create Your Logo | LogoForge',
    description: 'Design your perfect logo with AI. Choose from text description, reference images, or guided AI interview.',
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
