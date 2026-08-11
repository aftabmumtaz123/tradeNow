import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Copy, Check, Upload, CreditCard } from 'lucide-react';

export default function Deposit() {
  const { API, settings, refreshSettings } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // Always get latest settings when opening Deposit
    if (refreshSettings) refreshSettings();
    API.get('/plans').then((r) => {
      setPlans(r.data.plans || []);
      const planId = searchParams.get('plan');
      if (planId) {
        const p = (r.data.plans || []).find((x) => x._id === planId);
        if (p) setSelectedPlan(p);
      }
    });
  }, []);

  const paymentAccounts = settings?.paymentAccounts || [];

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied!');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async () => {
    if (!selectedPlan || !transactionId || !screenshot || !selectedMethod) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('planId', selectedPlan._id);
      form.append('transactionId', transactionId);
      form.append('paymentMethod', selectedMethod.method || 'easypaisa');
      form.append('screenshot', screenshot);
      await API.post('/deposits', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Deposit request submitted! Waiting for admin approval.');
      navigate('/dashboard/deposit-history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Select a Plan to Deposit</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p._id}
              className="glass rounded-2xl p-5 hover:border-green-500/50 transition cursor-pointer"
              onClick={() => setSelectedPlan(p)}
            >
              <div className="text-xs text-green-400 font-medium mb-1">AVAILABLE</div>
              <h3 className="text-xl font-bold mb-4">{p.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment</span>
                  <span>{Number(p.investment).toLocaleString()} Rs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Profit</span>
                  <span className="text-green-400">{Number(p.dailyProfit).toLocaleString()} Rs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span>{p.duration} Days</span>
                </div>
              </div>
              <button className="btn-primary w-full mt-4 py-2.5 rounded-xl">Invest Now</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-green rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-green-400/80 uppercase tracking-wider">PAYMENT</div>
          <h1 className="text-xl font-bold mt-1">
            {step === 1
              ? 'Select Payment Method'
              : `Deposit with ${selectedMethod?.method || 'Easypaisa'}`}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
      </div>

      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          {paymentAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-2">No payment methods configured yet.</p>
              <p className="text-sm">Admin must add an Easypaisa / JazzCash account in Settings.</p>
            </div>
          ) : (
            paymentAccounts.map((acc, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 py-4 border border-white/5 rounded-2xl hover:border-green-500/40 transition cursor-pointer"
                onClick={() => {
                  setSelectedMethod(acc);
                  setStep(2);
                }}
              >
                <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center px-3 overflow-hidden">
                  {acc.image ? (
                    <img src={acc.image} alt={acc.method} className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-green-600 capitalize">{acc.method}</span>
                  )}
                </div>
                <span className="text-green-400 font-semibold capitalize">{acc.method}</span>
                <button className="btn-primary w-full max-w-xs py-3 rounded-full text-base">
                  Deposit Now
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {step >= 2 && selectedMethod && (
        <>
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">📋</div>
              PAYMENT SUMMARY — Review your deposit details
            </div>
            <div className="space-y-3">
              <div className="bg-black/40 rounded-xl px-4 py-3 flex justify-between">
                <span className="text-gray-400 text-sm">Selected Plan</span>
                <span className="font-semibold">{selectedPlan.name}</span>
              </div>
              <div className="bg-black/40 rounded-xl px-4 py-3 flex justify-between">
                <span className="text-gray-400 text-sm">Payable Amount</span>
                <span className="font-semibold text-green-400">
                  {Number(selectedPlan.investment).toLocaleString()} Rs
                </span>
              </div>
              <div className="bg-black/40 rounded-xl px-4 py-3 flex justify-between">
                <span className="text-gray-400 text-sm">Payment Method</span>
                <span className="font-semibold capitalize">{selectedMethod.method}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-3">
            <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                  #
                </div>
                <div>
                  <div className="text-xs text-gray-400">ACCOUNT NUMBER</div>
                  <div className="font-mono font-semibold">{selectedMethod.accountNumber}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copy(selectedMethod.accountNumber, 'num')}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                {copied === 'num' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  👤
                </div>
                <div>
                  <div className="text-xs text-gray-400">ACCOUNT NAME</div>
                  <div className="font-semibold">{selectedMethod.accountName}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copy(selectedMethod.accountName, 'name')}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                {copied === 'name' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="bg-black/40 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-400 mb-1">Total Amount to Send</div>
              <div className="text-2xl font-bold text-green-400">
                {Number(selectedPlan.investment).toLocaleString()} Rs
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Upload Screenshot <span className="text-red-400">*</span>
              </label>
              <label className="border-2 border-dashed border-green-900/50 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-green-500/50 transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFile}
                />
                {preview ? (
                  <img src={preview} alt="preview" className="max-h-40 rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-500" />
                    <span className="text-gray-400">Choose Screenshot</span>
                    <span className="text-xs text-gray-600">JPG, PNG allowed</span>
                  </>
                )}
              </label>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Enter transaction ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction id"
                className="w-full bg-black/40 border border-green-900/30 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
