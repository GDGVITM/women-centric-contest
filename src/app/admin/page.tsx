'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, CheckCircle, Lock, Unlock, Clock, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const router = useRouter();

  const fetchData = async () => {
    // Only show loading on initial fetch
    if (!data) setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [selectedCode, setSelectedCode] = useState<{title: string, code: string} | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Live refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!data) return null;

  const { teams, stats } = data;

  // Sorting Logic: Active > Unlocking > Round 1 > Waiting > Completed
  const statusPriority: any = { 'round2': 4, 'unlocking': 3, 'round1': 2, 'waiting': 0, 'completed': 1 };
  
  const sortedTeams = [...teams].sort((a: any, b: any) => {
      const prioA = statusPriority[a.status] || 0;
      const prioB = statusPriority[b.status] || 0;
      if (prioA !== prioB) return prioB - prioA; // Higher priority first
      // If same status, sort by startedAt (Latest first)
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  });

  const filteredTeams = sortedTeams.filter((t: any) => {
      if (filter === 'ALL') return true;
      return t.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 gap-4">
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Contest Admin
             </h1>
             <a href="/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300">Open Landing Page ↗</a>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
              {['ALL', 'ROUND1', 'ROUND2', 'UNLOCKING', 'COMPLETED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${filter === f ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                      {f}
                  </button>
              ))}
          </div>

          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading && !data ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Teams" value={stats?.totalTeams || 0} icon={<Clock />} color="text-white" />
          <StatCard label="Round 1" value={stats?.round1 || 0} icon={<Clock />} color="text-blue-400" />
          <StatCard label="Unlocking" value={stats?.unlocking || 0} icon={<Lock />} color="text-yellow-400" />
          <StatCard label="Round 2" value={stats?.round2 || 0} icon={<Unlock />} color="text-green-400" />
          <StatCard label="Completed" value={stats?.completed || 0} icon={<CheckCircle />} color="text-purple-400" />
        </div>

        {/* Teams Table */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="p-4">Team</th>
                  <th className="p-4">Round</th>
                  <th className="p-4">Time Left</th>
                  <th className="p-4">Progress / Members</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeams.map((team: any) => (
                  <tr key={team.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-bold text-blue-300">
                        {team.teamCode} 
                        <div className="text-xs text-gray-500 font-normal">{team.name}</div>
                    </td>
                    <td className="p-4">
                        <span className="text-xs font-mono text-gray-400">R{team.currentRound} ({team.set?.name})</span>
                        <div className="mt-1"><StatusBadge status={team.status} /></div>
                    </td>
                    <td className="p-4 font-mono text-yellow-400">
                        {team.startedAt && team.status !== 'completed' && team.status !== 'waiting' ? (
                            <LiveTimer startedAt={team.startedAt} durationMinutes={45} />
                        ) : (
                            <span className="text-gray-600">-</span>
                        )}
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex gap-2">
                        {team.members.map((m: any) => (
                           <button 
                                key={m.memberNo}
                                onClick={() => m.submittedCode && setSelectedCode({ title: `${team.teamCode} - Member ${m.memberNo}`, code: m.submittedCode })}
                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] border ${
                                    m.isSubmitted ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30' : 
                                    m.isJoined ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 
                                    'bg-white/5 border-white/10 text-gray-600'
                                }`}
                                title={m.isSubmitted ? "View Submitted Code" : "Not Submitted"}
                                disabled={!m.submittedCode}
                           >
                              {m.memberNo}
                           </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                          onClick={async () => {
                              if(confirm(`Reset progress for ${team.teamCode}?`)) {
                                  await fetch('/api/admin/reset', {
                                      method: 'POST',
                                      body: JSON.stringify({ teamCode: team.teamCode })
                                  });
                                  fetchData();
                              }
                          }}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded"
                      >
                          Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTeams.length === 0 && (
                <div className="p-8 text-center text-gray-500">No teams found matching filter.</div>
            )}
          </div>
        </div>

        {/* Code Modal */}
        {selectedCode && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCode(null)}>
                <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-mono text-blue-400">{selectedCode.title}</h3>
                        <button onClick={() => setSelectedCode(null)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <pre className="p-4 overflow-auto font-mono text-xs text-gray-300 flex-1">
                        {selectedCode.code}
                    </pre>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

function LiveTimer({ startedAt, durationMinutes }: { startedAt: string, durationMinutes: number }) {
    const [timeLeft, setTimeLeft] = useState('');
    
    useEffect(() => {
        const calculate = () => {
            const start = new Date(startedAt).getTime();
            const end = start + durationMinutes * 60 * 1000;
            const now = Date.now();
            const diff = end - now;
            
            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }
            
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${m}m ${s}s`);
        };
        
        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [startedAt, durationMinutes]);
    
    return <span className={timeLeft === 'Expired' ? 'text-red-500' : 'text-yellow-400'}>{timeLeft}</span>;
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-[#0D0D0D] border border-white/10 p-4 rounded-xl flex items-center justify-between">
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </div>
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    waiting: 'bg-gray-500/20 text-gray-400',
    round1: 'bg-blue-500/20 text-blue-400',
    unlocking: 'bg-yellow-500/20 text-yellow-400',
    round2: 'bg-green-500/20 text-green-400',
    completed: 'bg-purple-500/20 text-purple-400',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${styles[status] || styles.waiting}`}>
      {status}
    </span>
  );
}
