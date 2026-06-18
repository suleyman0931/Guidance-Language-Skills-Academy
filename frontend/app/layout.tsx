'use client';
import './globals.css';
import { useState, createContext, useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { dict, type Lang } from '@/lib/dict';
import { authApi } from '@/lib/api';

export const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en', setLang: () => {},
});
export const useLang = () => useContext(LangCtx);

function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = dict[lang].nav;
  const { user, isAdmin, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    router.push('/');
  };

  const isActive = (p: string) => pathname === p;
  const close = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50"
      style={{ background: 'rgba(13,27,75,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(196,168,79,0.15)' }}>
      <div className="w-full px-6 py-0 flex items-center justify-between" style={{ height: '60px' }}>

        {/* Logo - Far Left */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/logo-icon.png" alt="GA" className="w-10 h-10 flex-shrink-0" />
          <div>
            <p className="text-white font-black text-sm tracking-widest leading-none mb-1">GUIDANCE</p>
            <p style={{ color: '#C4A84F', fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', lineHeight: 1, marginTop: '2px' }}>
              Language & Skills Academy
            </p>
          </div>
        </Link>

        {/* Desktop centre links - Absolute Center */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          <NavLink href="/"       active={isActive('/')}       label={t.home} />
          <NavLink href="/about"  active={isActive('/about')}  label={t.about} />
          <NavLink href="/contact" active={isActive('/contact')} label={dict[lang].footer.links.contact} />
          {user && <NavLink href="/home" active={isActive('/home')} label={t.dashboard} />}
          {user && isAdmin && <NavLink href="/admin" active={pathname.startsWith('/admin')} label={t.admin} />}
        </div>

        {/* Desktop right actions - Far Right */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
            🌐 {t.switchLang}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <button onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {t.logout}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #C4A84F, #F0D080)', color: '#0D1B4B' }}>
                  {user.name_en.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/70 text-sm font-medium">{user.name_en.split(' ')[0]}</span>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}>
                {t.login}
              </Link>
              <Link href="/register"
                className="px-4 py-1.5 rounded-lg text-xs font-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
                {t.register}
              </Link>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="text-xs px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
            🌐
          </button>
          <button onClick={() => setMenuOpen(m => !m)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white text-lg"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed right-4 top-16 w-64 rounded-xl shadow-2xl border overflow-hidden animate-fsu"
          style={{ 
            borderColor: 'rgba(196,168,79,0.2)', 
            background: 'rgba(13,27,75,0.98)',
            backdropFilter: 'blur(20px)'
          }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            <MobLink href="/"      label={t.home}      active={isActive('/')}      onClick={close} />
            <MobLink href="/about" label={t.about}     active={isActive('/about')} onClick={close} />
            <MobLink href="/contact" label={dict[lang].footer.links.contact} active={isActive('/contact')} onClick={close} />
            {user && <MobLink href="/home" label={t.dashboard} active={isActive('/home')} onClick={close} />}
            {user && isAdmin && <MobLink href="/admin" label={t.admin} active={pathname.startsWith('/admin')} onClick={close} />}

            <div className="border-t mt-2 pt-3 flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {user ? (
                <>
                  <button onClick={() => { handleLogout(); close(); }}
                    className="text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {t.logout}
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 mt-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #C4A84F, #F0D080)', color: '#0D1B4B' }}>
                      {user.name_en.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/70 text-sm flex-1">{user.name_en}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close}
                    className="block text-center py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {t.login}
                  </Link>
                  <Link href="/register" onClick={close}
                    className="block text-center py-2.5 rounded-xl text-sm font-black"
                    style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
                    {t.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
      style={active
        ? { background: 'rgba(196,168,79,0.15)', color: '#C4A84F' }
        : { color: 'rgba(255,255,255,0.65)' }}>
      {label}
    </Link>
  );
}

function MobLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick}
      className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={active
        ? { background: 'rgba(196,168,79,0.15)', color: '#C4A84F' }
        : { color: 'rgba(255,255,255,0.7)' }}>
      {label}
    </Link>
  );
}

function SiteFooter({ lang }: { lang: Lang }) {
  const t = dict[lang].footer;
  return (
    <footer style={{ background: '#060d26', borderTop: '1px solid rgba(196,168,79,0.12)' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-icon.png" alt="GA" className="w-9 h-9" />
              <span className="text-white font-black text-sm tracking-widest">GUIDANCE</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">{t.tagline}</p>
          </div>
          {/* Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>
              {lang === 'am' ? 'ፈጣን ማገናኛዎች' : 'Quick Links'}
            </p>
            <div className="flex flex-col gap-2">
              {Object.entries(t.links).map(([k, v]) => (
                <Link key={k} href={k === 'home' ? '/' : `/${k}`}
                  className="text-white/50 hover:text-white/80 text-sm transition-colors">{v}</Link>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>{t.contact}</p>
            <div className="flex flex-col gap-1.5 text-sm text-white/50">
              <span>0909918195</span>
              <span>0915260722</span>
            </div>
          </div>
          {/* Address */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>{t.address}</p>
            <p className="text-white/50 text-sm">{t.addressVal}</p>
            <p className="text-white/30 text-xs mt-2" style={{ wordBreak: 'break-all' }}>GuidanceAcademy.vercel.app</p>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/25 text-xs">{t.rights}</p>
          <p className="text-white/25 text-xs">{lang === 'am' ? 'ሁሉም መብቶች ተጠብቀዋል' : 'All rights reserved'}</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const { hydrate } = useAuthStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <html lang={lang === 'am' ? 'am' : 'en'}>
      <head>
        <title>Guidance Language & Skills Academy</title>
        <meta name="description" content="Summer English Grammar, Speaking & Presentation Skills Course — Harbu, Ethiopia" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LangCtx.Provider value={{ lang, setLang }}>
          <Navbar lang={lang} setLang={setLang} />
          <main style={{ flex: 1 }}>{children}</main>
          <SiteFooter lang={lang} />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1a2d6b', color: 'white', border: '1px solid rgba(196,168,79,0.3)' },
          }} />
        </LangCtx.Provider>
      </body>
    </html>
  );
}
