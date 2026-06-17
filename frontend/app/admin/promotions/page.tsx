'use client';
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { useLang } from '@/app/layout';
import toast from 'react-hot-toast';

interface PromoImage {
  id: number;
  title?: string;
  image_url: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromotionsPage() {
  const { lang } = useLang();
  const [images, setImages] = useState<PromoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getPromoImages()
      .then(res => setImages(res.data.data || []))
      .catch(() => toast.error('Failed to load images'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!formData.get('image')) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    try {
      await adminApi.uploadPromoImage(formData);
      toast.success(lang === 'am' ? 'ስእል ተጨምሯል!' : 'Image uploaded successfully!');
      setShowUploadForm(false);
      form.reset();
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminApi.togglePromoImage(id);
      setImages(imgs => imgs.map(img => 
        img.id === id ? { ...img, is_active: !img.is_active } : img
      ));
      toast.success('Status toggled');
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(lang === 'am' ? 'እርግጠኛ ነዎት?' : 'Are you sure you want to delete this image?')) return;
    
    try {
      await adminApi.deletePromoImage(id);
      setImages(imgs => imgs.filter(img => img.id !== id));
      toast.success(lang === 'am' ? 'ተሰርዟል' : 'Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <div className="animate-fsu">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">
          📸 {lang === 'am' ? 'የማስተዋወቂያ ምስሎች' : 'Promotional Images'}
        </h1>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-gold px-5 py-2.5 text-sm flex items-center gap-2"
        >
          + {lang === 'am' ? 'አዲስ ስእል' : 'Upload Image'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="glass-dark p-6 mb-6 rounded-xl">
          <h2 className="text-white font-bold mb-4">
            {lang === 'am' ? 'አዲስ ስእል ያስገቡ' : 'Upload New Promotional Image'}
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                {lang === 'am' ? 'ስእል ይምረጡ' : 'Select Image'} *
              </label>
              <input 
                type="file" 
                name="image"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="input-field"
                required
              />
              <p className="text-white/40 text-xs mt-1">
                Max 2MB • JPG, PNG, WEBP • Recommended: 1200x675px
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                  {lang === 'am' ? 'ርዕስ' : 'Title'} ({lang === 'am' ? 'አማራጭ' : 'Optional'})
                </label>
                <input 
                  type="text" 
                  name="title"
                  className="input-field"
                  placeholder={lang === 'am' ? 'ለምሳሌ: የበጋ ኮርስ 2024' : 'e.g., Summer Course 2024'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                  {lang === 'am' ? 'የማሳያ ቅደም ተከተል' : 'Display Order'}
                </label>
                <input 
                  type="number" 
                  name="display_order"
                  defaultValue="0"
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4A84F' }}>
                {lang === 'am' ? 'መግለጫ' : 'Description'} ({lang === 'am' ? 'አማራጭ' : 'Optional'})
              </label>
              <textarea 
                name="description"
                className="input-field resize-none"
                rows={2}
                placeholder={lang === 'am' ? 'ስለ ስእሉ ማብራሪያ...' : 'Brief description...'}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="btn-ghost px-5 py-2.5 text-sm"
              >
                {lang === 'am' ? 'ሰርዝ' : 'Cancel'}
              </button>
              <button 
                type="submit"
                disabled={uploading}
                className="btn-gold px-5 py-2.5 text-sm flex items-center gap-2"
              >
                {uploading ? <><Spinner /> {lang === 'am' ? 'እየጫነ...' : 'Uploading...'}</> : (lang === 'am' ? 'ስራ' : 'Upload')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-4xl mb-3">📸</p>
          <p className="text-white/50 mb-4">
            {lang === 'am' ? 'ምንም የማስተዋወቂያ ስእሎች የሉም' : 'No promotional images yet'}
          </p>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="btn-gold px-5 py-2.5 text-sm"
          >
            {lang === 'am' ? 'አንዱን ያስገቡ' : 'Upload your first image'}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="glass-dark rounded-xl overflow-hidden animate-fsu"
              style={{ animationDelay: `${i * 40}ms` }}>
              {/* Image Preview */}
              <div className="relative aspect-video">
                <img 
                  src={`${API_URL}${img.image_url}`}
                  alt={img.title || 'Promotional image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    img.is_active ? 'badge-approved' : 'badge-rejected'
                  }`}>
                    {img.is_active ? (lang === 'am' ? 'ንቁ' : 'Active') : (lang === 'am' ? 'ግለጽ' : 'Inactive')}
                  </span>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="p-4">
                {img.title && (
                  <h3 className="text-white font-bold text-sm mb-1 truncate">{img.title}</h3>
                )}
                {img.description && (
                  <p className="text-white/50 text-xs mb-3 line-clamp-2">{img.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                  <span>#{img.display_order}</span>
                  <span>•</span>
                  <span>{new Date(img.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggle(img.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                    style={{ 
                      background: img.is_active ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)',
                      color: img.is_active ? '#fbbf24' : '#22c55e',
                      border: `1px solid ${img.is_active ? 'rgba(251,191,36,0.3)' : 'rgba(34,197,94,0.3)'}`
                    }}
                  >
                    {img.is_active ? (lang === 'am' ? '❌ አሰናክል' : '❌ Deactivate') : (lang === 'am' ? '✅ አነቃ' : '✅ Activate')}
                  </button>
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                    style={{ 
                      background: 'rgba(239,68,68,0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.3)'
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />;
}
