'use client';

import { useEffect, useState, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import {
  Play,
  RotateCcw,
  Send,
  CheckCircle,
  Terminal,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function MemberPage({ params }: { params: Promise<{ code: string; id: string }> }) {
  const { code, id } = use(params);
  const memberNo = parseInt(id);
  const router = useRouter();

  const [language, setLanguage] = useState('python');
  const [snippet, setSnippet] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [error, setError] = useState('');
  const editorRef = useRef<unknown>(null);

  const fetchSnippet = useCallback(async (lang: string) => {
    try {
      const res = await fetch(`/api/snippets?teamCode=${code}&memberNo=${memberNo}&language=${lang}`);
      const data = await res.json();
      if (res.ok) {
        setSnippet(data.code);
        setEditorCode(data.code);
      }
    } catch {
      setError('Failed to load snippet');
    }
  }, [code, memberNo]);

  // Fetch startedAt from team status
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await fetch(`/api/teams/${code}/status`);
        const data = await res.json();
        if (data.startedAt) setStartedAt(data.startedAt);
      } catch {/* silent */}
    };
    fetchTimer();
  }, [code]);

  useEffect(() => {
    fetchSnippet(language);
  }, [language, fetchSnippet]);

  const getMonacoLanguage = (lang: string) => {
    const map: Record<string, string> = { c: 'c', java: 'java', python: 'python' };
    return map[lang] || 'plaintext';
  };

  const handleRun = async () => {
    setError('');
    setOutput('');
    setRunning(true);
    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: editorCode, stdin: '' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput(`Error: ${data.error}`);
      } else {
        const out = [];
        if (data.compileOutput) out.push(`[Compile]\n${data.compileOutput}`);
        if (data.stderr) out.push(`[Stderr]\n${data.stderr}`);
        if (data.stdout) out.push(`[Output]\n${data.stdout}`);
        if (out.length === 0) out.push('(No output)');
        setOutput(out.join('\n\n'));
      }
    } catch {
      setOutput('Network error. Try again.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: code, memberNo, output }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Try again.');
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setEditorCode(snippet);
    setOutput('');
  };

  const handleTimerExpired = () => {
    if (!submitted) {
      // Auto-submit with whatever output we have
      handleSubmit();
    }
  };

  const LANG_LABELS: Record<string, string> = { python: 'Python', c: 'C', java: 'Java' };

  // ─── Submitted State ───
  if (submitted) {
    return (
      <div className="page-container-narrow" style={{ paddingTop: 80, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="glass-card"
          style={{ padding: 48 }}
        >
          <CheckCircle size={56} style={{ color: 'var(--accent-success)', marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Output Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Your submission for Member {memberNo} is locked. Wait for all teammates to submit.
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push(`/team/${code}/unlock`)}
          >
            Go to Unlock Page
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Editor View ───
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      {/* ─── Toolbar ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-info">Team {code}</span>
          <span className="badge badge-warning">Member {memberNo}</span>

          {/* Language Tabs */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            {['python', 'c', 'java'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: language === lang ? 'var(--accent-primary)' : 'transparent',
                  color: language === lang ? 'white' : 'var(--text-secondary)',
                }}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CountdownTimer startedAt={startedAt} onExpired={handleTimerExpired} />
        </div>
      </motion.div>

      {/* ─── Main Area ─── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px' }}>
        {/* Editor Column */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)' }}>
          {/* Action bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {LANG_LABELS[language]} Editor
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={handleReset} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <RotateCcw size={14} /> Reset
              </button>
              <button className="btn-primary" onClick={handleRun} disabled={running} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                {running ? (
                  <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running</>
                ) : (
                  <><Play size={14} /> Run</>
                )}
              </button>
            </div>
          </div>

          {/* Monaco */}
          <div style={{ flex: 1, minHeight: 400 }}>
            <MonacoEditor
              height="100%"
              language={getMonacoLanguage(language)}
              value={editorCode}
              onChange={(val) => setEditorCode(val || '')}
              theme="vs-dark"
              onMount={(editor) => { editorRef.current = editor; }}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: 'on',
                roundedSelection: true,
                wordWrap: 'on',
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </div>
        </div>

        {/* Output Column */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Terminal size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Output Console</span>
          </div>

          <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: output.includes('Error') || output.includes('Stderr') ? 'var(--accent-danger)' : 'var(--text-primary)',
              margin: 0,
            }}>
              {running ? (
                <span style={{ color: 'var(--accent-primary)' }}>⏳ Compiling and running...</span>
              ) : output ? (
                output
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Click &quot;Run&quot; to see output here...</span>
              )}
            </pre>
          </div>

          {error && (
            <div style={{
              padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem',
              color: 'var(--accent-danger)', background: 'rgba(234,67,53,0.08)',
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Submit Area */}
          <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !output}
              style={{ width: '100%', padding: 14, justifyContent: 'center' }}
            >
              {submitting ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
              ) : (
                <><Send size={16} /> Submit Output</>
              )}
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8, textAlign: 'center' }}>
              ⚠ Submission is final and cannot be undone
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
