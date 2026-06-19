'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const { lang } = useLang();
  const t = dict[lang].login;
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password) { setError(t.wrongCreds); return; }
    setLoading(true); setError('');
    try {
      const res = await authApi.login({ username, password });
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success(lang === 'am' ? 'እንኳን ደህና ገቡ!' : 'Welcome back!');
      router.push(user.is_admin ? '/admin' : '/home');
    } catch {
      setError(t.wrongCreds);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6b,#0D1B4B)' }}>
      <div className="w-full max-w-sm animate-fsu">
        <div className="text-center mb-8">
          <img src="/logo-icon.png" alt="Guidance Academy" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-1">{t.title}</h1>
          <p className="text-white/50 text-sm">{t.sub}</p>
        </div>

        <div className="glass p-7 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
              {t.username}
            </label>
            <input className="input-field" value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="suleymanA"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
              {t.password}
            </label>
            <div className="relative">
              <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg px-3 py-2 text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2">
            {loading ? <><Spinner /> {t.submitting}</> : t.submit}
          </button>

          <p className="text-center text-white/40 text-xs">
            <Link href="/register" style={{ color: '#C4A84F' }} className="hover:underline">
              {t.noAccount}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />;
}
