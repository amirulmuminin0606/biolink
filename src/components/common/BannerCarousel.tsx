import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { BannerSlide } from '../../types/biolink';

interface BannerCarouselProps {
  slides?: BannerSlide[];
  fallbackUrl?: string;
  height?: number;
  fit?: 'cover' | 'contain';
  position?: 'center' | 'top' | 'bottom';
  autoSlide?: boolean;
  interval?: number; // in seconds
  isInteractive?: boolean;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  slides = [],
  fallbackUrl = '',
  height = 180,
  fit = 'cover',
  position = 'center',
  autoSlide = true,
  interval = 4,
  isInteractive = true,
}) => {
  const activeSlides = (slides || []).filter((s) => s.enabled && s.imageUrl);

  // If no active slides but fallbackUrl exists, use fallback as single slide
  const effectiveSlides: BannerSlide[] =
    activeSlides.length > 0
      ? activeSlides
      : fallbackUrl
      ? [{ id: 'fallback', imageUrl: fallbackUrl, enabled: true }]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keep index within bounds if slides change
  useEffect(() => {
    if (currentIndex >= effectiveSlides.length) {
      setCurrentIndex(0);
    }
  }, [effectiveSlides.length, currentIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!autoSlide || effectiveSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % effectiveSlides.length);
    }, (interval || 4) * 1000);

    return () => clearInterval(timer);
  }, [autoSlide, effectiveSlides.length, interval, isPaused]);

  if (effectiveSlides.length === 0) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="w-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-xs"
      >
        Belum ada banner
      </div>
    );
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? effectiveSlides.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % effectiveSlides.length);
  };

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentSlide = effectiveSlides[currentIndex];

  const handleSlideClick = () => {
    if (currentSlide.linkUrl && isInteractive) {
      window.open(currentSlide.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full relative overflow-hidden bg-slate-900 group select-none"
    >
      {/* Slides Container */}
      <div
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {effectiveSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            onClick={slide.linkUrl ? handleSlideClick : undefined}
            className={`w-full h-full shrink-0 relative overflow-hidden ${
              slide.linkUrl ? 'cursor-pointer' : ''
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || 'Banner Slide'}
              className="w-full h-full"
              style={{
                objectFit: fit,
                objectPosition: position,
              }}
            />

            {/* Gradient shadow overlay for aesthetic contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

            {/* Title / Promo Tag Overlay (if title exists) */}
            {slide.title && (
              <div className="absolute top-3 left-4 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
                  <span>{slide.title}</span>
                  {slide.linkUrl && <ExternalLink size={10} className="text-white/80" />}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows (shown if > 1 slide) */}
      {effectiveSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-md border border-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide berikutnya"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-md border border-white/10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            {effectiveSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                className={`transition-all rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ke slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
