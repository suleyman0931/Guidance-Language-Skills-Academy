'use client';
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import toast from 'react-hot-toast';

interface Student {
  id: number; name_en: string; name_am: string; phone: string;
  grade: string; purpose: string; referral: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid';
  username?: string; created_at: string;
}

const gradeLabel: Record<string, string> = {
  grade7: 'Grade 7–8', grade9: 'Grade 9–10', grade11: 'Grade 11–12', other: 'Other',
};

export default function AdminStudentsPage() {
  const { lang } = useLang();
  const t = dict[lang].admin;

  const [students, setStudents] = useState<Student[]>([]);
  const [meta, setMeta]         = useState({ total: 0, last_page: 1 });
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getStudents({ page, search, status, payment_status: paymentStatus })
      .then(r => { setStudents(r.data.data || []); setMeta(r.data.meta || { total: 0, last_page: 1 }); })
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, [page, search, status, paymentStatus]);

  useEffect(() => { load(); }, [load]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleStatus = async (id: number, newStatus: string) => {
    try {
      await adminApi.updateStatus(id, newStatus);
      toast.success(`Student ${newStatus}`);
      setStudents(ss => ss.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
      if (selected?.id === id) setSelected(s => s ? { ...s, status: newStatus as any } : s);
    } catch { toast.error('Update failed'); }
  };

  const handlePaymentStatus = async (id: number, newPaymentStatus: string) => {
    try {
      await adminApi.updatePaymentStatus(id, newPaymentStatus);
      toast.success(`Payment marked as ${newPaymentStatus}`);
      setStudents(ss => ss.map(s => s.id === id ? { ...s, payment_status: newPaymentStatus as any } : s));
      if (selected?.id === id) setSelected(s => s ? { ...s, payment_status: newPaymentStatus as any } : s);
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    setDeleting(id);
    try {
      await adminApi.deleteStudent(id);
      toast.success('Deleted');
      setStudents(ss => ss.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const filters = [
    { v: '', l: t.filterAll }, { v: 'pending', l: t.filterPending },
    { v: 'approved', l: t.filterApproved }, { v: 'rejected', l: t.filterRejected },
  ];

  const paymentFilters = [
    { v: '', l: lang === 'am' ? 'ሁሉም' : 'All' },
    { v: 'paid', l: lang === 'am' ? '💰 ተከፍሏል' : '💰 Paid' },
    { v: 'unpaid', l: lang === 'am' ? '❌ አልተከፈለም' : '❌ Unpaid' },
  ];

  return (
    <div className="animate-fsu">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">{t.students}</h1>
        <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(196,168,79,0.15)', color: '#C4A84F' }}>
          {meta.total} {lang === 'am' ? 'ጠቅላላ' : 'total'}
        </span>
      </div>

      {/* Search + filters */}
      <div className="glass p-4 mb-5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/10 border border-white/15 outline-none focus:border-yellow-400/60 placeholder-white/30"
              placeholder={t.search}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        
        {/* Enrollment Status Filters */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(196,168,79,0.8)' }}>
            {lang === 'am' ? 'የመመዝገብ ሁኔታ' : 'Enrollment Status'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f.v} onClick={() => { setStatus(f.v); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                style={status === f.v
                  ? { background: '#C4A84F', color: '#0D1B4B' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Status Filters */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(196,168,79,0.8)' }}>
            {lang === 'am' ? 'የክፍያ ሁኔታ' : 'Payment Status'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {paymentFilters.map(f => (
              <button key={f.v} onClick={() => { setPaymentStatus(f.v); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                style={paymentStatus === f.v
                  ? { background: '#C4A84F', color: '#0D1B4B' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {f.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-white/40">
            <p className="text-4xl mb-3">🎓</p>
            <p>{lang === 'am' ? 'ምንም ተማሪ አልተገኘም' : 'No students found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {[t.colName, t.colPhone, t.colGrade, t.colReferral, t.colStatus, 'Payment', t.colDate, t.colActions]
                    .map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'rgba(196,168,79,0.8)' }}>{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{s.name_en}</p>
                      <p className="text-white/40 text-xs">{s.name_am}</p>
                    </td>
                    <td className="px-4 py-3 text-white/70 font-mono">{s.phone}</td>
                    <td className="px-4 py-3 text-white/70">{gradeLabel[s.grade] || s.grade}</td>
                    <td className="px-4 py-3 text-white/70 capitalize">{s.referral}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={s.payment_status || 'unpaid'} />
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionBtn color="#60a5fa" onClick={() => setSelected(s)} title={t.view}>👁</ActionBtn>
                        {s.status !== 'approved' && (
                          <ActionBtn color="#22c55e" onClick={() => handleStatus(s.id, 'approved')} title={t.approve}>✓</ActionBtn>
                        )}
                        {s.status !== 'rejected' && (
                          <ActionBtn color="#f59e0b" onClick={() => handleStatus(s.id, 'rejected')} title={t.reject}>✕</ActionBtn>
                        )}
                        <ActionBtn color="#ef4444" onClick={() => handleDelete(s.id)} title={t.delete}
                          loading={deleting === s.id}>🗑</ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-xs">{lang === 'am' ? 'ገጽ' : 'Page'} {page} / {meta.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">←</button>
              <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">→</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <StudentModal student={selected} lang={lang} t={t}
          onClose={() => setSelected(null)}
          onStatus={handleStatus}
          onPaymentStatus={handlePaymentStatus}
          onDelete={handleDelete} />
      )}
    </div>
  );
}

function ActionBtn({ color, onClick, title, children, loading }: any) {
  return (
    <button onClick={onClick} title={title} disabled={loading}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110 disabled:opacity-40"
      style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
      {loading ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge-${status} text-xs font-bold px-2.5 py-1 rounded-full inline-block`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const config = status === 'paid'
    ? { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', text: '💰 Paid' }
    : { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', text: '❌ Unpaid' };
  
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block"
      style={{ background: config.bg, color: config.color }}>
      {config.text}
    </span>
  );
}

function StudentModal({ student: s, lang, t, onClose, onStatus, onPaymentStatus, onDelete }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-dark w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-white">{s.name_en}</h2>
            <p className="text-white/50 text-sm">{s.name_am}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { icon: '📞', label: lang === 'am' ? 'ስልክ' : 'Phone', val: s.phone },
            { icon: '🎓', label: lang === 'am' ? 'ክፍል' : 'Grade', val: gradeLabel[s.grade] || s.grade },
            { icon: '📡', label: lang === 'am' ? 'ምንጭ' : 'Referral', val: s.referral },
            { icon: '👤', label: lang === 'am' ? 'የተጠቃሚ ስም' : 'Username', val: s.username || '—' },
            { icon: '📅', label: lang === 'am' ? 'ተመዝግቧል' : 'Registered', val: new Date(s.created_at).toLocaleString() },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5">
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <div>
                <p className="text-white/40 text-xs">{r.label}</p>
                <p className="text-white text-sm font-medium">{r.val}</p>
              </div>
            </div>
          ))}
          <div className="py-2">
            <p className="text-white/40 text-xs mb-1">💬 {lang === 'am' ? 'ዓላማ' : 'Purpose'}</p>
            <p className="text-white/80 text-sm leading-relaxed">{s.purpose}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={s.status} />
            <PaymentBadge status={s.payment_status || 'unpaid'} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Enrollment Status Buttons */}
            {s.status !== 'approved' && (
              <button onClick={() => onStatus(s.id, 'approved')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                {t.approve}
              </button>
            )}
            {s.status !== 'rejected' && (
              <button onClick={() => onStatus(s.id, 'rejected')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                {t.reject}
              </button>
            )}
            
            {/* Payment Status Buttons */}
            {s.payment_status !== 'paid' && (
              <button onClick={() => onPaymentStatus(s.id, 'paid')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                💰 Mark Paid
              </button>
            )}
            {s.payment_status !== 'unpaid' && (
              <button onClick={() => onPaymentStatus(s.id, 'unpaid')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                ❌ Mark Unpaid
              </button>
            )}
            
            <button onClick={() => { onDelete(s.id); onClose(); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              {t.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
