'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Lock } from 'lucide-react';

export default function TeamLogin() {
  const { code } = useParams();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.length !== 6) {
        setError("Code must be 6 digits");
        return;
    }
    setLoading(true);
    setError('');

    try {
        const res = await fetch('/api/teams/login', {
            method: 'POST',
            body: JSON.stringify({ teamCode: code, secret }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();
        
        if (res.ok) {
            router.push(`/team/${code}`); // Redirect to Dashboard
        } else {
            setError(data.error || 'Invalid Code');
        }
    } catch (err) {
        setError('Network Error. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
       {/* Background (simplified) */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />

      <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mb-2">
                <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold">Team Authentication</h1>
            <p className="text-gray-400 text-sm">Enter the 6-digit access code for <span className="text-white font-mono font-bold">{String(code).toUpperCase()}</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <input 
                    type="text" 
                    maxLength={6}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value.replace(/\D/g, ''))} // Numeric only
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-center text-3xl tracking-[1em] font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-700"
                    placeholder="000000"
                />
                 {error && <p className="text-red-500 text-sm text-center mt-2 animate-pulse">{error}</p>}
            </div>

            <button 
                type="submit" 
                disabled={loading || secret.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Unlock Dashboard'}
            </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
             <button 
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
             >
                <ArrowLeft size={16} />
                Not {String(code).toUpperCase()}? Change Team
             </button>
        </div>

      </div>
    </div>
  );
}
