'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Send,
  Type,
  FileText,
  Star,
  Link2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function Round2SubmitPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({
    solutionTitle: '',
    solutionText: '',
    keyFeatures: '',
    dashboardUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.solutionTitle.trim() || !form.solutionText.trim() || !form.keyFeatures.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/teams/${code}/round2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed.');
        return;
      }

      router.push(`/team/${code}/complete`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: 'solutionTitle',
      label: 'Solution Title',
      icon: Type,
      max: CONTEST_CONFIG.maxSolutionTitleLength,
      type: 'input' as const,
      placeholder: 'e.g. SafeHer — A Women Safety Dashboard',
    },
    {
      key: 'solutionText',
      label: 'Solution Description',
      icon: FileText,
      max: CONTEST_CONFIG.maxSolutionTextLength,
      type: 'textarea' as const,
      placeholder: 'Describe your approach, architecture, and how it solves the problem...',
    },
    {
      key: 'keyFeatures',
      label: 'Key Features',
      icon: Star,
      max: CONTEST_CONFIG.maxKeyFeaturesLength,
      type: 'textarea' as const,
      placeholder: '• Interactive heat maps\n• Emergency SOS integration\n• Community safety ratings...',
    },
    {
      key: 'dashboardUrl',
      label: 'Dashboard URL (optional)',
      icon: Link2,
      max: CONTEST_CONFIG.maxDashboardUrlLength,
      type: 'input' as const,
      placeholder: 'https://your-dashboard.vercel.app',
    },
  ];

  return (
    <div className="page-container-narrow" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div className="badge badge-success" style={{ marginBottom: 16 }}>Round 2 · Submission</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>
          <span className="gradient-text">Submit Your Solution</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Tell us about what you built.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: 32 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {fields.map((f, i) => {
            const val = form[f.key as keyof typeof form];
            const isRequired = f.key !== 'dashboardUrl';
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem' }}>
                    <f.icon size={14} style={{ color: 'var(--accent-primary)' }} />
                    {f.label}
                    {isRequired && <span style={{ color: 'var(--accent-danger)' }}>*</span>}
                  </label>
                  <span style={{
                    fontSize: '0.75rem',
                    color: val.length > f.max * 0.9 ? 'var(--accent-warning)' : 'var(--text-muted)',
                  }}>
                    {val.length}/{f.max}
                  </span>
                </div>

                {f.type === 'input' ? (
                  <input
                    className="input-field"
                    type="text"
                    placeholder={f.placeholder}
                    value={val}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    maxLength={f.max}
                  />
                ) : (
                  <textarea
                    className="textarea-field"
                    placeholder={f.placeholder}
                    value={val}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    maxLength={f.max}
                    rows={f.key === 'solutionText' ? 6 : 4}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 16, padding: '10px 16px', borderRadius: 'var(--radius-md)',
              background: 'rgba(234,67,53,0.08)', color: 'var(--accent-danger)', fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', marginTop: 24, padding: 14, justifyContent: 'center' }}
        >
          {loading ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
          ) : (
            <><Send size={16} /> Submit Solution</>
          )}
        </button>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
