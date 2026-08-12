import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, settings } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            {settings?.siteLogo ? (
              <img src={settings.siteLogo} alt="logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight">
              {settings?.siteName || 'AL ZAHRA TRADE'}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn-primary px-5 py-2 rounded-full text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2 rounded-full text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Simple. Clear. Built for Growth.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 whitespace-pre-line">
              {settings?.landingHeadline || 'Invest with\nclarity and\nconfidence.'}
            </h1>
            <p className="text-gray-400 text-lg max-w-lg mb-8 leading-relaxed">
              {settings?.landingSubheadline ||
                'Create your account, choose a plan and manage deposits, withdrawals, profit history and referral rewards.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="btn-primary px-8 py-3.5 rounded-full text-base inline-flex items-center gap-2"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-full text-base font-medium border border-white/15 hover:bg-white/5 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right feature card */}
          <div className="glass rounded-3xl p-6 md:p-8 border border-green-500/20">
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-2">
              Everything in one place
            </p>
            <h2 className="text-xl font-semibold mb-6">A cleaner member experience</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Transparent plans</h3>
                  <p className="text-sm text-gray-400">
                    Investment and return details stay easy to read.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast account actions</h3>
                  <p className="text-sm text-gray-400">
                    Deposit and withdrawal links are always within reach.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Referral tracking</h3>
                  <p className="text-sm text-gray-400">
                    Share your link and review team activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans teaser */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Investment Plans
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the plan that fits you
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            Transparent daily profits, fixed duration, and multi-level referral bonuses.
          </p>
          <Link
            to="/plans"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base"
          >
            View All Plans
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {settings?.siteName || 'AL ZAHRA TRADE'}. All rights reserved.
      </footer>
    </div>
  );
}
