'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Round2SubmitPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!solutionTitle.trim() || !solutionText.trim() || !keyFeatures.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/teams/${code}/round2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solutionTitle: solutionTitle.trim(),
          solutionText: solutionText.trim(),
          keyFeatures: keyFeatures.trim(),
          dashboardUrl: dashboardUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed.');
        setSubmitting(false);
        return;
      }

      router.push(`/team/${code}/complete`);
    } catch {
      setError('Network error. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: 680, width: '100%', padding: '40px 36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <span className="badge badge-info">Team {code}</span>
            <span className="badge badge-success">Round 2</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            📝 Final Submission
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Submit your team's solution below. This is final and cannot be edited.
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Solution Title *
            </label>
            <input
              type="text"
              className="input-glow"
              placeholder="e.g. Smart Campus Navigation System"
              value={solutionTitle}
              onChange={(e) => setSolutionTitle(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Solution Explanation *
            </label>
            <textarea
              className="textarea-glow"
              placeholder="Describe your approach, architecture, and how it solves the problem..."
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              disabled={submitting}
              rows={6}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Features *
            </label>
            <textarea
              className="textarea-glow"
              placeholder="List the key features of your solution, one per line..."
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              disabled={submitting}
              rows={4}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Dashboard / Demo Link (optional)
            </label>
            <input
              type="url"
              className="input-glow"
              placeholder="https://..."
              value={dashboardUrl}
              onChange={(e) => setDashboardUrl(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button
            className="btn-glow"
            onClick={handleSubmit}
            disabled={submitting || !solutionTitle.trim() || !solutionText.trim() || !keyFeatures.trim()}
            style={{ padding: '16px 40px', fontSize: '1.05rem' }}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 18, height: 18 }} /> Submitting...
              </span>
            ) : (
              '🚀 Final Submit'
            )}
          </button>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 10 }}>
            ⚠ This submission is final and cannot be edited after submitting
          </p>
        </div>
      </div>
    </div>
  );
}
