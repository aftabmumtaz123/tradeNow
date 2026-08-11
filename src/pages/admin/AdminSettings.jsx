import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, Upload, Image as ImageIcon } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'payments', label: 'Payment Accounts' },
  { id: 'banners', label: 'Banners' },
  { id: 'content', label: 'Landing Content' },
  { id: 'support', label: 'Support & Limits' },
];

export default function AdminSettings() {
  const { API, refreshSettings } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('general');
  const [uploading, setUploading] = useState(false);

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
      if (refreshSettings) await refreshSettings();
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file, onUrl) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await API.post('/settings/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUrl(data.url);
      toast.success('Image uploaded');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed — set Cloudinary env vars');
    } finally {
      setUploading(false);
    }
  };

  // Payment accounts helpers
  const addAccount = () => {
    setSettings({
      ...settings,
      paymentAccounts: [
        ...(settings.paymentAccounts || []),
        { method: 'easypaisa', accountNumber: '', accountName: '', image: '', instructions: '', isActive: true },
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

  // Banners helpers
  const addBanner = () => {
    setSettings({
      ...settings,
      banners: [
        ...(settings.banners || []),
        { title: '', subtitle: '', image: '', link: '', placement: 'dashboard', isActive: true, order: (settings.banners || []).length },
      ],
    });
  };
  const updateBanner = (i, field, value) => {
    const banners = [...(settings.banners || [])];
    banners[i] = { ...banners[i], [field]: value };
    setSettings({ ...settings, banners });
  };
  const removeBanner = (i) => {
    const banners = [...(settings.banners || [])];
    banners.splice(i, 1);
    setSettings({ ...settings, banners });
  };

  if (loading || !settings) {
    return <div className="text-center py-20 text-muted">Loading settings...</div>;
  }

  const inputCls =
    'w-full bg-black/20 border border-app rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 transition text-app';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted text-sm">Control site branding, payments, banners & more</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 self-start"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${
              tab === t.id ? 'nav-active' : 'glass-morph text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {tab === 'general' && (
        <div className="glass-morph rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold">Site Identity</h2>
          <div>
            <label className="text-sm text-muted block mb-1">Site Name</label>
            <input value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Logo URL</label>
            <div className="flex gap-2">
              <input value={settings.siteLogo || ''} onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })} placeholder="https://..." className={inputCls} />
              <label className="btn-primary px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={(e) => uploadFile(e.target.files?.[0], (url) => setSettings({ ...settings, siteLogo: url }))} />
              </label>
            </div>
            {settings.siteLogo && (
              <img src={settings.siteLogo} alt="logo" className="mt-3 h-14 rounded-xl object-contain bg-black/20 p-2" />
            )}
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Primary Color</label>
            <input type="color" value={settings.primaryColor || '#22c55e'}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="h-10 w-20 rounded-lg cursor-pointer bg-transparent" />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Default Theme</label>
            <select value={settings.themeDefault || 'dark'}
              onChange={(e) => setSettings({ ...settings, themeDefault: e.target.value })}
              className={inputCls}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
            Maintenance mode
          </label>
          {settings.maintenanceMode && (
            <textarea value={settings.maintenanceMessage || ''}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              rows={2} className={inputCls} placeholder="Maintenance message" />
          )}
        </div>
      )}

      {/* PAYMENTS */}
      {tab === 'payments' && (
        <div className="glass-morph rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Payment Accounts</h2>
            <button onClick={addAccount} className="text-sm text-green-500 flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Account
            </button>
          </div>
          <p className="text-xs text-muted">These appear on the user Deposit page. You can attach a logo/image per method.</p>

          {(settings.paymentAccounts || []).map((acc, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3 border border-app bg-black/10">
              <div className="flex justify-between items-center gap-2">
                <select value={acc.method} onChange={(e) => updateAccount(i, 'method', e.target.value)}
                  className="bg-black/20 border border-app rounded-lg px-3 py-1.5 text-sm">
                  <option value="easypaisa">Easypaisa</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="bank">Bank</option>
                  <option value="other">Other</option>
                </select>
                <button onClick={() => removeAccount(i)} className="text-red-400 p-1.5 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={acc.accountNumber} onChange={(e) => updateAccount(i, 'accountNumber', e.target.value)}
                placeholder="Account Number" className={inputCls} />
              <input value={acc.accountName} onChange={(e) => updateAccount(i, 'accountName', e.target.value)}
                placeholder="Account Name" className={inputCls} />
              <div>
                <label className="text-xs text-muted block mb-1">Method Image / Logo</label>
                <div className="flex gap-2 items-center">
                  <input value={acc.image || ''} onChange={(e) => updateAccount(i, 'image', e.target.value)}
                    placeholder="Image URL" className={inputCls} />
                  <label className="p-2.5 rounded-xl glass-morph cursor-pointer shrink-0">
                    <ImageIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={(e) => uploadFile(e.target.files?.[0], (url) => updateAccount(i, 'image', url))} />
                  </label>
                </div>
                {acc.image && <img src={acc.image} alt="" className="mt-2 h-12 rounded-lg object-contain bg-white/5 p-1" />}
              </div>
              <textarea value={acc.instructions || ''} onChange={(e) => updateAccount(i, 'instructions', e.target.value)}
                placeholder="Optional instructions for users" rows={2} className={inputCls} />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={acc.isActive !== false}
                  onChange={(e) => updateAccount(i, 'isActive', e.target.checked)} />
                Active (shown on Deposit)
              </label>
            </div>
          ))}
          {(settings.paymentAccounts || []).length === 0 && (
            <p className="text-muted text-sm py-4 text-center">No accounts yet. Add Easypaisa or JazzCash.</p>
          )}
        </div>
      )}

      {/* BANNERS */}
      {tab === 'banners' && (
        <div className="glass-morph rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Banners</h2>
            <button onClick={addBanner} className="text-sm text-green-500 flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>
          <p className="text-xs text-muted">Show promotional banners on landing and/or user dashboard.</p>

          {(settings.banners || []).map((b, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3 border border-app bg-black/10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Banner #{i + 1}</span>
                <button onClick={() => removeBanner(i)} className="text-red-400 p-1.5 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={b.title || ''} onChange={(e) => updateBanner(i, 'title', e.target.value)}
                placeholder="Title" className={inputCls} />
              <input value={b.subtitle || ''} onChange={(e) => updateBanner(i, 'subtitle', e.target.value)}
                placeholder="Subtitle" className={inputCls} />
              <div>
                <label className="text-xs text-muted block mb-1">Banner Image</label>
                <div className="flex gap-2">
                  <input value={b.image || ''} onChange={(e) => updateBanner(i, 'image', e.target.value)}
                    placeholder="Image URL" className={inputCls} />
                  <label className="p-2.5 rounded-xl glass-morph cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={(e) => uploadFile(e.target.files?.[0], (url) => updateBanner(i, 'image', url))} />
                  </label>
                </div>
                {b.image && <img src={b.image} alt="" className="mt-2 w-full max-h-32 object-cover rounded-xl" />}
              </div>
              <input value={b.link || ''} onChange={(e) => updateBanner(i, 'link', e.target.value)}
                placeholder="Link URL (optional)" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted block mb-1">Placement</label>
                  <select value={b.placement || 'dashboard'} onChange={(e) => updateBanner(i, 'placement', e.target.value)}
                    className={inputCls}>
                    <option value="landing">Landing only</option>
                    <option value="dashboard">Dashboard only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Order</label>
                  <input type="number" value={b.order ?? i} onChange={(e) => updateBanner(i, 'order', Number(e.target.value))}
                    className={inputCls} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={b.isActive !== false}
                  onChange={(e) => updateBanner(i, 'isActive', e.target.checked)} />
                Active
              </label>
            </div>
          ))}
          {(settings.banners || []).length === 0 && (
            <p className="text-muted text-sm py-4 text-center">No banners. Add one to promote plans or offers.</p>
          )}
        </div>
      )}

      {/* CONTENT */}
      {tab === 'content' && (
        <div className="glass-morph rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold">Landing Page Content</h2>
          <div>
            <label className="text-sm text-muted block mb-1">Headline</label>
            <input value={settings.landingHeadline || ''} onChange={(e) => setSettings({ ...settings, landingHeadline: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Subheadline</label>
            <textarea value={settings.landingSubheadline || ''} onChange={(e) => setSettings({ ...settings, landingSubheadline: e.target.value })}
              rows={3} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Meta Title (SEO)</label>
            <input value={settings.metaTitle || ''} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Meta Description</label>
            <textarea value={settings.metaDescription || ''} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              rows={2} className={inputCls} />
          </div>
        </div>
      )}

      {/* SUPPORT */}
      {tab === 'support' && (
        <div className="glass-morph rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold">Support & Withdrawal Limits</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted block mb-1">Support Email</label>
              <input value={settings.supportEmail || ''} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">WhatsApp</label>
              <input value={settings.supportWhatsapp || ''} onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                placeholder="923xxxxxxxxx" className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Phone</label>
              <input value={settings.supportPhone || ''} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Min Withdrawal (Rs)</label>
              <input type="number" value={settings.minWithdrawal || 500}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Max Withdrawal (Rs)</label>
              <input type="number" value={settings.maxWithdrawal || 500000}
                onChange={(e) => setSettings({ ...settings, maxWithdrawal: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.referralEnabled !== false}
              onChange={(e) => setSettings({ ...settings, referralEnabled: e.target.checked })} />
            Referral system enabled
          </label>
        </div>
      )}
    </div>
  );
}
