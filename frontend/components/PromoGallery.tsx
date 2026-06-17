'use client';
import { useState, useEffect } from 'react';

// Add your promotional images here - just add the filename to this array
const PROMO_IMAGES = [
  '/promo/promo-1.jpg',
  '/promo/promo-2.jpg',
  '/promo/promo-3.jpg',
  // Add more images as needed
];

export default function PromoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_IMAGES.length) % PROMO_IMAGES.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_IMAGES.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (PROMO_IMAGES.length === 0) return null;

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
          {PROMO_IMAGES.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Promotion ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect fill="%230A2647" width="800" height="450"/%3E%3Ctext x="400" y="225" text-anchor="middle" fill="%23C4A84F" font-size="24" font-family="Arial"%3EPromotion Image ${index + 1}%3C/text%3E%3C/svg%3E';
                }}
              />
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
            {currentIndex + 1} / {PROMO_IMAGES.length}
          </div>
        </div>

        {/* Thumbnail Navigation Dots */}
        {PROMO_IMAGES.length > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {PROMO_IMAGES.map((_, index) => (
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
      {isAutoPlaying && PROMO_IMAGES.length > 1 && (
        <p className="text-center text-white/40 text-xs mt-3">
          🔄 Auto-playing • Click arrows to pause
        </p>
      )}
    </section>
  );
}
