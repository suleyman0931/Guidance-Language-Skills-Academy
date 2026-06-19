'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, hydrate } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLang();
  const t = dict[lang].admin;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (user !== null && !isAdmin) router.push('/home');
    if (user === null && typeof window !== 'undefined') {
      const stored = localStorage.getItem('ga_token');
      if (!stored) router.push('/login');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );

  const links = [
    { href: '/admin', icon: '📊', label: t.dashboard },
    { href: '/admin/students', icon: '🎓', label: t.students },
    { href: '/admin/posts', icon: '📝', label: t.posts },
    { href: '/admin/promotions', icon: '📸', label: lang === 'am' ? 'ማስተዋወቂያዎች' : 'Promotions' },
  ];

  return (
    <div className="min-h-screen flex relative" style={{ background: '#080f2a' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ background: 'rgba(196,168,79,0.9)' }}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-56 flex-shrink-0 border-r border-white/10 p-4 flex flex-col gap-2
        fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
        style={{ background: 'rgba(13,27,75,0.95)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-2" style={{ color: '#C4A84F' }}>
          Admin Panel
        </p>
        {links.map(link => {
          const active = link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active
                ? { background: 'rgba(196,168,79,0.2)', color: '#C4A84F', border: '1px solid rgba(196,168,79,0.3)' }
                : { color: 'rgba(255,255,255,0.5)', border: '1px solid transparent' }}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
        <div className="mt-auto">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors">
            ← {lang === 'am' ? 'ወደ ቤት' : 'Back to site'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto md:ml-0 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
