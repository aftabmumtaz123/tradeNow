import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet, ArrowUpFromLine } from 'lucide-react';

export default function Withdraw() {
  const { API, user, settings, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const minWithdraw = settings?.minWithdrawal || 120;

  const loadHistory = () => {
    API.get('/withdrawals/my').then((r) => setHistory(r.data.withdrawals || [])).catch(() => {});
  };

  useEffect(() => { loadHistory(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < minWithdraw) {
      toast.error(`Minimum withdrawal is ${minWithdraw} Rs`);
      return;
    }
    if (num > (user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    if (!accountNumber.trim() || !accountName.trim()) {
      toast.error('Account number and name are required');
      return;
    }
    setLoading(true);
    try {
      await API.post('/withdrawals', {
        amount: num,
        paymentMethod,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      });
      toast.success('Withdrawal request submitted!');
      setAmount('');
      setAccountNumber('');
      setAccountName('');
      refreshUser?.();
      loadHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) =>
    s === 'pending' ? 'text-yellow-400 bg-yellow-500/15' :
    s === 'paid' || s === 'approved' || s === 'completed' ? 'text-green-400 bg-green-500/15' :
    'text-red-400 bg-red-500/15';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Withdraw</h1>
        <p className="text-gray-400 text-sm mt-1">Request withdrawal to your Easypaisa / JazzCash / Bank</p>
      </div>

      {/* Balance */}
      <div className="glass-green rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400 mb-1">Available Balance</div>
          <div className="text-3xl font-bold">
            {Number(user?.balance || 0).toLocaleString()} <span className="text-lg text-green-400">Rs</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-green-400" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="glass rounded-2xl p-5 md:p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Amount (Min {minWithdraw} Rs)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={minWithdraw}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            placeholder={`Min ${minWithdraw}`}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
          >
            <option value="easypaisa">Easypaisa</option>
            <option value="jazzcash">JazzCash</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Account Number *</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            placeholder="03xxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Account Name *</label>
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            placeholder="Full name on account"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowUpFromLine className="w-5 h-5" />
          {loading ? 'Submitting...' : 'Request Withdrawal'}
        </button>
      </form>

      {/* History */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Withdrawal History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No withdrawals yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((w) => (
              <div key={w._id} className="bg-black/30 rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{w.amount.toLocaleString()} Rs</div>
                  <div className="text-xs text-gray-500">
                    {w.paymentMethod} • {w.accountNumber} • {new Date(w.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColor(w.status)}`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
