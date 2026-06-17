'use client';
import Link from 'next/link';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';

export default function AboutPage() {
  const { lang } = useLang();
  const t = dict[lang].about;
  const nav = dict[lang].nav;

  return (
    <div style={{ background: 'linear-gradient(160deg,#0a1230 0%,#0d1b4b 50%,#111f55 100%)' }}>

      {/* ── PAGE HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#C4A84F,transparent 70%)' }} />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#60a5fa,transparent 70%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: 'rgba(196,168,79,0.12)', border: '1px solid rgba(196,168,79,0.3)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#C4A84F' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C4A84F' }}>
              {t.title}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-fsu">
            {lang === 'am' ? 'ጋይዳንስ' : 'Guidance'}
            <br />
            <span style={{ color: '#C4A84F' }}>
              {lang === 'am' ? 'ቋንቋ & ክህሎት አካዴሚ' : 'Language & Skills'}
            </span>
          </h1>
          <p className="text-white/60 text-base max-w-lg mx-auto">{t.sub}</p>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <MV icon="🎯" title={t.mission} text={t.missionText} color="#C4A84F" />
          <MV icon="🔭" title={t.vision}  text={t.visionText}  color="#60a5fa" />
        </div>
      </section>

      {/* ── TRAINER CARD ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <SectionLabel label={t.trainerTitle} />
        <div className="glass mt-6 p-8 flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden"
              style={{ border: '2px solid rgba(196,168,79,0.3)' }}>
              <img 
                src="frontend\public\suleyman.png" 
                alt="Suleyman Abdu"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg leading-tight">{t.trainerName}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#C4A84F' }}>{t.trainerRole}</p>
            </div>
            {/* Contact under avatar */}
            <div className="flex flex-col items-center gap-1 mt-2">
              {t.phones.map(p => (
                <a key={p} href={`tel:${p}`}
                  className="flex items-center gap-1.5 text-xs font-mono transition-colors hover:text-yellow-300"
                  style={{ color: 'rgba(255,255,255,0.6)' }}>
                  📞 {p}
                </a>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <p className="text-white/70 leading-relaxed mb-6">{t.trainerBio}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📍', label: lang === 'am' ? 'አድራሻ' : 'Location', val: lang === 'am' ? 'ሃርቡ፣ ኢትዮጵያ' : 'Harbu, Ethiopia' },
                { icon: '🌍', label: lang === 'am' ? 'ቋንቋ' : 'Languages', val: lang === 'am' ? 'አማርኛ / English' : 'Amharic / English' },
                { icon: '🎓', label: lang === 'am' ? 'ሙያ' : 'Expertise', val: lang === 'am' ? 'ቋንቋ ትምህርት' : 'Language Training' },
                { icon: '🏫', label: lang === 'am' ? 'ት/ቤት' : 'Venue', val: lang === 'am' ? 'ሃርቡ ሁ/ደ ት/ቤት' : 'Harbu High School' },
              ].map((r, i) => (
                <div key={i} className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-base mb-1">{r.icon}</p>
                  <p className="text-white/40 text-xs">{r.label}</p>
                  <p className="text-white/80 text-sm font-medium">{r.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <SectionLabel label={t.whyUs} />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {t.reasons.map((r, i) => (
            <div key={i} className="glass p-5 hover:scale-[1.02] transition-transform animate-fsu"
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-3xl block mb-3">{r.icon}</span>
              <p className="text-white font-bold mb-1.5 text-sm">{r.t}</p>
              <p className="text-white/50 text-xs leading-relaxed">{r.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT BLOCK ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <SectionLabel label={t.contact} />
        <div className="glass mt-6 p-6 grid sm:grid-cols-3 gap-6">
          {/* Phones */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>📞 {lang === 'am' ? 'ስልክ' : 'Phone'}</p>
            <div className="flex flex-col gap-1.5">
              {t.phones.map(p => (
                <a key={p} href={`tel:${p}`}
                  className="text-white font-mono text-sm hover:text-yellow-300 transition-colors">{p}</a>
              ))}
            </div>
          </div>
          {/* Address */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>📍 {lang === 'am' ? 'አድራሻ' : 'Address'}</p>
            <p className="text-white/70 text-sm leading-relaxed">{t.address}</p>
          </div>
          {/* Website */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A84F' }}>🌐 {lang === 'am' ? 'ድረ ገጽ' : 'Website'}</p>
            <a href="https://GuidanceAcademy.vercel.app" target="_blank" rel="noopener noreferrer"
              className="text-white/70 text-sm hover:text-yellow-300 transition-colors break-all">
              {t.website}
            </a>
          </div>
        </div>
      </section>

      {/* ── TAGLINE + CTA ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(196,168,79,0.18),rgba(240,208,128,0.06))', border: '1px solid rgba(196,168,79,0.3)' }}>
          <p className="text-2xl font-black text-white mb-2 italic">{t.tagline}</p>
          <p className="text-white/50 text-sm mb-8">
            {lang === 'am' ? 'ጋይዳንስ ቋንቋ እና ክህሎት አካዴሚ' : 'Guidance Language & Skills Academy'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"
              className="px-8 py-3.5 rounded-xl font-black text-sm hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
              ✏️ {nav.register}
            </Link>
            <Link href="/login"
              className="px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
              style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              🔑 {nav.login}
            </Link>
          </div>
        </div>
      </section>

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

function MV({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) {
  return (
    <div className="glass p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-black text-white">{title}</h3>
      </div>
      <p className="text-white/65 leading-relaxed text-sm">{text}</p>
      <div className="mt-4 h-0.5 rounded-full w-16" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}
