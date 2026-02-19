'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Logo + Title */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--gdg-blue), var(--gdg-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
              {CONTEST_CONFIG.name}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {CONTEST_CONFIG.organizer}
            </p>
          </div>
        </Link>

        {/* Navigation */}
        {!isHome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Home size={14} />
              Home
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
