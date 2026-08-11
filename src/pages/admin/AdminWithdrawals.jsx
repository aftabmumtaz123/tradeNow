import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Check, X, Banknote } from 'lucide-react';

export default function AdminWithdrawals() {
  const { API } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    API.get('/withdrawals/admin/all', { params })
      .then((r) => setWithdrawals(r.data.withdrawals || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const markPaid = async (id) => {
    if (!confirm('Confirm you have sent the payment to the user?')) return;
    try {
      await API.put(`/withdrawals/admin/${id}/paid`);
      toast.success('Marked as paid');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  const reject = async (id) => {
    const note = prompt('Rejection reason (optional):') || '';
    try {
      await API.put(`/withdrawals/admin/${id}/reject`, { note });
      toast.success('Rejected — amount refunded to user');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  const statusCls = (s) =>
    s === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
    s === 'paid' ? 'bg-green-500/15 text-green-400' :
    'bg-red-500/15 text-red-400';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Withdrawals</h1>
          <p className="text-muted text-sm mt-1">
            User requests stay <strong className="text-yellow-400">Pending</strong> until you mark them{' '}
            <strong className="text-green-400">Paid</strong>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'paid', 'rejected', ''].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                filter === s ? 'bg-green-500 text-black font-semibold' : 'glass-morph'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : withdrawals.length === 0 ? (
        <div className="glass-morph rounded-2xl p-12 text-center text-muted">No withdrawals found</div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div key={w._id} className="glass-morph rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold">{w.user?.username || 'User'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusCls(w.status)}`}>
                    {w.status}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  {Number(w.amount).toLocaleString()} Rs
                </div>
                <div className="text-sm text-muted mt-1">
                  {w.paymentMethod} · {w.accountNumber} · {w.accountName}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  Requested {new Date(w.createdAt).toLocaleString()}
                  {w.paidAt && ` · Paid ${new Date(w.paidAt).toLocaleString()}`}
                </div>
                {w.adminNote && (
                  <div className="text-xs text-muted mt-1">Note: {w.adminNote}</div>
                )}
              </div>

              {w.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => markPaid(w._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm font-medium"
                  >
                    <Banknote className="w-4 h-4" />
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => reject(w._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
              {w.status === 'paid' && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="w-4 h-4" /> Paid
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
