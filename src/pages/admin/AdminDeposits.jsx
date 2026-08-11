import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Check, X, Eye, Image as ImageIcon } from 'lucide-react';

export default function AdminDeposits() {
  const { API } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    const url = filter === 'pending' ? '/deposits/admin/pending' : `/deposits/admin/all?status=${filter}`;
    API.get(url).then(r => {
      setDeposits(r.data.deposits);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => {
    try {
      await API.put(`/deposits/admin/${id}/approve`);
      toast.success('Deposit approved & plan activated!');
      load();
      setSelected(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  const reject = async (id) => {
    const note = prompt('Rejection reason (optional):') || '';
    try {
      await API.put(`/deposits/admin/${id}/reject`, { note });
      toast.success('Deposit rejected');
      load();
      setSelected(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Deposit Requests</h1>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', ''].map(s => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === s ? 'bg-green-500 text-black font-semibold' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : deposits.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-gray-400">No deposits found</div>
      ) : (
        <div className="space-y-3">
          {deposits.map(d => (
            <div key={d._id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{d.user?.username}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    d.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{d.status}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Plan: <span className="text-white">{d.plan?.name}</span> • {d.amount} Rs • {d.paymentMethod}
                </div>
                <div className="text-xs text-gray-500 mt-1">TX: {d.transactionId} • {new Date(d.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                {d.screenshot && (
                  <a href={d.screenshot} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                    <ImageIcon className="w-5 h-5" />
                  </a>
                )}
                {d.status === 'pending' && (
                  <>
                    <button onClick={() => approve(d._id)} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => reject(d._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
