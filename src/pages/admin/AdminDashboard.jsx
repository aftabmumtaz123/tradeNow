import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users, CreditCard, ArrowUpFromLine, TrendingUp, Wallet, Layers,
} from 'lucide-react';

function BarChart({ data, valueKey = 'users', labelKey = 'date' }) {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return (
    <div className="bar-chart pt-2 pb-6">
      {data.map((d, i) => (
        <div
          key={i}
          className="bar"
          style={{ height: `${Math.max(4, ((d[valueKey] || 0) / max) * 100)}%` }}
          title={`${d[labelKey]}: ${d[valueKey]}`}
        >
          <span className="bar-label">
            {String(d[labelKey]).slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DonutStatus({ items }) {
  const total = items.reduce((s, i) => s + (i.value || 0), 0) || 1;
  const colors = ['#eab308', '#22c55e', '#ef4444'];
  let acc = 0;
  const segments = items.map((item, i) => {
    const start = (acc / total) * 360;
    acc += item.value || 0;
    const end = (acc / total) * 360;
    return { ...item, start, end, color: colors[i % colors.length] };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
    .join(', ');

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-28 h-28 rounded-full shrink-0"
        style={{
          background: `conic-gradient(${gradient || '#333 0deg 360deg'})`,
          mask: 'radial-gradient(circle at center, transparent 48%, black 50%)',
          WebkitMask: 'radial-gradient(circle at center, transparent 48%, black 50%)',
        }}
      />
      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
            <span className="text-muted">{item.name}</span>
            <span className="font-semibold ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { API } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    API.get('/users/admin/stats')
      .then((r) => {
        setStats(r.data.stats);
        setCharts(r.data.charts);
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'from-blue-500 to-cyan-400', to: '/admin/users' },
    { label: 'Active Plans', value: stats?.activePlans ?? '—', icon: Layers, color: 'from-green-500 to-emerald-400', to: '/admin/plans' },
    { label: 'Pending Deposits', value: stats?.pendingDeposits ?? '—', icon: CreditCard, color: 'from-yellow-500 to-amber-400', to: '/admin/deposits' },
    { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals ?? '—', icon: ArrowUpFromLine, color: 'from-orange-500 to-red-400', to: '/admin/deposits' },
    { label: 'Total Invested', value: stats ? `${Number(stats.totalInvested).toLocaleString()} Rs` : '—', icon: Wallet, color: 'from-purple-500 to-pink-400' },
    { label: 'Total Profit Paid', value: stats ? `${Number(stats.totalProfit).toLocaleString()} Rs` : '—', icon: TrendingUp, color: 'from-green-400 to-lime-300' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted text-sm mt-1">Platform overview and performance</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to || '#'}
            className="glass-morph rounded-2xl p-5 block group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted">{c.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-morph rounded-2xl p-5">
          <h3 className="font-semibold mb-1">New Users (7 days)</h3>
          <p className="text-xs text-muted mb-4">Daily registrations</p>
          {charts?.usersByDay ? (
            <BarChart data={charts.usersByDay} valueKey="users" />
          ) : (
            <div className="h-36 flex items-center justify-center text-muted text-sm">Loading chart...</div>
          )}
        </div>

        <div className="glass-morph rounded-2xl p-5">
          <h3 className="font-semibold mb-1">Deposit Volume (7 days)</h3>
          <p className="text-xs text-muted mb-4">Number of deposit requests</p>
          {charts?.depositsByDay ? (
            <BarChart data={charts.depositsByDay} valueKey="count" />
          ) : (
            <div className="h-36 flex items-center justify-center text-muted text-sm">Loading chart...</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-morph rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Deposits by Status</h3>
          {charts?.depositsByStatus ? (
            <DonutStatus items={charts.depositsByStatus} />
          ) : (
            <div className="text-muted text-sm">Loading...</div>
          )}
        </div>

        <div className="glass-morph rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <Link to="/admin/deposits" className="block p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-app transition">
            <div className="font-medium">Review pending deposits</div>
            <div className="text-xs text-muted mt-0.5">{stats?.pendingDeposits || 0} waiting for approval</div>
          </Link>
          <Link to="/admin/settings" className="block p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-app transition">
            <div className="font-medium">Site settings & banners</div>
            <div className="text-xs text-muted mt-0.5">Logo, payment accounts, landing content</div>
          </Link>
          <Link to="/admin/plans" className="block p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-app transition">
            <div className="font-medium">Manage investment plans</div>
            <div className="text-xs text-muted mt-0.5">Create or edit plan packages</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
