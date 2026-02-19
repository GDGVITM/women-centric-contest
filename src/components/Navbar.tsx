'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Home, Terminal } from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(5, 5, 5, 0.6)', 
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Logo Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--gdg-blue), var(--gdg-red))',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Terminal size={18} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
            {CONTEST_CONFIG.name}
          </span>
          <span className="badge" style={{ 
            background: 'rgba(255,255,255,0.08)', 
            color: 'var(--text-secondary)', 
            border: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.7rem'
          }}>
            v2.0
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!isHome && (
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.85rem', color: 'var(--text-secondary)',
              textDecoration: 'none', transition: 'color 0.2s'
            }}>
              <Home size={14} /> Home
            </Link>
          )}
          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {CONTEST_CONFIG.organizer}
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
