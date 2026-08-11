import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { API } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/users/admin/all', { params: { search: search || undefined } })
      .then((r) => setUsers(r.data.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try {
      const { data } = await API.put(`/users/admin/${id}/toggle`);
      toast.success(data.message);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username, email..."
            className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500"
          />
          <button onClick={load} className="btn-primary px-4 py-2 rounded-xl text-sm">Search</button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Loading...</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="glass rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium">
                  {u.username}{' '}
                  {u.role === 'admin' && <span className="text-xs text-purple-400">(admin)</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {u.email} {u.phone && `• ${u.phone}`}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Bal: {Number(u.balance || 0).toLocaleString()} Rs • Invested:{' '}
                  {Number(u.totalInvested || 0).toLocaleString()} Rs
                  {u.currentPlan && ` • Plan: ${u.currentPlan.name}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                  {u.isActive ? 'Active' : 'Disabled'}
                </span>
                {u.role !== 'admin' && (
                  <button
                    onClick={() => toggle(u._id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
