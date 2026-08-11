import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-green-400 text-sm font-medium tracking-wide">ZAHRA DASHBOARD</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">
          Welcome back, {user?.username || 'Member'}
        </h1>
      </div>

      {/* Balance Card */}
      <div className="glass-green rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Wallet className="w-4 h-4" />
              AVAILABLE BALANCE
            </div>
            <div className="text-4xl font-bold">
              {Number(user?.balance || 0).toLocaleString()}{' '}
              <span className="text-2xl text-green-400">Rs</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-green-400">
                {user?.isVerified ? 'Account active' : 'Pending verification'}
              </span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center opacity-80">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Total Invested</div>
          <div className="text-xl font-bold">{Number(user?.totalInvested || 0).toLocaleString()} Rs</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Total Profit</div>
          <div className="text-xl font-bold text-green-400">
            {Number(user?.totalProfit || 0).toLocaleString()} Rs
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Daily Profit</div>
          <div className="text-xl font-bold text-green-400">
            {Number(user?.dailyProfit || 0).toLocaleString()} Rs
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/deposit"
          className="glass rounded-xl p-5 flex items-center justify-between hover:border-green-500/40 transition group"
        >
          <div>
            <div className="font-semibold mb-1">Deposit / Invest</div>
            <div className="text-sm text-gray-400">Choose a plan and deposit via Easypaisa</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition" />
        </Link>
        <Link
          to="/dashboard/withdraw"
          className="glass rounded-xl p-5 flex items-center justify-between hover:border-green-500/40 transition group"
        >
          <div>
            <div className="font-semibold mb-1">Withdraw</div>
            <div className="text-sm text-gray-400">Request withdrawal to your account</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition" />
        </Link>
      </div>

      {/* Current Plan */}
      {user?.currentPlan ? (
        <div className="glass rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-2">Active Plan</div>
          <div className="font-semibold text-lg">
            {typeof user.currentPlan === 'object' ? user.currentPlan.name : 'Active Plan'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Daily profit: {Number(user.dailyProfit || 0).toLocaleString()} Rs
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center">
          <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No active plan</h3>
          <p className="text-sm text-gray-400 mb-4">
            Select a plan and complete deposit to start earning daily profits.
          </p>
          <Link to="/dashboard/deposit" className="btn-primary inline-block px-6 py-2.5 rounded-xl text-sm">
            Choose a Plan
          </Link>
        </div>
      )}
    </div>
  );
}
