// ============================================
// FILE: src/components/shared/HeroBanner.jsx
// ============================================

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroBanner = ({ imageSrc, alt, height = 600, className }) => {
  return (
    <div
      className={cn("relative w-full overflow-hidden group", className)}
      style={{ height: `${height}px` }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

const HeroBannerCarousel = ({ onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  const banners = [
    { imageSrc: "/ip17pm.png", alt: "iPhone 17 Pro Max", height: 610 },
    { imageSrc: "/ipAir.png", alt: "iPhone Air", height: 610 },
    { imageSrc: "/ip17.png", alt: "iPhone 17", height: 610 },
  ];

  const actualCount = banners.length;
  const extendedBanners = [
    banners[actualCount - 1], // clone cuối
    ...banners,
    banners[0], // clone đầu
  ];

  // Auto-play: chuyển slide mỗi 5s
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => goToNext(true), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Khi transition kết thúc → reset index nếu đang ở clone
  const handleTransitionEnd = () => {
    if (currentIndex === extendedBanners.length - 1) {
      // Đang ở clone đầu → nhảy về banner thật đầu tiên
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // Đang ở clone cuối → nhảy về banner thật cuối cùng
      setIsTransitioning(false);
      setCurrentIndex(actualCount);
    }
  };

  // Kích hoạt lại transition khi index thay đổi
  useEffect(() => {
    if (!isTransitioning) {
      // Cho DOM update xong, sau đó bật lại transition
      const id = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(id);
    }
  }, [isTransitioning]);

  const goToNext = (auto = false) => {
    if (!auto) setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index + 1);
  };

  return (
    <div className="relative w-full mb-2.5 group/carousel">
      <div
        className="relative overflow-hidden rounded-none md:rounded-2xl"
        ref={containerRef}
      >
        <div
          className={cn(
            "flex",
isTransitioning && "transition-transform duration-700 ease-in-out"
          )}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedBanners.map((banner, index) => (
            <div key={index} className="min-w-full">
              <HeroBanner {...banner} />
            </div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full w-12 h-12 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full w-12 h-12 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300",
              currentIndex - 1 === index
                ? "bg-white w-6 md:w-8"
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Nút pause/play */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="hidden md:block absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
      >
        {isAutoPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export { HeroBanner, HeroBannerCarousel };