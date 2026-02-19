'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Globe 
} from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';
import Scene3D from '@/components/Scene3D';
import { Canvas } from '@react-three/fiber';

export default function LandingPage() {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [pistonStatus, setPistonStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    fetch('/api/piston/status')
      .then(res => res.json())
      .then(data => setPistonStatus(data.status === 'online' ? 'online' : 'offline'))
      .catch(() => setPistonStatus('offline'));
  }, []);

  const handleJoin = async () => {
    if (pistonStatus === 'offline') {
       if(!confirm("⚠️ The compilation system appears to be OFFLINE. You may experience issues running code. Continue anyway?")) {
           return;
       }
    }

    if (!teamCode.trim()) {
      setError('Please enter a team code.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      if (!res.ok) {
        setError(data.error || `Failed to join (${res.status})`);
        setLoading(false);
        return;
      }

      // Redirect to Login Page first
      router.push(`/team/${data.teamCode}/login`);
    } catch (err: any) {
      console.error('Join error:', err);
      setError(err.message || 'Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* System Status Banner */}
      {pistonStatus === 'offline' && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-4 py-2 text-center text-sm font-mono flex items-center justify-center gap-2">
           <ShieldCheck size={14} /> 
           <span>SYSTEM WARNING: Compilation Service Unavailable. Contest functions may be limited.</span>
        </div>
      )}
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        paddingTop: 80 
      }}>
        <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="badge badge-blue" style={{ marginBottom: 24, fontSize: '0.8rem' }}>
              <Zap size={12} style={{ marginRight: 6 }} /> 
              {CONTEST_CONFIG.tagline}
            </div>
            
            <h1 style={{ 
              fontSize: '4.5rem', 
              lineHeight: 1, 
              letterSpacing: '-0.03em', 
              fontWeight: 700,
              marginBottom: 24,
              fontFamily: 'var(--font-mono)'
            }}>
              Break the <br />
              <span className="text-gradient-gdg">Loop.</span>
            </h1>

            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)', 
              maxWidth: 480, 
              lineHeight: 1.6,
              marginBottom: 40 
            }}>
              An immersive debugging marathon. Fix the bugs, crack the cipher, and build the future of women safety.
            </p>

            {/* Input Group */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              maxWidth: 420,
              background: 'rgba(255,255,255,0.03)',
              padding: 6,
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              <input
                type="text"
                placeholder="Enter Team Code (e.g. T01)"
                value={teamCode}
                onChange={(e) => {
                  setTeamCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  flex: 1,
                  padding: '0 16px',
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button 
                className="btn-primary" 
                onClick={handleJoin} 
                disabled={loading}
                style={{ padding: '12px 24px', borderRadius: '8px' }}
              >
                {loading ? ' joining...' : 'Start'} <ArrowRight size={16} />
              </button>
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: 'var(--accent-red)', marginTop: 12, fontSize: '0.9rem', paddingLeft: 8 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Right: 3D Scene */}
          <div style={{ height: 600, width: '100%', position: 'relative' }}>
             <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
                <Scene3D />
             </Canvas>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 40 }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>How to play</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Follow the steps to complete the challenge.</p>
          </motion.div>
          
          <div className="bento-grid">
            {/* Card 1 */}
            <motion.div 
              className="bento-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ 
                width: 40, height: 40, 
                borderRadius: '8px', 
                background: 'rgba(66, 133, 244, 0.1)', 
                color: 'var(--gdg-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20
              }}>
                <Terminal size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>1. Debug</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Analyze the provided buggy code snippet. Fix syntax and logical errors within the 30-minute timer.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
               className="bento-card"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
            >
              <div style={{ 
                width: 40, height: 40, 
                borderRadius: '8px', 
                background: 'rgba(52, 168, 83, 0.1)', 
                color: 'var(--gdg-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20
              }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>2. Execute</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Run your code against hidden test cases. Ensure memory and time limits are respected.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
               className="bento-card"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
            >
              <div style={{ 
                width: 40, height: 40, 
                borderRadius: '8px', 
                background: 'rgba(251, 188, 4, 0.1)', 
                color: 'var(--gdg-yellow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20
              }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>3. Unlock</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                When all 3 team members submit, the safe unlocks. Enter the combined key to verify.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
               className="bento-card"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
            >
              <div style={{ 
                width: 40, height: 40, 
                borderRadius: '8px', 
                background: 'rgba(234, 67, 53, 0.1)', 
                color: 'var(--gdg-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20
              }}>
                <Code2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>4. Build</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Round 2: Collaborative development. Build a solution for the revealed problem statement.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '60px 0 100px', textAlign: 'center' }}>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Ready to break the loop?</h2>
         <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
             <a href={CONTEST_CONFIG.orgUrl} target="_blank" className="btn-secondary">
               <Globe size={16} /> Visit GDG Website
             </a>
             <button 
                onClick={() => router.push('/admin/login')}
                className="btn-secondary"
                style={{ opacity: 0.5 }}
             >
                <ShieldCheck size={16} /> Admin
             </button>
         </div>
      </section>

    </div>
  );
}
