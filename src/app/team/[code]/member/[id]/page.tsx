'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function MemberPage() {
  const params = useParams<{ code: string; id: string }>();
  const code = params.code;
  const memberNo = parseInt(params.id);
  const router = useRouter();

  const [language, setLanguage] = useState('python');
  const [snippet, setSnippet] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  if (submitted) {
    return (
      <div className="page-container">
        <div className="glass-card animate-fade-in" style={{ maxWidth: 520, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }} className="checkmark-bounce">✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Output Submitted!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Your submission for Member {memberNo} has been locked. Wait for all teammates to submit.
          </p>
          <button className="btn-secondary" onClick={() => router.push(`/team/${code}/unlock`)}>
            Go to Team Unlock Page →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>🔁 Break the Loop</span>
          <span className="badge badge-info">Team {code}</span>
          <span className="badge badge-warning">Member {memberNo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Round 1</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', gap: 0 }}>
        {/* Editor Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border)' }}>
          {/* Language + Actions Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(30,41,59,0.5)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="lang-selector">
              {['python', 'c', 'java'].map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang === 'c' ? 'C' : lang === 'java' ? 'Java' : 'Python'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={handleReset} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                ↺ Reset
              </button>
              <button className="btn-glow" onClick={handleRun} disabled={running} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                {running ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Running...</> : '▶ Run'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
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
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(15,23,42,0.6)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: '0.9rem' }}>
            📟 Output Console
          </div>
          <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            <div className="output-console" style={{ height: '100%', minHeight: 300 }}>
              {running ? (
                <span style={{ color: 'var(--color-accent)' }}>⏳ Compiling and running...</span>
              ) : output ? (
                output
              ) : (
                <span style={{ color: '#484f58' }}>Click "Run" to see output here...</span>
              )}
            </div>
          </div>

          {error && (
            <div style={{ padding: '8px 16px', color: 'var(--color-danger)', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)' }}>
              {error}
            </div>
          )}

          {/* Submit Area */}
          <div style={{ padding: 16, borderTop: '1px solid var(--color-border)' }}>
            <button
              className="btn-glow"
              onClick={handleSubmit}
              disabled={submitting || !output}
              style={{ width: '100%', padding: '14px' }}
            >
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18 }} /> Submitting...
                </span>
              ) : (
                '📤 Submit Output'
              )}
            </button>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 8, textAlign: 'center' }}>
              ⚠ Submission is final and cannot be undone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
