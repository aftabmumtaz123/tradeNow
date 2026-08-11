import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { History } from 'lucide-react';

export default function Transactions() {
  const { API } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/transactions')
      .then((r) => setTransactions(r.data.transactions || []))
      .finally(() => setLoading(false));
  }, []);

  const typeLabel = (t) => {
    const map = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      profit: 'Daily Profit',
      referral_bonus: 'Referral Bonus',
      plan_purchase: 'Plan Purchase',
    };
    return map[t] || t;
  };

  const typeColor = (t, amount) => {
    if (t === 'withdrawal' || amount < 0) return 'text-red-400';
    if (t === 'profit' || t === 'referral_bonus') return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-gray-400 text-sm mt-1">All your account activity</p>
      </div>

      <div className="glass rounded-2xl p-5">
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-black/30 rounded-xl px-4 py-3 flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm">{typeLabel(tx.type)}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {tx.description || '—'} • {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-semibold ${typeColor(tx.type, tx.amount)}`}>
                    {tx.amount > 0 ? '+' : ''}
                    {Number(tx.amount).toLocaleString()} Rs
                  </div>
                  <div className="text-xs text-gray-500">
                    Bal: {Number(tx.balanceAfter).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
