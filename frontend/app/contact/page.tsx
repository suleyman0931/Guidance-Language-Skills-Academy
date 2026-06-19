'use client';
import { useState } from 'react';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { useAuthStore } from '@/store/authStore';

const CONTACT_INFO = {
  email: 'guidanceacademyoffcial@gmail.com',
  phone: '0909918195',
  phone2: '0915260722',
  address: 'Harbu High School, Harbu',
};

export default function ContactPage() {
  const { lang } = useLang();
  const t = dict[lang].contact;
  const { user } = useAuthStore();
  
  const [name, setName] = useState(user?.username || '');
  const [message, setMessage] = useState('');

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Inquiry from Guidance Academy Website');
    const body = encodeURIComponent(`Hello,\n\nI'm ${name || 'interested in your academy'}.\n\n${message || 'I would like to know more about your courses.'}\n\nBest regards,\n${name || ''}`);
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleSMSClick = () => {
    const smsBody = encodeURIComponent(`Hello, I'm ${name || 'a potential student'}. ${message || 'I would like to know more about your courses.'}`);
    // For SMS, we use the 'sms:' protocol
    window.location.href = `sms:${CONTACT_INFO.phone}?body=${smsBody}`;
  };

  const handleCallClick = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  return (
    <div style={{ background: 'linear-gradient(160deg,#0a1230 0%,#0d1b4b 40%,#111f55 100%)', minHeight: '100vh' }}>
      
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#C4A84F,transparent 70%)' }} />
          <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#60a5fa,transparent 70%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <h1 className="font-black text-white leading-tight tracking-tight mb-3 animate-fsu"
            style={{ fontSize: 'clamp(42px,8vw,72px)' }}>
            {t.title}
          </h1>
          <p className="text-white/60 max-w-xl mx-auto animate-fsu"
            style={{ fontSize: 'clamp(14px,2.5vw,16px)', animationDelay: '80ms' }}>
            {t.sub}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Contact Form Card */}
          <div className="glass p-6 animate-fsu">
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <span style={{ color: '#C4A84F' }}>✉️</span>
              {t.getInTouch}
            </h2>
            <p className="text-white/60 text-sm mb-6">{t.reachOut}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                  {t.yourName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.yourNamePh}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                  {t.message}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePh}
                  rows={5}
                  className="input-field w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleEmailClick}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(90deg,#C4A84F,#F0D080)', color: '#0D1B4B' }}>
                  ✉️ {t.sendEmail}
                </button>
                <button
                  onClick={handleSMSClick}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/15"
                  style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
                  💬 {t.sendSMS}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            {/* Call Us */}
            <div className="glass p-5 hover:scale-[1.01] transition-transform animate-fsu" style={{ animationDelay: '60ms' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(196,168,79,0.15)', border: '1px solid rgba(196,168,79,0.3)' }}>
                  <span className="text-2xl">📞</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{t.callUs}</h3>
                  <p className="text-white/50 text-xs mb-2">{t.phoneLabel}</p>
                  <button
                    onClick={handleCallClick}
                    className="text-sm font-bold hover:underline transition-all"
                    style={{ color: '#C4A84F' }}>
                    {CONTACT_INFO.phone}
                  </button>
                  <p className="text-white/70 text-sm mt-1">{CONTACT_INFO.phone2}</p>
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div className="glass p-5 hover:scale-[1.01] transition-transform animate-fsu" style={{ animationDelay: '90ms' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
                  <span className="text-2xl">✉️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{t.emailUs}</h3>
                  <p className="text-white/50 text-xs mb-2">{t.emailLabel}</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-sm font-bold hover:underline transition-all break-all"
                    style={{ color: '#60a5fa' }}>
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Text Us */}
            <div className="glass p-5 hover:scale-[1.01] transition-transform animate-fsu" style={{ animationDelay: '120ms' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{t.textUs}</h3>
                  <p className="text-white/50 text-xs mb-2">SMS</p>
                  <button
                    onClick={handleSMSClick}
                    className="text-sm font-bold hover:underline transition-all"
                    style={{ color: '#34d399' }}>
                    {t.sendSMS}
                  </button>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="glass p-5 hover:scale-[1.01] transition-transform animate-fsu" style={{ animationDelay: '150ms' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(196,168,79,0.15)', border: '1px solid rgba(196,168,79,0.3)' }}>
                  <span className="text-2xl">📍</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{t.location}</h3>
                  <p className="text-white/50 text-xs mb-2">{t.addressLabel}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Map or additional info section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="glass p-8 text-center">
          <p className="text-2xl mb-3">🎓</p>
          <p className="text-white font-bold mb-2">
            {lang === 'am' ? 'ጋይዳንስ ቋንቋ እና ክህሎት አካዴሚ' : 'Guidance Language & Skills Academy'}
          </p>
          <p className="text-white/50 text-sm">
            {lang === 'am' ? '"በልበ ሙሉነት ተናገሩ፣ በክህሎት ስኬታማ ይሁኑ።"' : '"Speak with Confidence, Succeed with Skills."'}
          </p>
        </div>
      </section>

    </div>
  );
}
