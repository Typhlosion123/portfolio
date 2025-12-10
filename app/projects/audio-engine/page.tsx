'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AudioEnginePage() {
  const [isFading, setIsFading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setIsFading(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFading(true);
        setTimeout(() => {
          router.push('/projects');
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  if (!isClient) {
    return (
      <div style={{ backgroundColor: '#0F0909', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#B0AEA5' }}>Loading audio engine...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fade Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />

      <main
        className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#0F0909' }}
      >
        <div className="w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#B0AEA5' }}>
          
          {/* Close Button */}
          <motion.button
            onClick={() => {
              setIsFading(true);
              setTimeout(() => router.push('/projects'), 500);
            }}
            className="absolute top-4 right-4 font-mono z-10"
            style={{
              backgroundColor: '#FEF3A2',
              color: '#0F0909',
              border: '1px solid #D9D38B',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              transform: 'rotate(2deg)',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              padding: '0.5rem',
              textAlign: 'center'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close (ESC)
          </motion.button>

          {/* Header */}
          <div className="flex justify-center items-center p-4" style={{ backgroundColor: '#EEF1DB' }}>
            <h1 className="text-2xl font-mono text-black">
              Ray Traced Audio Engine (Stereo Headphones Required)
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-10">

            {/* === DEMO 1 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                {/* HTML Sim */}
                <div
                    className="border-2 rounded-md overflow-hidden flex items-center justify-center bg-black"
                    style={{ borderColor: '#0F0909' }}
                >
                    <iframe
                    src="/audio_sim_full_wall.html"
                    className="w-full h-full min-h-[350px]"
                    style={{
                        border: "none",
                        aspectRatio: "16 / 9",
                    }}
                    />
                </div>

                {/* Audio Player */}
                <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
                    <p className="font-mono text-lg text-black text-center">
                    Full Wall Diffraction and Reflection
                    </p>
                    <audio controls className="w-full max-w-md">
                    <source src="/audio_sim_full_wall.wav" type="audio/wav" />
                    </audio>
                </div>

                </div>

            {/* === DEMO 2 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                {/* HTML Sim */}
                <div
                    className="border-2 rounded-md overflow-hidden flex items-center justify-center bg-black"
                    style={{ borderColor: '#0F0909' }}
                >
                    <iframe
                    src="/audio_sim_wall_hole.html"
                    className="w-full h-full min-h-[350px]"
                    style={{
                        border: "none",
                        aspectRatio: "16 / 9",
                    }}
                    />
                </div>

                {/* Audio Player */}
                <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
                    <p className="font-mono text-lg text-black text-center">
                    Wall With Hole Diffraction
                    </p>
                    <audio controls className="w-full max-w-md">
                    <source src="/audio_sim_wall_hole.wav" type="audio/wav" />
                    </audio>
                </div>

                </div>
                <a
                    href={"https://www.github.com/Typhlosion123/audio-engine"}
                    target={"_blank"}
                    className="inline-block px-6 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono"
                    style={{ backgroundColor: '#0F0909' }}
                  >
                    View on GitHub
                  </a>
          </div>

          {/* Footer */}
          <div className="p-2 text-center text-xs font-mono relative" style={{ backgroundColor: '#EEF1DB', color: '#0F0909' }}>
            <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            Press ESC to return to projects
          </div>

        </div>
      </main>
    </div>
  );
}
