import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Image as ImageIcon } from 'lucide-react';

export default function DepositHistory() {
  const { API } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/deposits/my')
      .then((r) => setDeposits(r.data.deposits || []))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) =>
    s === 'pending' ? 'text-yellow-400 bg-yellow-500/15' :
    s === 'approved' ? 'text-green-400 bg-green-500/15' :
    'text-red-400 bg-red-500/15';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deposit History</h1>
        <p className="text-gray-400 text-sm mt-1">Your deposit requests and status</p>
      </div>

      <div className="glass rounded-2xl p-5">
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : deposits.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No deposits yet</p>
        ) : (
          <div className="space-y-3">
            {deposits.map((d) => (
              <div key={d._id} className="bg-black/30 rounded-xl px-4 py-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-medium">
                      {d.plan?.name || 'Plan'} — {Number(d.amount).toLocaleString()} Rs
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {d.paymentMethod} • TX: {d.transactionId}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {new Date(d.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.screenshot && (
                      <a
                        href={d.screenshot}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </a>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColor(d.status)}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
                {d.adminNote && (
                  <div className="text-xs text-gray-500 mt-2 border-t border-white/5 pt-2">
                    Note: {d.adminNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
