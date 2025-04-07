'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [typedCommand, setTypedCommand] = useState('');
  const router = useRouter();

  // Switch Spline model after 9 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // Key event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (typedCommand === 'cd aboutme') {
          router.push('/aboutme');
        }
        setTypedCommand('');
      } else if (e.key === 'Backspace') {
        setTypedCommand('');
      } else if (e.key.length === 1) {
        setTypedCommand((prev) => (prev + e.key).slice(-20));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedCommand, router]);

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Spline iframe */}
      <div className="w-full h-full pointer-events-none">
        {activeModel === 1 ? (
          <iframe
            src="https://my.spline.design/progressbarscrollevent-3aac3574d664080593953458a814650d/"
            frameBorder="0"
            className="w-full h-full"
            allow="autoplay; fullscreen"
          ></iframe>
        ) : (
          <iframe
            src="https://my.spline.design/thepc-de0c3202fab3683d455ead2170633d43/"
            frameBorder="0"
            className="w-full h-full"
            allow="autoplay; fullscreen"
          ></iframe>
        )}
      </div>

      {/* Invisible overlay to keep keyboard focus */}
      <div className="absolute inset-0 z-10 pointer-events-none" tabIndex={0}></div>
    </main>
  );
}