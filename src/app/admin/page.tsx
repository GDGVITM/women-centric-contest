'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, CheckCircle, Lock, Unlock, Clock, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
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

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Contest Admin
             </h1>
             <a href="/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300">Open Landing Page ↗</a>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  <th className="p-4">Set</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Members</th>
                  <th className="p-4">Attempts</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams?.map((team: any) => (
                  <tr key={team.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-bold text-blue-300">{team.teamCode} <span className="text-xs text-gray-500 font-normal ml-2">{team.name}</span></td>
                    <td className="p-4">{team.set?.name || '-'}</td>
                    <td className="p-4">
                      <StatusBadge status={team.status} />
                    </td>
                    <td className="p-4 text-gray-400">
                      {team.members.length} / {team.set?.members || 3}
                    </td>
                    <td className="p-4">
                       {team.keyAttempts?.length || 0}
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
          </div>
        </div>

      </div>
    </div>
  );
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
