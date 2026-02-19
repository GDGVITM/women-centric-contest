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
  Maximize2,
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
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [problemSet, setProblemSet] = useState('');
  
  // Timer state
  const [startedAt, setStartedAt] = useState<string | null>(null);

  useEffect(() => {
    // Determine language based on member ID
    // M1: Python, M2: C, M3: Java/Cpp (simplified for demo)
    const langMap: Record<string, string> = { '1': 'python', '2': 'c', '3': 'cpp' };
    const defaultCode: Record<string, string> = {
      python: `# Python 3.10\n# Fix the bug below:\n\ndef calculate_sum(arr):\n    return sum(arr)\n\nprint(calculate_sum([1, 2, 3]))`,
      c: `// GCC 11.2\n#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}`,
      cpp: `// GCC 11.2\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}`
    };

    const lang = langMap[id] || 'python';
    setLanguage(lang);
    
    // Fetch initial snippet
    fetch(`/api/snippets?code=${code}&member=${id}`)
      .then(res => res.json())
      .then(data => {
         if(data.code) setSourceCode(data.code);
         else setSourceCode(defaultCode[lang]);
         setProblemSet(data.setName || 'Set A');
      })
      .catch(() => setSourceCode(defaultCode[lang]));

    // Fetch team start time for timer
    fetch(`/api/teams/${code}/status`)
      .then(res => res.json())
      .then(data => {
         if(data.startedAt) setStartedAt(data.startedAt);
      });

  }, [code, id]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...');
    setStatus('idle');
    
    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: sourceCode }),
      });
      
      const data = await res.json();
      
      if (data.run && data.run.output) {
        setOutput(data.run.output);
        setStatus(data.run.code === 0 ? 'success' : 'error');
      } else {
        setOutput(data.message || 'Execution error');
        setStatus('error');
      }
    } catch {
      setOutput('Network error regarding compiler service.');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    const confirmSubmit = window.confirm("Are you sure? Does your code pass all edge cases?");
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
        
        // Check if all submitted
        if (data.allSubmitted) {
           router.push(`/team/${code}/unlock`);
        } else {
           router.push(`/team/${code}`); // Back to dashboard
        }

      } else {
        alert('Error: ' + data.error);
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Editor Toolbar */}
      <div style={{
         height: 60,
         borderBottom: '1px solid var(--border-subtle)',
         background: 'var(--bg-secondary)',
         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
         padding: '0 24px'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="badge badge-blue">Member 0{id}</div>
            <div style={{ height: 24, width: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
               {language.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{problemSet}</span>
         </div>

         {/* Timer Component */}
         {startedAt && (
            <CountdownTimer 
               startedAt={startedAt} 
               durationMinutes={CONTEST_CONFIG.roundOneDurationMinutes}
               onExpired={() => { alert('Time Up!'); submitCode(); }}
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
               disabled={isSubmitting}
               style={{ minWidth: 120, justifyContent: 'center' }}
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
               language={language}
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
