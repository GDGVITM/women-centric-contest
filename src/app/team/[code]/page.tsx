'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface MemberInfo {
  memberNo: number;
  isJoined: boolean;
  isSubmitted: boolean;
}

export default function TeamJoinPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [teamStatus, setTeamStatus] = useState('');
  const [setName, setSetName] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/members`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members);
        setTeamStatus(data.status);
        setSetName(data.setName);
      }
    } catch {
      // ignore polling errors
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleJoin = async (memberNo: number) => {
    setError('');
    setJoining(memberNo);
    try {
      const res = await fetch(`/api/teams/${code}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberNo }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not join');
        setJoining(null);
        return;
      }

      router.push(`/team/${code}/member/${memberNo}`);
    } catch {
      setError('Network error. Try again.');
      setJoining(null);
    }
  };

  // If team is in unlocking or later state, redirect appropriately
  useEffect(() => {
    if (teamStatus === 'unlocking') {
      router.push(`/team/${code}/unlock`);
    } else if (teamStatus === 'round2') {
      router.push(`/team/${code}/round2`);
    } else if (teamStatus === 'completed') {
      router.push(`/team/${code}/complete`);
    }
  }, [teamStatus, code, router]);

  const memberIcons = ['👤', '👤', '👤'];
  const memberColors = ['#6366f1', '#06b6d4', '#8b5cf6'];

  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="animate-fade-in" style={{ maxWidth: 700, width: '100%', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <span className="badge badge-info">Team {code}</span>
          {setName && <span className="badge badge-warning" style={{ marginLeft: 8 }}>Set {setName}</span>}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Choose Your Role</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 36 }}>
          Each member picks a slot. Once joined, the slot is locked.
        </p>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 20, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
            {error}
          </div>
        )}

        {/* Member Slots */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {members.map((m, i) => (
            <button
              key={m.memberNo}
              className={`member-slot animate-fade-in-delay-${i + 1} ${m.isJoined ? 'taken' : ''}`}
              onClick={() => !m.isJoined && handleJoin(m.memberNo)}
              disabled={m.isJoined || joining !== null}
              style={{ borderTopColor: m.isJoined ? undefined : memberColors[i] }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{memberIcons[i]}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                Member {m.memberNo}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                Snippet #{m.memberNo}
              </div>
              {m.isJoined ? (
                <span className="badge badge-danger">Slot Taken</span>
              ) : joining === m.memberNo ? (
                <span className="spinner" />
              ) : (
                <span className="badge badge-success">Available</span>
              )}
            </button>
          ))}
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 28 }}>
          ⟳ Page auto-refreshes every 3 seconds
        </p>
      </div>
    </div>
  );
}
