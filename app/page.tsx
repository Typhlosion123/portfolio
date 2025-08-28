'use client';

import { useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [timerStarted, setTimerStarted] = useState(false);

  const handleClick = () => {
    if (!timerStarted) setTimerStarted(true);
  };

  useEffect(() => {
    if (!timerStarted) return;
    const timer = setTimeout(() => router.push('/computer'), 9000);
    return () => clearTimeout(timer);
  }, [timerStarted, router]);

  const handleSkip = () => router.push('/computer');

  useEffect(() => {
    if (!timerStarted) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleSkip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [timerStarted]);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen cursor-pointer"
      onClick={handleClick}
    >
      {/* Spline as a background layer */}
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/7JTroMEqlN2ok6WN/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Skip Button (appears only after first click), forced above Spline */}
      {timerStarted && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleSkip(); }}
          className="absolute top-4 right-4 z-50 px-4 py-2 text-sm font-medium text-white bg-black/70 rounded-lg shadow-md hover:bg-black/90 transition pointer-events-auto"
          aria-label="Skip Intro"
        >
          Skip Intro (esc)
        </button>
      )}

      {/* Footer above Spline too */}
      <div className="absolute bottom-0 z-10 w-full text-center text-white text-base py-5 bg-black/50 backdrop-blur-sm">
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}
