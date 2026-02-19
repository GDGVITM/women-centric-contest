'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { User, Check, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface MemberData {
  memberNo: number;
  isJoined: boolean;
  isSubmitted: boolean;
}

export default function TeamHubPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [teamStatus, setTeamStatus] = useState('');
  const [setName, setSetName] = useState('');
  const [joining, setJoining] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/members`);
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
        setTeamStatus(data.status);
        setSetName(data.setName);
      }
    } catch {
      /* silent poll failure */
    }
  }, [code]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    if (teamStatus === 'unlocking') router.push(`/team/${code}/unlock`);
    else if (teamStatus === 'round2') router.push(`/team/${code}/round2`);
    else if (teamStatus === 'completed') router.push(`/team/${code}/complete`);
  }, [teamStatus, code, router]);

  const handleJoin = async (memberNo: number) => {
    setJoining(memberNo);
    setError('');
    try {
      const res = await fetch(`/api/teams/${code}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberNo }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/team/${code}/member/${memberNo}`);
      } else {
        setError(data.error || 'Failed to join.');
        await fetchStatus();
      }
    } catch {
      setError('Network error.');
    } finally {
      setJoining(null);
    }
  };

  const getMemberState = (m: MemberData) => {
    if (m.isSubmitted) return 'submitted';
    if (m.isJoined) return 'active';
    return 'available';
  };

  const stateConfig = {
    available: {
      icon: User,
      badge: 'Available',
      badgeClass: 'badge-success',
      color: 'var(--accent-success)',
    },
    active: {
      icon: Loader2,
      badge: 'In Progress',
      badgeClass: 'badge-warning',
      color: 'var(--accent-warning)',
    },
    submitted: {
      icon: Check,
      badge: 'Submitted',
      badgeClass: 'badge-info',
      color: 'var(--accent-primary)',
    },
  };

  return (
    <div className="page-container-narrow" style={{ paddingTop: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <div className="badge badge-info" style={{ marginBottom: 16 }}>
          Team {code} · Set {setName || '...'}
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Select Your Slot</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose a member slot to begin debugging. Each member gets a unique code challenge.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gap: 16, maxWidth: 480, margin: '0 auto' }}>
        {members.map((m, i) => {
          const state = getMemberState(m);
          const config = stateConfig[state];
          const StateIcon = config.icon;
          const isAvailable = state === 'available';

          return (
            <motion.div
              key={m.memberNo}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glow-card"
              onClick={() => isAvailable && handleJoin(m.memberNo)}
              style={{
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: isAvailable ? 'pointer' : 'default',
                opacity: !isAvailable ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${config.color}15`,
                    border: `1px solid ${config.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StateIcon size={20} style={{ color: config.color }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>Member {m.memberNo}</p>
                  <div className={`badge ${config.badgeClass}`} style={{ marginTop: 4 }}>
                    {config.badge}
                  </div>
                </div>
              </div>

              {isAvailable && joining !== m.memberNo && (
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              )}
              {joining === m.memberNo && (
                <Loader2 size={18} style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
              )}
              {!isAvailable && <Lock size={16} style={{ color: 'var(--text-muted)' }} />}
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', color: 'var(--accent-danger)', marginTop: 16, fontSize: '0.9rem' }}
        >
          {error}
        </motion.p>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
