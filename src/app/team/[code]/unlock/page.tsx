'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  KeyRound,
  Check,
  X,
  Lock,
  Loader2,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function UnlockPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [members, setMembers] = useState<{ memberNo: number; isSubmitted: boolean }[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/status`);
      const data = await res.json();
      if (data.members) setMembers(data.members);
      if (data.status === 'round2') router.push(`/team/${code}/round2`);
    } catch {/* silent */}
  }, [code, router]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError('');

    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`digit-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prev = document.getElementById(`digit-${index - 1}`);
      prev?.focus();
    }
  };

  const handleUnlock = async () => {
    const key = digits.join('');
    if (key.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/teams/${code}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (data.locked) {
        setLocked(true);
        setAttempts(data.attempts);
        return;
      }

      if (data.unlocked) {
        setSuccess(true);
        setTimeout(() => router.push(`/team/${code}/round2`), 1500);
        return;
      }

      setError(data.message || 'Incorrect key.');
      setAttempts(data.attempts || attempts + 1);
      setDigits(['', '', '', '', '', '']);
      document.getElementById('digit-0')?.focus();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const allSubmitted = members.length > 0 && members.every((m) => m.isSubmitted);

  return (
    <div className="container-narrow" style={{ paddingTop: 120 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
             <ShieldCheck size={18} color="var(--gdg-blue)" />
             <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                SECURITY CHECKPOINT
             </span>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Enter <span className="text-gradient">Access Key</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
           Combine the hidden fragments from each member's debug output to unlock the safe.
        </p>
      </motion.div>

      {/* Main Unlock Card */}
      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="glass-card"
         style={{ maxWidth: 480, margin: '0 auto', padding: 40 }}
      >
        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               style={{ width: 80, height: 80, background: 'rgba(52, 168, 83, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gdg-green)' }}
            >
               <Check size={40} />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Access Granted</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Decrypting Round 2 files...</p>
          </div>
        ) : locked ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Lock size={48} style={{ color: 'var(--accent-danger)', margin: '0 auto 24px' }} />
            <h3 style={{ color: 'var(--accent-danger)', marginBottom: 8 }}>System Locked</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Too many failed attempts. Contact administrator.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  id={`digit-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={!allSubmitted}
                  style={{
                    width: 50, height: 64,
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-tertiary)',
                    border: error ? '1px solid var(--accent-danger)' : d ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.2s',
                    opacity: allSubmitted ? 1 : 0.5
                  }}
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--accent-red)', fontSize: '0.9rem', marginBottom: 24 }}
              >
                 <X size={14} /> {error}
              </motion.div>
            )}

            <button
               className="btn-primary"
               onClick={handleUnlock}
               disabled={loading || !allSubmitted}
               style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: '1rem' }}
            >
               {loading ? <Loader2 className="spin" /> : !allSubmitted ? 'Waiting for teammates...' : 'Verify Access Key'}
            </button>
            
            {/* Status Indicators */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 8 }}>
               {members.map((m, i) => (
                  <div key={i} style={{ 
                     display: 'flex', alignItems: 'center', gap: 6, 
                     padding: '6px 12px', borderRadius: '20px', 
                     background: 'rgba(255,255,255,0.03)', 
                     fontSize: '0.75rem', color: m.isSubmitted ? 'var(--gdg-green)' : 'var(--text-muted)' 
                  }}>
                     <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.isSubmitted ? 'currentColor' : '#333' }} />
                     Member {m.memberNo}
                  </div>
               ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               {attempts > 0 && `${attempts} / ${CONTEST_CONFIG.maxUnlockAttempts} attempts used`}
            </div>
          </>
        )}
      </motion.div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
