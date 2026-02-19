import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedLayout from '@/components/AnimatedLayout';
import { CONTEST_CONFIG } from '@/lib/config';
import Background3D from '@/components/Background3D';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: CONTEST_CONFIG.name,
  description: CONTEST_CONFIG.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {/* 3D Background Layer */}
        <Background3D />
        
        {/* Content Layer */}
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <AnimatedLayout>
              {children}
            </AnimatedLayout>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
