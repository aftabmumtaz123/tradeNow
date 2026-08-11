import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, CreditCard, ArrowUpFromLine, TrendingUp, Wallet, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const { API } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/users/admin/stats').then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-blue-400', to: '/admin/users' },
    { label: 'Active Plans', value: stats?.activePlans ?? '—', icon: Layers, color: 'text-green-400', to: '/admin/plans' },
    { label: 'Pending Deposits', value: stats?.pendingDeposits ?? '—', icon: CreditCard, color: 'text-yellow-400', to: '/admin/deposits' },
    { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals ?? '—', icon: ArrowUpFromLine, color: 'text-orange-400', to: '/admin/deposits' },
    { label: 'Total Invested', value: stats ? `${Number(stats.totalInvested).toLocaleString()} Rs` : '—', icon: Wallet, color: 'text-purple-400' },
    { label: 'Total Profit Paid', value: stats ? `${Number(stats.totalProfit).toLocaleString()} Rs` : '—', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of the platform</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to || '#'}
            className="glass rounded-xl p-5 hover:border-green-500/30 transition block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{c.label}</span>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/deposits" className="glass rounded-xl p-5 hover:border-yellow-500/30 transition">
          <h3 className="font-semibold mb-1">Review Deposits</h3>
          <p className="text-sm text-gray-400">Approve or reject pending payment proofs</p>
        </Link>
        <Link to="/admin/settings" className="glass rounded-xl p-5 hover:border-green-500/30 transition">
          <h3 className="font-semibold mb-1">Settings</h3>
          <p className="text-sm text-gray-400">Logo, payment accounts, banners, site name</p>
        </Link>
      </div>
    </div>
  );
}
