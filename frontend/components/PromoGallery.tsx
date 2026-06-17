'use client';
import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api';

interface PromoImage {
  id: number;
  title?: string;
  image_url: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export default function PromoGallery() {
  const [images, setImages] = useState<PromoImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch promotional images from API
  useEffect(() => {
    publicApi.getPromoImages()
      .then(res => {
        const data = res.data.data || [];
        setImages(data);
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setLoading(false);
      });
  }, []);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Don't render if no images or still loading
  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg,#C4A84F,#F0D080)' }} />
        <h2 className="text-xl font-black text-white">
          📸 Gallery & Promotions
        </h2>
      </div>

      <div className="relative glass-dark rounded-2xl overflow-hidden">
        {/* Main Image Display */}
        <div className="relative aspect-video w-full overflow-hidden">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={`${API_URL}${img.image_url}`}
                alt={img.title || `Promotion ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Title Overlay */}
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">{img.title}</h3>
                  {img.description && (
                    <p className="text-white/70 text-sm mt-1">{img.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110"
                style={{ background: 'rgba(196,168,79,0.9)', backdropFilter: 'blur(8px)' }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110"
                style={{ background: 'rgba(196,168,79,0.9)', backdropFilter: 'blur(8px)' }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Navigation Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8' : 'w-2'
                }`}
                style={{
                  background: index === currentIndex ? '#C4A84F' : 'rgba(255,255,255,0.3)'
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && images.length > 1 && (
        <p className="text-center text-white/40 text-xs mt-3">
          🔄 Auto-playing • Click arrows to pause
        </p>
      )}
    </section>
  );
}


  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg,#C4A84F,#F0D080)' }} />
        <h2 className="text-xl font-black text-white">
          📸 Gallery & Promotions
        </h2>
      </div>

      <div className="relative glass-dark rounded-2xl overflow-hidden">
        {/* Main Image Display */}
        <div className="relative aspect-video w-full overflow-hidden">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={`${API_URL}${img.image_url}`}
                alt={img.title || `Promotion ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Title Overlay */}
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">{img.title}</h3>
                  {img.description && (
                    <p className="text-white/70 text-sm mt-1">{img.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          {/* Navigation Arrows */}
          {PROMO_IMAGES.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110"
                style={{ background: 'rgba(196,168,79,0.9)', backdropFilter: 'blur(8px)' }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110"
                style={{ background: 'rgba(196,168,79,0.9)', backdropFilter: 'blur(8px)' }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Navigation Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8' : 'w-2'
                }`}
                style={{
                  background: index === currentIndex ? '#C4A84F' : 'rgba(255,255,255,0.3)'
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && images.length > 1 && (
        <p className="text-center text-white/40 text-xs mt-3">
          🔄 Auto-playing • Click arrows to pause
        </p>
      )}
    </section>
  );
}
