import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Scroll Reading Progress Bar Pinned at Top */}
      <div className="fixed top-0 left-0 w-full h-[2.5px] z-[70] bg-transparent pointer-events-none">
        <div
          style={{ width: `${scrollProgress}%` }}
          className="h-full bg-red-600 transition-all duration-75"
        />
      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-black/90 text-white border border-neutral-700 hover:bg-red-600 hover:border-red-600 flex items-center justify-center shadow-2xl transition-all duration-300 transform ${
          showBackToTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
        } hover:scale-110 active:scale-95`}
        aria-label="Scroll back to top"
      >
        <ArrowUp size={20} className="stroke-[2.5]" />
      </button>
    </>
  );
}
