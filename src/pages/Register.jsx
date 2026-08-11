import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    referralCode: searchParams.get('ref') || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-green-400">AL ZAHRA</span> TRADE
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-400 mt-1">Start investing with clarity</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Username *</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="yourusername"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="03xxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Referral Code</label>
            <input
              name="referralCode"
              value={form.referralCode}
              onChange={handleChange}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              placeholder="Optional"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
