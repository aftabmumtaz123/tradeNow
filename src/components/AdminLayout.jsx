import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, CreditCard, Layers, Users, Settings, ArrowUpFromLine,
  LogOut, Menu, TrendingUp, Sun, Moon, Image,
} from 'lucide-react';
import { useState } from 'react';

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Analytics', end: true },
  { to: '/admin/deposits', icon: CreditCard, label: 'Deposits' },
  { to: '/admin/withdrawals', icon: ArrowUpFromLine, label: 'Withdrawals' },
  { to: '/admin/plans', icon: Layers, label: 'Plans' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout, settings } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app text-app flex">
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-elevated border-r border-app
        transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col`}
      >
        <div className="p-4 flex items-center gap-2 border-b border-app">
          {settings?.siteLogo ? (
            <img src={settings.siteLogo} alt="logo" className="w-9 h-9 rounded-xl object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
          )}
          <div>
            <div className="font-bold text-sm leading-tight">Admin Panel</div>
            <div className="text-[10px] text-muted">{settings?.siteName || 'AL ZAHRA TRADE'}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive ? 'nav-active' : 'text-muted hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-app space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-muted hover:bg-white/5"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-elevated/90 backdrop-blur border-b border-app px-4 py-3 flex items-center justify-between">
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-sm text-muted hidden sm:block">Admin · {user?.username}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-morph"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-black font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || 'A'}
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
