import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Perfume } from '../types/api';

interface ExtraitCarouselProps {
  perfumes: Perfume[];
}

const ExtraitCarousel = ({ perfumes }: ExtraitCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const extraitPerfumes = perfumes.filter(
    (perfume) => perfume.concentration.toLowerCase() === 'extrait'
  );

  useEffect(() => {
    if (extraitPerfumes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % extraitPerfumes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [extraitPerfumes.length]);

  if (extraitPerfumes.length === 0) return null;

  const currentPerfume = extraitPerfumes[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % extraitPerfumes.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + extraitPerfumes.length) % extraitPerfumes.length);
  };

  return (
    <div className="mb-8 sm:mb-12">
      <div className="relative bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-64 sm:h-80 lg:h-96">
          {/* Background Image */}
          <div className="absolute inset-0">
            {currentPerfume.uri ? (
              <img
                src={currentPerfume.uri}
                alt={currentPerfume.perfumeName}
                className="w-full h-full object-cover opacity-30"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
            )}
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-6 sm:px-12 lg:px-16">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
                  ✨ Extrait Collection
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                  {currentPerfume.perfumeName}
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-2">
                  {currentPerfume.brand.brandName}
                </p>
                <p className="text-white/80 mb-6 line-clamp-2">
                  {currentPerfume.description}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    ${currentPerfume.price}
                  </span>
                  <button
                    onClick={() => navigate(`/perfumes/${currentPerfume._id}`)}
                    className="cursor-pointer px-6 py-3 bg-white text-rose-600 rounded-full font-semibold hover:bg-rose-50 transition-all shadow-lg"
                  >
                    Discover More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {extraitPerfumes.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {extraitPerfumes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {extraitPerfumes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraitCarousel;
