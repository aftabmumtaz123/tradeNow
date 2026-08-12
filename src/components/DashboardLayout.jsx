import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, Wallet, ArrowDownToLine, ArrowUpFromLine, 
  Users, Gift, History, LogOut, Menu, X, TrendingUp, Sun, Moon 
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/deposit', icon: Wallet, label: 'Deposit' },
  { to: '/dashboard/withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
  { to: '/dashboard/team', icon: Users, label: 'My Team' },
  { to: '/dashboard/transactions', icon: History, label: 'Transactions' },
  { to: '/dashboard/deposit-history', icon: History, label: 'Deposit History' },
];

export default function DashboardLayout() {
  const { user, logout, settings } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-green-900/30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-4 flex items-center gap-2 border-b border-green-900/30">
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
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}

              
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive ? 'nav-active' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-green-900/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur border-b border-green-900/20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block text-sm text-gray-400">
              AL ZAHRA TRADE
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-white/5" title="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-green-400">Verified member</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-black font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
