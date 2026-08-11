import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';

export default function AdminSettings() {
  const { API } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then((r) => setSettings(r.data.settings))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/settings', settings);
      setSettings(data.settings);
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addAccount = () => {
    setSettings({
      ...settings,
      paymentAccounts: [
        ...(settings.paymentAccounts || []),
        { method: 'easypaisa', accountNumber: '', accountName: '', isActive: true },
      ],
    });
  };

  const updateAccount = (i, field, value) => {
    const accounts = [...(settings.paymentAccounts || [])];
    accounts[i] = { ...accounts[i], [field]: value };
    setSettings({ ...settings, paymentAccounts: accounts });
  };

  const removeAccount = (i) => {
    const accounts = [...(settings.paymentAccounts || [])];
    accounts.splice(i, 1);
    setSettings({ ...settings, paymentAccounts: accounts });
  };

  if (loading || !settings) {
    return <div className="text-center py-20 text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button onClick={save} disabled={saving} className="btn-primary px-5 py-2 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Site info */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold">Site Information</h2>
        <div>
          <label className="text-sm text-gray-400 block mb-1">Site Name</label>
          <input
            value={settings.siteName || ''}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-1">Logo URL</label>
          <input
            value={settings.siteLogo || ''}
            onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
            placeholder="https://... or upload via Cloudinary"
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-1">Landing Headline</label>
          <input
            value={settings.landingHeadline || ''}
            onChange={(e) => setSettings({ ...settings, landingHeadline: e.target.value })}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-1">Landing Subheadline</label>
          <textarea
            value={settings.landingSubheadline || ''}
            onChange={(e) => setSettings({ ...settings, landingSubheadline: e.target.value })}
            rows={2}
            className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Min Withdrawal (Rs)</label>
            <input
              type="number"
              value={settings.minWithdrawal || 500}
              onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Support WhatsApp</label>
            <input
              value={settings.supportWhatsapp || ''}
              onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
              placeholder="923xxxxxxxxx"
              className="w-full bg-black/40 border border-green-900/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Payment accounts */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Payment Accounts (shown on Deposit)</h2>
          <button onClick={addAccount} className="text-sm text-green-400 flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {(settings.paymentAccounts || []).map((acc, i) => (
          <div key={i} className="bg-black/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <select
                value={acc.method}
                onChange={(e) => updateAccount(i, 'method', e.target.value)}
                className="bg-black/40 border border-green-900/40 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="easypaisa">Easypaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="bank">Bank</option>
              </select>
              <button onClick={() => removeAccount(i)} className="text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              value={acc.accountNumber}
              onChange={(e) => updateAccount(i, 'accountNumber', e.target.value)}
              placeholder="Account Number"
              className="w-full bg-black/40 border border-green-900/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <input
              value={acc.accountName}
              onChange={(e) => updateAccount(i, 'accountName', e.target.value)}
              placeholder="Account Name"
              className="w-full bg-black/40 border border-green-900/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={acc.isActive}
                onChange={(e) => updateAccount(i, 'isActive', e.target.checked)}
              />
              Active
            </label>
          </div>
        ))}
        {(settings.paymentAccounts || []).length === 0 && (
          <p className="text-gray-500 text-sm">No payment accounts. Add Easypaisa account for deposits.</p>
        )}
      </div>
    </div>
  );
}
