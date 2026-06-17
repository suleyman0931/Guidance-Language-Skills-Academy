'use client';
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import toast from 'react-hot-toast';

interface Post {
  id: number; title_en: string; title_am: string;
  body_en: string; body_am: string;
  type: 'announcement' | 'news' | 'tip';
  is_published: boolean; created_at: string;
}

const emptyForm = { title_en: '', title_am: '', body_en: '', body_am: '', type: 'announcement' as const, is_published: true };

export default function AdminPostsPage() {
  const { lang } = useLang();
  const t = dict[lang].admin;

  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Post | null>(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState<Partial<typeof emptyForm>>({});
  const [preview, setPreview]   = useState<Post | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getPosts().then(r => setPosts(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setErrors({}); setShowForm(true); };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({ title_en: p.title_en, title_am: p.title_am, body_en: p.body_en, body_am: p.body_am, type: p.type, is_published: p.is_published });
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.title_en.trim()) (e as any).title_en = 'Required';
    if (!form.title_am.trim()) (e as any).title_am = 'Required';
    if (!form.body_en.trim())  (e as any).body_en  = 'Required';
    if (!form.body_am.trim())  (e as any).body_am  = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const r = await adminApi.updatePost(editing.id, form);
        setPosts(ps => ps.map(p => p.id === editing.id ? r.data.data : p));
        toast.success(lang === 'am' ? 'ልጥፍ ዘምኗል' : 'Post updated');
      } else {
        const r = await adminApi.createPost(form);
        setPosts(ps => [r.data.data, ...ps]);
        toast.success(lang === 'am' ? 'ልጥፍ ተፈጥሯል' : 'Post created');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: number) => {
    try {
      const r = await adminApi.togglePublish(id);
      setPosts(ps => ps.map(p => p.id === id ? { ...p, is_published: r.data.data.is_published } : p));
      toast.success(lang === 'am' ? 'ሁኔታ ተቀይሯል' : 'Status toggled');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDeletePost)) return;
    try {
      await adminApi.deletePost(id);
      setPosts(ps => ps.filter(p => p.id !== id));
      toast.success(lang === 'am' ? 'ተሰርዟል' : 'Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const typeColors: Record<string, string> = { announcement: '#C4A84F', news: '#60a5fa', tip: '#34d399' };
  const typeIcons:  Record<string, string> = { announcement: '📢', news: '📰', tip: '💡' };

  return (
    <div className="animate-fsu">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">{t.posts}</h1>
        <button onClick={openNew} className="btn-gold px-5 py-2.5 text-sm flex items-center gap-2">
          + {t.newPost}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-white/50 mb-4">{lang === 'am' ? 'ምንም ልጥፍ የለም' : 'No posts yet'}</p>
          <button onClick={openNew} className="btn-gold px-5 py-2.5 text-sm">
            {t.newPost}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p, i) => (
            <div key={p.id} className="glass p-4 flex items-start gap-4 hover:scale-[1.005] transition-transform animate-fsu"
              style={{ animationDelay: `${i * 40}ms` }}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{typeIcons[p.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: `${typeColors[p.type]}18`, color: typeColors[p.type], border: `1px solid ${typeColors[p.type]}33` }}>
                    {p.type}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.is_published ? 'badge-approved' : 'badge-rejected'}`}>
                    {p.is_published ? (lang === 'am' ? 'ታትሟል' : 'published') : (lang === 'am' ? 'ረቂቅ' : 'draft')}
                  </span>
                  <span className="text-white/30 text-xs ml-auto">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-white font-bold truncate">{lang === 'am' ? p.title_am : p.title_en}</h3>
                <p className="text-white/50 text-sm truncate">{lang === 'am' ? p.body_am : p.body_en}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <PostBtn color="#60a5fa" title="Preview" onClick={() => setPreview(p)}>👁</PostBtn>
                <PostBtn color="#C4A84F" title={t.edit} onClick={() => openEdit(p)}>✏️</PostBtn>
                <PostBtn color={p.is_published ? '#f59e0b' : '#22c55e'}
                  title={p.is_published ? t.unpublish : t.publish}
                  onClick={() => handleToggle(p.id)}>
                  {p.is_published ? '📤' : '📢'}
                </PostBtn>
                <PostBtn color="#ef4444" title={t.delete} onClick={() => handleDelete(p.id)}>🗑</PostBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      {showForm && (
        <PostFormModal
          editing={!!editing} form={form} setForm={setForm}
          errors={errors} saving={saving}
          onSave={handleSave} onClose={() => setShowForm(false)}
          t={t} lang={lang}
        />
      )}

      {/* Preview modal */}
      {preview && (
        <PreviewModal post={preview} lang={lang} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}

function PostBtn({ color, title, onClick, children }: any) {
  return (
    <button onClick={onClick} title={title}
      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
      style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
      {children}
    </button>
  );
}

function PostFormModal({ editing, form, setForm, errors, saving, onSave, onClose, t, lang }: any) {
  const set = (k: string) => (e: any) =>
    setForm((f: any) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-dark w-full max-w-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white">{editing ? t.updatePost : t.newPost}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <FormField label={t.postTitleEn} error={(errors as any).title_en}>
            <input className="input-field" value={form.title_en} onChange={set('title_en')} placeholder="e.g. Important Announcement" />
          </FormField>
          <FormField label={t.postTitleAm} error={(errors as any).title_am}>
            <input className="input-field" value={form.title_am} onChange={set('title_am')} placeholder="ለምሳሌ ጠቃሚ ማስታወቂያ" />
          </FormField>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <FormField label={t.postBodyEn} error={(errors as any).body_en}>
            <textarea className="input-field resize-none" rows={5} value={form.body_en}
              onChange={set('body_en')} placeholder="Write the content in English…" />
          </FormField>
          <FormField label={t.postBodyAm} error={(errors as any).body_am}>
            <textarea className="input-field resize-none" rows={5} value={form.body_am}
              onChange={set('body_am')} placeholder="ይዘቱን በአማርኛ ይፃፉ…" />
          </FormField>
        </div>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: '#C4A84F' }}>
              {t.postType}
            </label>
            <div className="relative">
              <select className="input-field appearance-none pr-8 w-44" value={form.type} onChange={set('type')}>
                <option value="announcement">📢 Announcement</option>
                <option value="news">📰 News</option>
                <option value="tip">💡 Study Tip</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: '#8B6914' }}>▼</span>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input type="checkbox" checked={form.is_published} onChange={set('is_published')}
              className="w-4 h-4 accent-yellow-400" />
            <span className="text-white/70 text-sm">{t.postPublish}</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-sm">
            {lang === 'am' ? 'ሰርዝ' : 'Cancel'}
          </button>
          <button onClick={onSave} disabled={saving} className="btn-gold px-5 py-2.5 text-sm flex items-center gap-2">
            {saving ? <><Spinner /> {lang === 'am' ? 'እየተቀመጠ…' : 'Saving…'}</> : (editing ? t.updatePost : t.savePost)}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ post, lang, onClose }: any) {
  const title = lang === 'am' ? post.title_am : post.title_en;
  const body  = lang === 'am' ? post.body_am  : post.body_en;
  const icons: Record<string, string> = { announcement: '📢', news: '📰', tip: '💡' };
  const colors: Record<string, string> = { announcement: '#C4A84F', news: '#60a5fa', tip: '#34d399' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-dark w-full max-w-lg p-6 animate-scale-in">
        <div className="flex justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full"
            style={{ background: `${colors[post.type]}18`, color: colors[post.type], border: `1px solid ${colors[post.type]}33` }}>
            {icons[post.type]} {post.type}
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>
        <h2 className="text-xl font-black text-white mb-3">{title}</h2>
        <p className="text-white/70 leading-relaxed">{body}</p>
        <p className="text-white/30 text-xs mt-4">{new Date(post.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: any) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />;
}
