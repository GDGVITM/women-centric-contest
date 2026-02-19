'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  User,
  CheckCircle2,
  Lock,
  Loader2,
  Code2,
  Terminal,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export default function TeamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/members`);
      if (!res.ok) {
         if (res.status === 404) router.push('/');
         return;
      }
      const data = await res.json();
      setTeam(data);

      if (data.status === 'unlocking') router.push(`/team/${code}/unlock`);
      if (data.status === 'round2') router.push(`/team/${code}/round2`);
      if (data.status === 'completed') router.push(`/team/${code}/complete`);
      
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [code, router]);

  useEffect(() => {
    fetchTeam();
    const interval = setInterval(fetchTeam, 3000);
    return () => clearInterval(interval);
  }, [fetchTeam]);

  const handleJoin = async (memberNo: number) => {
    try {
      const res = await fetch(`/api/teams/${code}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberNo }),
      });
      
      if (res.ok) {
        router.push(`/team/${code}/member/${memberNo}`);
      } else {
        alert('Slot unavailable');
        fetchTeam();
      }
    } catch {
      alert('Network error');
    }
  };

  if (loading) return null;

  return (
    <div className="container-narrow" style={{ paddingTop: 120, paddingBottom: 60 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40, textAlign: 'center' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
           <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gdg-green)', boxShadow: '0 0 10px var(--gdg-green)' }} />
           <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>LIVE SESSION</span>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: 8, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          Team <span className="text-gradient">{team?.teamCode}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select your slot to begin Round 1.</p>
      </motion.div>

      {/* Slots Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {[1, 2, 3].map((num, i) => {
          const member = team?.members.find((m: any) => m.memberNo === num);
          const isTaken = member?.isJoined;
          const isDone = member?.isSubmitted;

          return (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                opacity: isTaken && !isDone ? 0.7 : 1
              }}
            >
              <div style={{
                width: 56, height: 56,
                borderRadius: '16px',
                background: isDone 
                  ? 'rgba(52, 168, 83, 0.1)' 
                  : isTaken 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(66, 133, 244, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                color: isDone ? 'var(--gdg-green)' : isTaken ? 'var(--text-muted)' : 'var(--gdg-blue)'
              }}>
                {isDone ? <CheckCircle2 size={24} /> : isTaken ? <User size={24} /> : <Terminal size={24} />}
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>Member 0{num}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                {isDone ? 'Submitted' : isTaken ? 'Working...' : 'Available'}
              </p>

              {isDone ? (
                <div className="badge badge-green" style={{ width: '100%', justifyContent: 'center' }}>Completed</div>
              ) : isTaken ? (
                <button 
                  className="btn-secondary" 
                  disabled 
                  style={{ width: '100%', justifyContent: 'center', opacity: 0.5 }}
                >
                  <Loader2 size={14} className="spin" /> In Progress
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => handleJoin(num)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Join Slot <ArrowRight size={14} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Status Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 60, textAlign: 'center' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
             <ShieldAlert size={16} color="var(--gdg-yellow)" />
             <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Solve the bugs to unlock the Round 2 cipher.
             </span>
        </div>
      </motion.div>

      <style jsx>{`
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
