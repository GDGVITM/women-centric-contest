'use client';

import { useState, useEffect, useRef, use } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { motion } from 'motion/react';
import {
  Play,
  Send,
  Loader2,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Minimize2,
  ArrowLeft,
  Moon,
  Sun
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { CONTEST_CONFIG } from '@/lib/config';
import { useRouter } from 'next/navigation';

export default function MemberPage({ params }: { params: Promise<{ code: string; id: string }> }) {
  const { code, id } = use(params);
  const router = useRouter();
  const editorRef = useRef<any>(null);
  
  const [language, setLanguage] = useState('python');
  const [sourceCode, setSourceCode] = useState('');
  const [output, setOutput] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [status, setStatus] = useState('idle');
  const [problemSet, setProblemSet] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer state
  const [startedAt, setStartedAt] = useState<string | null>(null);

  // Determine language based on member ID (initial only) - actually, we verify this against API
  // Fetch snippet whenever language, code, or neutral id changes.
  useEffect(() => {
    setOutput(''); // Clear output on switch
    setStatus('idle');
    setCanSubmit(false); // Reset submit status on language change
    
    // Fetch snippet for current language
    const fetchSnippet = async () => {
      try {
        const res = await fetch(`/api/snippets?code=${code}&member=${id}&language=${language}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        if(data.code) {
            setSourceCode(data.code);
        } else {
            setSourceCode(`// No snippet found for ${language}`);
        }
        if(data.setName) setProblemSet(data.setName);
      } catch (err) {
        console.error(err);
        setSourceCode(`// Error loading snippet for ${language}`);
      }
    };

    fetchSnippet();

    // Fetch team start time for timer (only once or on mount)
    // We can keep this separate or loose here.
    fetch(`/api/teams/${code}/status`)
      .then(res => res.json())
      .then(data => {
         if(data.startedAt) setStartedAt(data.startedAt);
         if(data.status === 'completed' || data.status === 'eliminated') {
             alert('Round 1 is over for your team.');
             router.push(`/team/${code}`);
         }
      });
  }, [code, id, language]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // useEffect will trigger fetch
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...');
    setStatus('idle');
    setCanSubmit(false);
    
    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            language, 
            code: sourceCode,
            teamCode: code,
            memberId: id 
        }),
      });
      
      const data = await res.json();
      
      // Fix: API returns flat stdout/stderr, not nested run object
      const outputText = data.stdout || data.stderr || data.compileOutput || data.error || 'Execution finished with no output.';
      setOutput(outputText);
      setStatus((data.exitCode === 0 && !data.stderr && !data.error) ? 'success' : 'error');
      
      if (data.isCorrect) {
          setCanSubmit(true);
      }

    } catch {
      setOutput('Network error regarding compiler service.');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!canSubmit) {
        alert("Please RUN your code first! It must compile successfully and match the expected output to be submitted.");
        return;
    }
    
    const confirmSubmit = window.confirm("Ready to lock in this solution?");
    if (!confirmSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: code, memberNo: parseInt(id), code: sourceCode }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('Submitted successfully!');
        if (data.allSubmitted) {
           // Disabled redirect as per user request
           // router.push(`/team/${code}/unlock`);
           router.push(`/team/${code}`); // Go back to dashboard instead
        } else {
           router.push(`/team/${code}`); 
        }
      } else {
        // Show full error from server
        alert('Error: ' + (data.error || 'Submission failed'));
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeout = async () => {
      alert('Time Limit Reached! Submitting current code...');
      // Auto submit whatever they have, then mark eliminated?
      // Or just mark eliminated? User said "logged out... eliminated"
      // Let's try to submit (maybe they have partial code) but status will be handled by backend?
      // Actually, if time is up, they failed the round.
      // We should probably call an API to set status = eliminated.
      // For now, let's just push them out.
      router.push(`/team/${code}`);
  };

  return (
    <div style={{ paddingTop: 100, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Editor Toolbar */}
      <div style={{
         height: 60,
         borderBottom: '1px solid var(--border-subtle)',
         background: 'var(--bg-secondary)',
         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
         padding: '0 24px'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
                onClick={() => router.push(`/team/${code}`)}
                className="hover:text-white text-gray-400 transition-colors"
                title="Back to Dashboard"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="badge badge-blue">Member 0{id}</div>
            <div style={{ height: 24, width: 1, background: 'var(--border-subtle)' }} />
            
            {/* Language Selector */}
            <select 
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}
            >
              <option value="python">PYTHON</option>
              <option value="c">C (GCC)</option>
              <option value="java">JAVA</option>
              <option value="cpp">C++</option>
            </select>

            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{problemSet}</span>
         </div>

         {/* Timer Component */}
         {startedAt && (
            <CountdownTimer 
               startedAt={startedAt} 
               onExpired={handleTimeout}
            />
         )}

         <div style={{ display: 'flex', gap: 12 }}>
            <button 
               className="btn-secondary" 
               onClick={runCode} 
               disabled={isRunning}
               style={{ minWidth: 100, justifyContent: 'center' }}
            >
               {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />} 
               Run
            </button>
            <button 
               className="btn-primary" 
               onClick={submitCode} 
               disabled={isSubmitting} // Only disable when network is busy
               style={{ 
                  minWidth: 120, 
                  justifyContent: 'center', 
                  opacity: canSubmit ? 1 : 0.6, 
                  cursor: isSubmitting ? 'wait' : 'pointer' // Always pointer to invite click for feedback
               }}
            >
               {isSubmitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />} 
               Submit
            </button>
         </div>
      </div>

      {/* Main Split Pane */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', overflow: 'hidden' }}>
         
         {/* Left: Code Editor */}
         <div style={{ position: 'relative', borderRight: '1px solid var(--border-subtle)' }}>
             <Editor
               height="100%"
               defaultLanguage={language}
               language={language === 'c' || language === 'cpp' ? 'c' : language} // Monaco uses 'c' for C
               value={sourceCode}
               onChange={(val) => setSourceCode(val || '')}
               onMount={handleEditorDidMount}
               theme="vs-dark"
               options={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 20 },
                  lineNumbers: 'on',
                  // Disable autocomplete
                  quickSuggestions: false,
                  suggestOnTriggerCharacters: false,
                  parameterHints: { enabled: false },
                  snippetSuggestions: 'none',
                  wordBasedSuggestions: 'off',
                  hover: { enabled: true },
               }}
            />
         </div>

         {/* Right: Output Console */}
         <div style={{ background: '#0D0D0D', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
               padding: '12px 20px', 
               borderBottom: '1px solid var(--border-subtle)',
               fontSize: '0.85rem',
               fontWeight: 600,
               color: 'var(--text-secondary)',
               display: 'flex', alignItems: 'center', gap: 8
            }}>
               <Terminal size={14} /> CONSOLE
            </div>
            
            <div style={{ 
               flex: 1, 
               padding: 24, 
               fontFamily: "'Space Grotesk', monospace", 
               fontSize: '0.9rem', 
               color: status === 'error' ? '#ff6b6b' : '#a1a1aa',
               whiteSpace: 'pre-wrap', 
               overflowY: 'auto',
               lineHeight: 1.6
            }}>
               {output || <span style={{ color: 'var(--text-muted)' }}>Ready to execute...</span>}
            </div>
         </div>
      </div>
      
      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
