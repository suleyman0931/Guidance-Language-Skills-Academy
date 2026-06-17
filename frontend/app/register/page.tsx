'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLang } from '@/app/layout';
import { dict } from '@/lib/dict';
import { registrationApi } from '@/lib/api';

interface FormData {
  name_en: string; name_am: string;
  phone: string; grade: string;
  purpose: string; referral: string;
}

const TOTAL = 3;

export default function RegisterPage() {
  const { lang } = useLang();
  const t = dict[lang].reg;
  const router = useRouter();

  const [step, setStep]   = useState(1);
  const [anim, setAnim]   = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    name_en: '', name_am: '', phone: '', grade: '', purpose: '', referral: '',
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (step === 1) {
      if (!form.name_en.trim()) errs.name_en = t.required;
      if (!form.name_am.trim()) errs.name_am = t.required;
    }
    if (step === 2) {
      const ph = form.phone.replace(/\s/g, '');
      if (!ph) errs.phone = t.required;
      else if (!/^(09|07)\d{8}$/.test(ph)) errs.phone = t.phoneErr;
      if (!form.grade) errs.grade = t.required;
    }
    if (step === 3) {
      if (!form.purpose.trim()) errs.purpose = t.required;
      if (!form.referral) errs.referral = t.required;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const transition = (cb: () => void) => {
    setAnim(false);
    setTimeout(() => { cb(); setAnim(true); }, 260);
  };

  const goNext = () => {
    if (!validate()) return;
    if (step < TOTAL) transition(() => setStep(s => s + 1));
    else handleSubmit();
  };

  const goBack = () => {
    if (step > 1) transition(() => setStep(s => s - 1));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registrationApi.submit({ ...form, lang });
      const { registration_id } = res.data;
      // Build default username from name_en + first letter of father name from name_am
      const parts = form.name_en.trim().split(' ');
      const firstName = parts[0] || '';
      const fatherInitial = parts[1] ? parts[1][0].toUpperCase() : '';
      const defaultUsername = (firstName + fatherInitial).toLowerCase();
      router.push(`/account-setup?rid=${registration_id}&username=${encodeURIComponent(defaultUsername)}&name=${encodeURIComponent(form.name_en)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pct = ((step - 1) / (TOTAL - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4"
      style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6b,#0D1B4B)' }}>

      {/* Card */}
      <div className="w-full max-w-md glass p-7 mt-4">

        {/* Progress */}
        <div className="flex justify-between mb-3">
          {t.stepLabels.map((name, i) => (
            <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                i + 1 < step ? 'border-yellow-400 text-navy-800'
                : i + 1 === step ? 'border-yellow-400 text-white scale-110'
                : 'border-white/20 text-white/30'}`}
                style={i + 1 < step ? { background: '#C4A84F' } : i + 1 === step ? { background: '#0D1B4B', boxShadow: '0 0 0 3px rgba(196,168,79,0.3)' } : {}}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-center leading-tight"
                style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
                  color: i + 1 === step ? '#C4A84F' : 'rgba(255,255,255,0.3)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C4A84F,#F0D080)' }} />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C4A84F' }}>
          {t.stepOf(step)}
        </p>

        {/* Fields */}
        <div style={{ opacity: anim ? 1 : 0, transform: anim ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity .25s, transform .25s' }}>

          {step === 1 && (
            <div className="space-y-4">
              <Field label={t.nameEn} error={errors.name_en}>
                <input className="input-field" value={form.name_en} onChange={set('name_en')} placeholder={t.nameEnPh} />
              </Field>
              <Field label={t.nameAm} error={errors.name_am}>
                <input className="input-field" value={form.name_am} onChange={set('name_am')} placeholder={t.nameAmPh} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label={t.phone} error={errors.phone}>
                <input className="input-field" value={form.phone} onChange={set('phone')} placeholder={t.phonePh} type="tel" />
              </Field>
              <Field label={t.grade} error={errors.grade}>
                <SelectField value={form.grade} onChange={set('grade')} options={t.gradeOpts} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Field label={t.purpose} error={errors.purpose}>
                <textarea className="input-field resize-none" rows={3} value={form.purpose}
                  onChange={set('purpose')} placeholder={t.purposePh} />
              </Field>
              <Field label={t.referral} error={errors.referral}>
                <SelectField value={form.referral} onChange={set('referral')} options={t.refOpts} />
              </Field>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-7">
          {step > 1 && (
            <button onClick={goBack} className="btn-ghost flex-1 py-3 text-sm">{t.back}</button>
          )}
          <button onClick={goNext} disabled={loading}
            className="btn-gold flex-[2] py-3 text-sm flex items-center justify-center gap-2">
            {loading ? <><Spinner />{t.submitting}</> : step < TOTAL ? `${t.next} →` : `${t.submit} ✓`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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

function SelectField({ value, onChange, options }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="relative">
      <select className="input-field appearance-none pr-8" value={value} onChange={onChange}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
        style={{ color: '#8B6914' }}>▼</span>
    </div>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />;
}
