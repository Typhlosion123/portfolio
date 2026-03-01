'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showName, setShowName] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [zooming, setZooming] = useState(false);

  const fullName = "Chris Xu";

  const handleStart = () => {
    if (!started) setStarted(true);
  };

  // Loading bar animation
  useEffect(() => {
    if (!started) return;

    const duration = 3000; // 3 seconds to reach 100%
    const steps = 60;
    const increment = 100 / steps;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [started]);

  // Trigger name reveal after loading completes
  useEffect(() => {
    if (loadingProgress >= 100) {
      setTimeout(() => setShowName(true), 300);
    }
  }, [loadingProgress]);

  // Typing animation for name
  useEffect(() => {
    if (!showName) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullName.length) {
        setTypedText(fullName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150); // 150ms per character

    return () => clearInterval(typingInterval);
  }, [showName]);

  // Trigger zoom after typing completes
  useEffect(() => {
    if (typedText === fullName) {
      setTimeout(() => {
        setZooming(true);
        setTimeout(() => router.push('/computer'), 800);
      }, 800);
    }
  }, [typedText, router]);

  const handleSkip = () => router.push('/computer');

  // ESC key handler
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') handleSkip(); 
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started]);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen overflow-hidden select-none"
      onClick={handleStart}
      onTouchEnd={handleStart}
      style={{ backgroundColor: '#0F0909' }}
    >
      {/* Zoom overlay effect */}
      <div
        className={`absolute inset-0 z-50 bg-black transition-all duration-700 pointer-events-none ${
          zooming ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ backgroundColor: '#0F0909' }}
      />

      {/* Click/Tap to start prompt */}
      {!started && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <p className="text-white text-xl sm:text-2xl md:text-3xl font-light animate-pulse px-4 text-center cursor-pointer">
            Click to Start
          </p>
        </div>
      )}

      {/* Loading bar container */}
      {started && loadingProgress < 100 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-8 sm:px-16 md:px-32">
          <div className="w-full max-w-2xl">
            {/* Loading bar background */}
            <div className="w-full h-2 sm:h-3 md:h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Loading bar progress */}
              <div
                className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            {/* Optional: Progress percentage */}
            <p className="text-white text-center mt-4 text-sm sm:text-base font-light">
              {Math.floor(loadingProgress)}%
            </p>
          </div>
        </div>
      )}

      {/* Name typing animation */}
      {showName && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide px-4 text-center">
            {typedText}
            {typedText.length < fullName.length && (
              <span className="animate-pulse">|</span>
            )}
          </h1>
        </div>
      )}

      {/* Skip Button */}
      {started && !zooming && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleSkip(); }}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); handleSkip(); }}
          className="absolute top-4 right-4 z-50 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white bg-white/10 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/20 active:bg-white/30 transition-all pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px] border border-white/20"
          aria-label="Skip Intro"
        >
          <span className="hidden sm:inline">Skip Intro (esc)</span>
          <span className="sm:hidden">Skip</span>
        </button>
      )}
    </main>
  );
}