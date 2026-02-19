'use client';

import { Github, Heart } from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* GDG Colors Bar */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Object.values(CONTEST_CONFIG.colors).map((color) => (
            <div
              key={color}
              style={{
                width: 24,
                height: 3,
                borderRadius: 2,
                background: color,
              }}
            />
          ))}
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Built with <Heart size={12} style={{ color: 'var(--gdg-red)' }} /> by{' '}
          <a
            href={CONTEST_CONFIG.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
          >
            {CONTEST_CONFIG.organizer}
          </a>
        </p>

        <a
          href={CONTEST_CONFIG.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}
        >
          <Github size={14} />
          <span>Source Code</span>
        </a>
      </div>
    </footer>
  );
}
