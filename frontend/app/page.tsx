'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { publicApi } from '@/lib/api';
import PromoGallery from '@/components/PromoGallery';
import { useAuthStore } from '@/store/authStore';

interface Post {
  id: number; title_en: string; title_am: string;
  body_en: string; body_am: string;
  type: 'announcement' | 'news' | 'tip';
  created_at: string;
}

const typeConfig: Record<string, { color: string; icon: string }> = {
  announcement: { color: '#C4A84F', icon: '📢' },
  news:         { color: '#60a5fa', icon: '📰' },
  tip:          { color: '#34d399', icon: '💡' },
};

export default function LandingPage() {
  const { lang } = useLang();
  const t   = dict[lang];
  const nav = t.nav;
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    publicApi.getPosts().then(r => setPosts(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'linear-gradient(160deg,#0a1230 0%,#0d1b4b 40%,#111f55 100%)' }}>

      {/* ════════════ HERO ════════════ */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#C4A84F,transparent 70%)' }} />
          <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#60a5fa,transparent 70%)' }} />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#C4A84F,transparent 70%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 text-center">
          {/* Pulse badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
            style={{ background: 'rgba(196,168,79,0.12)', border: '1px solid rgba(196,168,79,0.35)' }}>
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#C4A84F' }} />
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#C4A84F' }}>
              {t.hero.badge}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-black text-white leading-none tracking-tight mb-4 animate-fsu"
            style={{ fontSize: 'clamp(52px,10vw,96px)' }}>
            {t.hero.title}
          </h1>

          <p className="text-white/60 mb-3 max-w-xl mx-auto animate-fsu"
            style={{ fontSize: 'clamp(14px,2.5vw,18px)', animationDelay: '80ms' }}>
            {t.hero.sub}
          </p>

          <p className="text-sm font-bold mb-10" style={{ color: '#C4A84F', animationDelay: '120ms' }}>
            📅 {t.hero.date}
          </p>

          {/* Bullet pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {t.bullets.map((b, i) => (
              <span key={i} className="text-sm px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.8)' }}>
                {b}
              </span>
            ))}
          </div>

          {/* CTA buttons - Only show if user is NOT logged in */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B', boxShadow: '0 8px 32px rgba(196,168,79,0.35)' }}>
                ✏️ {t.hero.cta}
              </Link>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
                🔑 {t.hero.ctaSub}
              </Link>
            </div>
          )}
          
          {/* Welcome message for logged-in users */}
          {user && (
            <div className="text-center">
              <p className="text-2xl font-black mb-2" style={{ color: '#C4A84F' }}>
                {lang === 'am' ? 'እንኳን ደህና መጡ!' : 'Welcome Back!'} 👋
              </p>
              <Link href="/home"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
                {lang === 'am' ? 'ወደ ዳሽቦርድ ይሂዱ' : 'Go to Dashboard'} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ PROMOTIONAL GALLERY ════════════ */}
      <PromoGallery />

      {/* ════════════ COURSE INFO CARDS ════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <SectionLabel label={t.info.sectionTitle} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {t.info.cards.map((c, i) => (
            <div key={i} className="glass p-5 text-center hover:scale-[1.02] transition-transform">
              <p className="text-3xl mb-3">{c.icon}</p>
              <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>{c.label}</p>
              <p className="text-white/75 text-sm leading-snug">{c.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ WHAT YOU'LL LEARN ════════════ */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <SectionLabel label={t.info.whatYouLearn} />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {t.info.topics.map((tp, i) => (
            <div key={i} className="glass p-5 hover:scale-[1.02] transition-transform"
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-3xl block mb-3">{tp.icon}</span>
              <p className="text-white font-bold text-sm mb-1">{tp.t}</p>
              <p className="text-white/50 text-xs leading-relaxed">{tp.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ WHO IS IT FOR ════════════ */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <SectionLabel label={t.info.whoFor} />
        <div className="glass mt-6 p-6 grid sm:grid-cols-2 gap-3">
          {t.info.audience.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                style={{ background: 'rgba(196,168,79,0.2)', color: '#C4A84F', border: '1px solid rgba(196,168,79,0.3)' }}>
                ✓
              </span>
              <p className="text-white/75 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ ANNOUNCEMENTS / POSTS ════════════ */}
      {posts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <SectionLabel label={t.home.announcements} />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} lang={lang} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ════════════ BIG CTA BANNER - Only show if user is NOT logged in ════════════ */}
      {!user && (
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(196,168,79,0.18),rgba(240,208,128,0.08))', border: '1px solid rgba(196,168,79,0.3)' }}>
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle,#C4A84F,transparent)' }} />
            <p className="text-3xl font-black text-white mb-2">
              {lang === 'am' ? 'ዛሬ ይቀላቀሉ!' : 'Join Us Today!'}
            </p>
            <p className="text-white/60 mb-6 text-sm">
              {lang === 'am'
                ? 'ወደ ጋይዳንስ ቋንቋ እና ክህሎት አካዴሚ ቤተሰብ ይቀላቀሉ'
                : 'Become part of the Guidance Language & Skills Academy family'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register"
                className="px-8 py-3.5 rounded-xl font-black text-sm hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
                ✏️ {nav.register}
              </Link>
              <Link href="/about"
                className="px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                {nav.about} →
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg,#C4A84F,#F0D080)' }} />
      <h2 className="text-xl font-black text-white">{label}</h2>
    </div>
  );
}

function PostCard({ post, lang, index }: { post: Post; lang: string; index: number }) {
  const title  = lang === 'am' ? post.title_am : post.title_en;
  const body   = lang === 'am' ? post.body_am  : post.body_en;
  const cfg    = typeConfig[post.type] || typeConfig.announcement;
  const [exp, setExp] = useState(false);
  return (
    <div className="glass p-5 hover:scale-[1.01] transition-all duration-200 cursor-pointer animate-fsu"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => setExp(e => !e)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{cfg.icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: `${cfg.color}1a`, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
          {post.type}
        </span>
        <span className="text-white/30 text-xs ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
      <p className={`text-white/55 text-sm leading-relaxed ${exp ? '' : 'line-clamp-3'}`}>{body}</p>
      {body.length > 140 && (
        <p className="text-xs font-semibold mt-2" style={{ color: cfg.color }}>
          {exp ? (lang === 'am' ? '↑ ያሳጥሩ' : '↑ Less') : (lang === 'am' ? '↓ ተጨማሪ' : '↓ More')}
        </p>
      )}
    </div>
  );
}
