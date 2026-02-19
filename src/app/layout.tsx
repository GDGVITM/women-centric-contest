import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedLayout from '@/components/AnimatedLayout';
import { CONTEST_CONFIG } from '@/lib/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${CONTEST_CONFIG.name} — ${CONTEST_CONFIG.tagline}`,
  description: `A team-based debugging competition by ${CONTEST_CONFIG.organizer}. Debug buggy code snippets, unlock challenges, and submit solutions.`,
  keywords: ['coding competition', 'debugging', 'GDG', 'hackathon', 'VIT'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <div className="bg-mesh" />
        <Navbar />
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
        <Footer />
      </body>
    </html>
  );
}
