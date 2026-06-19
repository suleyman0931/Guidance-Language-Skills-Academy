'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { publicApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Post {
  id: number; title_en: string; title_am: string;
  body_en: string; body_am: string;
  type: 'announcement' | 'news' | 'tip';
  created_at: string;
}

const typeConfig: Record<string, { color: string; icon: string; bg: string }> = {
  announcement: { color: '#C4A84F', icon: '📢', bg: 'rgba(196,168,79,0.1)' },
  news:         { color: '#60a5fa', icon: '📰', bg: 'rgba(96,165,250,0.1)' },
  tip:          { color: '#34d399', icon: '💡', bg: 'rgba(52,211,153,0.1)' },
};

export default function HomePage() {
  const { lang } = useLang();
  const t = dict[lang];
  const router = useRouter();
  const { user, hydrate } = useAuthStore();
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | 'announcement' | 'news' | 'tip'>('all');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    publicApi.getPosts()
      .then(r => setPosts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  const firstName = user?.username || '';
  const filtered  = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6b,#0D1B4B)' }}>
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Welcome header */}
        <div className="mb-8 animate-fsu">
          <h1 className="text-3xl font-black text-white">
            {t.home.welcome}, <span style={{ color: '#C4A84F' }}>{firstName}</span> 👋
          </h1>
          <p className="text-white/50 text-sm mt-1">{t.footer.tagline}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: lang === 'am' ? 'ማስታወቂያዎች' : 'Announcements', count: posts.filter(p => p.type === 'announcement').length, icon: '📢', color: '#C4A84F' },
            { label: lang === 'am' ? 'ዜናዎች' : 'News', count: posts.filter(p => p.type === 'news').length, icon: '📰', color: '#60a5fa' },
            { label: lang === 'am' ? 'ምክሮች' : 'Tips', count: posts.filter(p => p.type === 'tip').length, icon: '💡', color: '#34d399' },
          ].map((s, i) => (
            <div key={i} className="glass p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
              <p className="text-white/50 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'announcement', 'news', 'tip'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
              style={filter === f
                ? { background: '#C4A84F', color: '#0D1B4B' }
                : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {f === 'all' ? (lang === 'am' ? 'ሁሉም' : 'All') : f}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-16 text-white/40">
            <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-3" />
            {lang === 'am' ? 'እየጫነ ነው…' : 'Loading…'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass p-10 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-white/50">{t.home.noPost}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} lang={lang} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, lang, index }: { post: Post; lang: string; index: number }) {
  const title  = lang === 'am' ? post.title_am : post.title_en;
  const body   = lang === 'am' ? post.body_am  : post.body_en;
  const config = typeConfig[post.type] || typeConfig.announcement;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass p-5 hover:scale-[1.01] transition-all duration-200 cursor-pointer animate-fsu"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => setExpanded(e => !e)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: config.bg, color: config.color, border: `1px solid ${config.color}33` }}>
            {post.type}
          </span>
        </div>
        <span className="text-white/30 text-xs flex-shrink-0">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className={`text-white/60 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>{body}</p>
      {body.length > 150 && (
        <p className="text-xs mt-2 font-semibold" style={{ color: config.color }}>
          {expanded ? (lang === 'am' ? 'ያሳጥሩ ↑' : 'Show less ↑') : (lang === 'am' ? 'ተጨማሪ ↓' : 'Read more ↓')}
        </p>
      )}
    </div>
  );
}
