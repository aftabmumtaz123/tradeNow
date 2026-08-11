import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Star } from 'lucide-react';

export default function Plans() {
  const { API, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/plans')
      .then((r) => setPlans(r.data.plans || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleInvest = (plan) => {
    if (!user) {
      navigate('/register');
      return;
    }
    navigate(`/dashboard/deposit?plan=${plan._id}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Simple top bar */}
      <header className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold">
              <span className="text-green-400">AL ZAHRA</span> TRADE
            </span>
          </Link>
          <div className="flex gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary px-5 py-2 rounded-full text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-sm text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2 rounded-full text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase text-center mb-3">
            Investment Plans
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Choose the plan that fits you
          </h1>

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No plans available yet. Start the backend and run <code className="text-green-400">npm run seed</code>.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="glass rounded-2xl p-6 border border-green-500/15 hover:border-green-500/40 transition flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold bg-green-500 text-black px-3 py-1 rounded-full">
                      AVAILABLE
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-6">{plan.name}</h2>

                  <div className="space-y-3 text-sm flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Investment</span>
                      <span className="font-semibold">{plan.investment.toLocaleString()} Rs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Daily Profit</span>
                      <span className="font-semibold text-green-400">
                        {plan.dailyProfit.toLocaleString()} Rs
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Return</span>
                      <span className="font-semibold">{plan.totalReturn.toLocaleString()} Rs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duration</span>
                      <span className="font-semibold">{plan.duration} Days</span>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-gray-400 text-xs">Referral Bonus</span>
                      <div className="text-xs mt-1 text-gray-300">
                        Level 1: {plan.referralBonus?.level1 || 13}% | Level 2:{' '}
                        {plan.referralBonus?.level2 || 3}% | Level 3:{' '}
                        {plan.referralBonus?.level3 || 1}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInvest(plan)}
                    className="btn-primary w-full mt-6 py-3 rounded-xl font-semibold"
                  >
                    Invest Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
