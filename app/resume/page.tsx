'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const resumeImage = "/resume-image.png"; // Replace with your actual image path

  if (!isClient) {
    return (
      <div style={{ backgroundColor: '#0F0909', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#B0AEA5' }}>Loading application...</p>
      </div>
    );
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: '#0F0909' }}>
      
      <div className="w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: '#B0AEA5' }}>
        <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#EEF1DB' }}>
          <h1 className="text-xl font-mono text-black">Last updated: 3/31/2025</h1>
          <div className="flex space-x-2">
            <a
              href="/resume.pdf" // Keep this as the actual PDF download
              download="Chris_Xu_Resume.pdf"
              className="px-4 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono text-sm"
              style={{ backgroundColor: '#0F0909' }}
            >
              Download
            </a>
            <button
              onClick={() => {
                setIsFading(true);
                setTimeout(() => router.push('/computer'), 500);
              }}
              className="px-4 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono text-sm"
              style={{ backgroundColor: '#0F0909' }}
            >
              Close (ESC)
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="border-2 rounded-md overflow-auto max-h-[80vh] flex justify-center" style={{ borderColor: '#0F0909' }}>
            <Image 
              src={resumeImage}
              alt="Chris Xu's Resume"
              width={812}
              height={1051} // Adjust based on your image aspect ratio
              className="object-contain mt-4"
              priority
            />
          </div>
        </div>

        <div className="p-2 text-center text-xs font-mono" style={{ backgroundColor: '#EEF1DB', color: '#0F0909' }}>
          Press ESC to return to terminal
        </div>
      </div>

      <div className="absolute bottom-0 w-full text-center text-base py-5 bg-black/50 backdrop-blur-sm" style={{ color: '#FFFFFF' }}>
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}