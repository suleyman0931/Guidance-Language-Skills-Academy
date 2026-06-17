'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';

interface Stats { total: number; pending: number; approved: number; rejected: number; today: number; }

export default function AdminDashboard() {
  const { lang } = useLang();
  const t = dict[lang].admin;
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getStudents({ page: 1 }).then(r => {
      const data = r.data;
      setRecent((data.data || []).slice(0, 5));
      const all: any[] = data.data || [];
      setStats({
        total: data.meta?.total || all.length,
        pending: all.filter((s: any) => s.status === 'pending').length,
        approved: all.filter((s: any) => s.status === 'approved').length,
        rejected: all.filter((s: any) => s.status === 'rejected').length,
        today: all.filter((s: any) => {
          const d = new Date(s.created_at);
          const n = new Date();
          return d.toDateString() === n.toDateString();
        }).length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: t.totalStudents, val: stats?.total ?? '…', icon: '🎓', color: '#C4A84F' },
    { label: t.pending, val: stats?.pending ?? '…', icon: '⏳', color: '#fbbf24' },
    { label: t.approved, val: stats?.approved ?? '…', icon: '✅', color: '#22c55e' },
    { label: lang === 'am' ? 'ዛሬ' : 'Today', val: stats?.today ?? '…', icon: '📅', color: '#60a5fa' },
  ];

  return (
    <div className="animate-fsu">
      <h1 className="text-2xl font-black text-white mb-6">{t.dashboard}</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="glass p-5">
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className="text-3xl font-black mb-1" style={{ color: c.color }}>{c.val}</p>
            <p className="text-white/50 text-xs">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/students"
          className="glass p-5 hover:scale-[1.02] transition-transform flex items-center gap-4">
          <span className="text-3xl">🎓</span>
          <div>
            <p className="text-white font-bold">{t.students}</p>
            <p className="text-white/40 text-sm">{lang === 'am' ? 'ሁሉም ተማሪዎች ይመልከቱ' : 'View all registered students'}</p>
          </div>
          <span className="ml-auto" style={{ color: '#C4A84F' }}>→</span>
        </Link>
        <Link href="/admin/posts"
          className="glass p-5 hover:scale-[1.02] transition-transform flex items-center gap-4">
          <span className="text-3xl">📝</span>
          <div>
            <p className="text-white font-bold">{t.posts}</p>
            <p className="text-white/40 text-sm">{lang === 'am' ? 'ልጥፎችን ፍጠሩ እና አስተዳድሩ' : 'Create and manage posts'}</p>
          </div>
          <span className="ml-auto" style={{ color: '#C4A84F' }}>→</span>
        </Link>
      </div>

      {/* Recent registrations */}
      {recent.length > 0 && (
        <div className="glass p-5">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span style={{ color: '#C4A84F' }}>●</span>
            {lang === 'am' ? 'የቅርብ ጊዜ ምዝገባዎች' : 'Recent Registrations'}
          </h2>
          <div className="space-y-2">
            {recent.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">{s.name_en}</p>
                  <p className="text-white/40 text-xs">{s.phone} · {s.grade}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
          <Link href="/admin/students" className="text-xs font-semibold mt-3 block" style={{ color: '#C4A84F' }}>
            {lang === 'am' ? 'ሁሉንም ይመልከቱ →' : 'View all →'}
          </Link>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge-${status} text-xs font-bold px-2 py-0.5 rounded-full`}>
      {status}
    </span>
  );
}
