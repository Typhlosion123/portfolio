'use client';

import { useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [timerStarted, setTimerStarted] = useState(false);

  // Start timer on click
  const handleClick = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  // Redirect after 9 seconds if timer was started
  useEffect(() => {
    if (!timerStarted) return;
    
    const timer = setTimeout(() => {
      router.push('/computer');
    }, 9000);

    return () => clearTimeout(timer);
  }, [timerStarted, router]);

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-full">
        <Spline
          scene="https://prod.spline.design/7JTroMEqlN2ok6WN/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className="absolute bottom-0 w-full text-center text-white text-base py-5 bg-black/50 backdrop-blur-sm">
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}