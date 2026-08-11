import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const empty = {
  name: '', investment: '', dailyProfit: '', totalReturn: '', duration: 60,
  referralBonus: { level1: 13, level2: 3, level3: 1 }, isActive: true, order: 0,
};

export default function AdminPlans() {
  const { API } = useAuth();
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => API.get('/plans').then((r) => setPlans(r.data.plans || []));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        investment: Number(form.investment),
        dailyProfit: Number(form.dailyProfit),
        totalReturn: Number(form.totalReturn),
        duration: Number(form.duration),
        order: Number(form.order) || 0,
      };
      if (editing) {
        await API.put(`/plans/${editing}`, payload);
        toast.success('Plan updated');
      } else {
        await API.post('/plans', payload);
        toast.success('Plan created');
      }
      setShowForm(false);
      setEditing(null);
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const edit = (p) => {
    setForm({
      name: p.name,
      investment: p.investment,
      dailyProfit: p.dailyProfit,
      totalReturn: p.totalReturn,
      duration: p.duration,
      referralBonus: p.referralBonus || { level1: 13, level2: 3, level3: 1 },
      isActive: p.isActive,
      order: p.order || 0,
    });
    setEditing(p._id);
    setShowForm(true);
  };

  const remove = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await API.delete(`/plans/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plans</h1>
        <button
          onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">{editing ? 'Edit Plan' : 'New Plan'}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Name (e.g. ZAHRA-01)" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
            <input required type="number" placeholder="Investment" value={form.investment}
              onChange={(e) => setForm({ ...form, investment: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
            <input required type="number" placeholder="Daily Profit" value={form.dailyProfit}
              onChange={(e) => setForm({ ...form, dailyProfit: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
            <input required type="number" placeholder="Total Return" value={form.totalReturn}
              onChange={(e) => setForm({ ...form, totalReturn: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
            <input type="number" placeholder="Duration (days)" value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
            <input type="number" placeholder="Order" value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary px-5 py-2 rounded-xl text-sm">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm bg-white/5">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {plans.map((p) => (
          <div key={p._id} className="glass rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">
                Invest {p.investment} • Daily {p.dailyProfit} • Total {p.totalReturn} • {p.duration} days
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(p)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(p._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
