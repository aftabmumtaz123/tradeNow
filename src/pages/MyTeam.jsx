import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, Copy, Check, Link2 } from 'lucide-react';

export default function MyTeam() {
  const { API } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('level1');

  useEffect(() => {
    API.get('/users/team')
      .then((r) => setData(r.data))
      .catch(() => toast.error('Failed to load team'))
      .finally(() => setLoading(false));
  }, []);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading team...</div>;

  const members = data?.team?.[tab] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Team</h1>
        <p className="text-gray-400 text-sm mt-1">Share your referral link and grow your team</p>
      </div>

      {/* Referral card */}
      <div className="glass-green rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link2 className="w-4 h-4" /> Your Referral Link
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value={data?.referralLink || ''}
            className="flex-1 bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 text-sm truncate"
          />
          <button
            onClick={() => copy(data?.referralLink || '')}
            className="btn-primary px-4 rounded-xl flex items-center gap-2 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Code: <span className="text-green-400 font-mono font-semibold">{data?.referralCode}</span>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'level1', label: 'Level 1', count: data?.counts?.level1 || 0 },
          { key: 'level2', label: 'Level 2', count: data?.counts?.level2 || 0 },
          { key: 'level3', label: 'Level 3', count: data?.counts?.level3 || 0 },
        ].map((l) => (
          <button
            key={l.key}
            onClick={() => setTab(l.key)}
            className={`rounded-xl p-4 text-center transition ${
              tab === l.key ? 'bg-green-500 text-black font-semibold' : 'glass hover:border-green-500/40'
            }`}
          >
            <div className="text-2xl font-bold">{l.count}</div>
            <div className="text-xs mt-1 opacity-80">{l.label}</div>
          </button>
        ))}
      </div>

      {/* Members list */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          {tab.replace('level', 'Level ')} Members
        </h2>
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">No members in this level yet</p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m._id} className="bg-black/30 rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{m.username}</div>
                  <div className="text-xs text-gray-500">
                    Joined {new Date(m.createdAt).toLocaleDateString()}
                    {m.totalInvested > 0 && ` • Invested ${m.totalInvested.toLocaleString()} Rs`}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${m.isVerified || m.totalInvested > 0 ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-400'}`}>
                  {m.isVerified || m.totalInvested > 0 ? 'Active' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
