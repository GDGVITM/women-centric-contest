'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Lightbulb,
  ArrowRight,
  Target,
  Users,
  BarChart3,
} from 'lucide-react';

const PROBLEM_STATEMENT = {
  title: 'Women Safety Dashboard',
  objective: `Design and build a Women Safety Dashboard that visualizes safety data and provides actionable insights for communities.`,
  requirements: [
    {
      icon: Target,
      title: 'Data Visualization',
      text: 'Display safety statistics with interactive charts and graphs',
    },
    {
      icon: Users,
      title: 'Community Focus',
      text: 'Highlight local safety resources, emergency contacts, and community programs',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      text: 'Provide trend analysis and safety score metrics for neighborhoods',
    },
  ],
};

export default function Round2Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  return (
    <div className="page-container-narrow" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div className="badge badge-success" style={{ marginBottom: 16 }}>Round 2</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>
          <span className="gradient-text">Problem Statement</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Collaborate with your team to build a solution.
        </p>
      </motion.div>

      {/* Problem Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: 32, marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Lightbulb size={20} style={{ color: 'var(--accent-warning)' }} />
          <h2 style={{ fontSize: '1.2rem' }}>{PROBLEM_STATEMENT.title}</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
          {PROBLEM_STATEMENT.objective}
        </p>

        <hr className="divider" />

        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Requirements
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROBLEM_STATEMENT.requirements.map((req, i) => (
            <motion.div
              key={req.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <req.icon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{req.title}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{req.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <button
          className="btn-primary"
          onClick={() => router.push(`/team/${code}/round2/submit`)}
          style={{ padding: '14px 32px' }}
        >
          Begin Submission <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
