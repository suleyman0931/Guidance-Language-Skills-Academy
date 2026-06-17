'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { registrationApi, authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function AccountSetupInner() {
  const { lang } = useLang();
  const t = dict[lang].setup;
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuthStore();

  const rid      = params.get('rid') || '';
  const rawName  = params.get('name') || '';
  const defUser  = params.get('username') || '';

  const [username, setUsername] = useState(defUser);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(false);
  const [userTaken, setUserTaken] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string }>({});

  // Debounced username check
  const checkUsername = useCallback(async (u: string) => {
    if (!u || u.length < 3) return;
    setChecking(true);
    try {
      const res = await registrationApi.checkUsername(u);
      setUserTaken(!res.data.available);
    } catch { setUserTaken(false); }
    finally { setChecking(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { if (username) checkUsername(username); }, 600);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!username.trim() || username.length < 3) errs.username = 'Username must be at least 3 characters.';
    if (userTaken) errs.username = t.usernameErr;
    if (password.length < 8) errs.password = t.passwordShort;
    if (password !== confirm) errs.confirm = t.passwordMismatch;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registrationApi.setupAccount({
        registration_id: Number(rid),
        username,
        password,
        password_confirmation: confirm,
      });
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success(lang === 'am' ? 'መለያዎ ተፈጥሯል!' : 'Account created successfully!');
      router.push('/home');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6b,#0D1B4B)' }}>
      <div className="w-full max-w-md animate-fsu">

        {/* Success icon at top */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#C4A84F,#F0D080)', boxShadow: '0 12px 32px rgba(196,168,79,0.3)' }}>
            🎉
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{t.title}</h1>
          <p className="text-white/60 text-sm">{t.sub}</p>
          {rawName && (
            <p className="text-sm font-semibold mt-2" style={{ color: '#C4A84F' }}>{rawName}</p>
          )}
        </div>

        {/* Form card */}
        <div className="glass p-7">
          {/* Username */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#C4A84F' }}>
              {t.usernameLabel}
            </label>
            <div className="relative">
              <input
                className="input-field pr-10"
                value={username}
                onChange={e => { setUsername(e.target.value); setErrors(er => ({ ...er, username: '' })); setUserTaken(false); }}
                placeholder={t.usernamePh}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {checking ? '⌛' : username.length >= 3 ? (userTaken ? '❌' : '✅') : ''}
              </span>
            </div>
            <p className="text-white/40 text-xs mt-1">{t.usernameSub}</p>
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            {userTaken && !errors.username && <p className="text-red-400 text-xs mt-1">{t.usernameErr}</p>}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#C4A84F' }}>
              {t.passwordLabel}
            </label>
            <div className="relative">
              <input
                className="input-field pr-10"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: '' })); }}
                placeholder={t.passwordPh}
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {/* Strength bar */}
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
                <span className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm */}
          <div className="mb-7">
            <label className="block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#C4A84F' }}>
              {t.confirmLabel}
            </label>
            <input
              className="input-field"
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setErrors(er => ({ ...er, confirm: '' })); }}
              placeholder={t.confirmPh}
            />
            {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button onClick={handleSubmit} disabled={loading || userTaken}
            className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2">
            {loading
              ? <><Spinner /> {t.submitting}</>
              : t.submit}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading…</div>}>
      <AccountSetupInner />
    </Suspense>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />;
}
