'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ResumePage() {
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
          router.push('/computer');
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  const resumeImage = "/resume-image.png";

  if (!isClient) {
    return (
      <div style={{ backgroundColor: '#0F0909', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#B0AEA5' }}>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Black overlay for fade-out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />
      
      <main className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#0F0909' }}>
        
        <div className="w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#B0AEA5' }}>
          {/* Larger square sticky note Close Button */}
          <motion.button
            onClick={() => {
              setIsFading(true);
              setTimeout(() => router.push('/computer'), 500);
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

          <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#EEF1DB' }}>
            <a
              href="Chris_Xu_Resume_10_10_2025.pdf"
              download="Chris_Xu_Resume.pdf"
              className="px-4 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono text-sm"
              style={{ backgroundColor: '#0F0909' }}
            >
              Download PDF
            </a>
            <h1 className="text-xl font-mono text-black absolute left-1/2 transform -translate-x-1/2">
              Last updated: 11/7/2025
            </h1>
          </div>

          <div className="p-4">
            <div className="border-2 rounded-md overflow-auto max-h-[80vh] flex justify-center pt-4 pb-4" style={{ borderColor: '#0F0909' }}>
              <Image 
                src={resumeImage}
                alt="Chris Xu's Resume"
                width={812}
                height={1051}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="p-2 text-center text-xs font-mono" style={{ backgroundColor: '#EEF1DB', color: '#0F0909' }}>
          <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            Press ESC to return to terminal
          </div>
        </div>

        
      </main>
      {/* <div className="absolute bottom-0 w-full text-center text-base py-5" style={{ color: '#FFFFFF' }}>
          © 2025 Chris Xu. All rights reserved.
        </div> */}
    </div>
  );
}