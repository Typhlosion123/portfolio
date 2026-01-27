'use client';

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AboutMe() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/computer');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-[#0F0909] text-white flex items-center justify-center py-8 px-4"
    >
      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-0">
        {/* Square Sticky Note Close Button */}
        <motion.button
          onClick={handleClose}
          onTouchEnd={(e) => { e.preventDefault(); handleClose(); }}
          className="absolute top-0 right-0 z-10 touch-manipulation"
          style={{
            backgroundColor: '#FEF3A2',
            color: '#0F0909',
            border: '1px solid #D9D38B',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            transform: 'rotate(2deg)',
            width: '70px',
            height: '70px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.5rem',
            textAlign: 'center'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-mono text-sm">Close</span>
          <span className="font-mono text-xs hidden sm:inline">(ESC)</span>
        </motion.button>

        {/* Left Side: Name and Contact */}
        <div className="w-full lg:w-1/2 lg:pr-12 flex flex-col justify-center items-center lg:items-end text-center lg:text-right pt-20 lg:pt-0">
          <h1 className="text-3xl sm:text-4xl font-mono mb-4">Chris Xu</h1>
          <p className="text-base sm:text-lg font-mono mb-2">Email: cxu57@illinois.edu</p>
          <p className="text-base sm:text-lg font-mono mb-4">Current Location: Champaign, IL</p>
          <div className="flex flex-row gap-4 sm:gap-8 mt-4 flex-wrap justify-center lg:justify-end">
            <a
              href="https://linkedin.com/in/chrisyxu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono touch-manipulation min-h-[44px] flex items-center justify-center" 
              style={{ color: '#ADD8E6' }}
            >
              /LinkedIn 
            </a>
            <a
              href="https://github.com/Typhlosion123"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono touch-manipulation min-h-[44px] flex items-center justify-center" 
              style={{ color: '#ADD8E6' }}
            >
              /GitHub
            </a>
            <a
              href="https://www.chrisyxu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono touch-manipulation min-h-[44px] flex items-center justify-center" 
              style={{ color: '#ADD8E6' }}
            >
              /Website
            </a>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col justify-center">
          {/* Outer rounded square */}
          <div className="rounded-xl p-4 sm:p-6 relative" style={{ backgroundColor: '#EEF1DB', border: '2px solid #0F0909' }}>
            {/* Red power light */}
            <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            
            {/* Inner square (monitor) */}
            <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: '#B0AEA5', border: '2px solid #0F0909' }}>
              <h2 className="text-xl sm:text-2xl font-mono mb-4 text-[#0F0909]">About Me</h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                Hello, I am Chris Xu. 
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                I'm a second-year with junior standing at UIUC studying computer engineering with plans to minor in math or semiconductors. I am interested in hardware-software integration as well as hardware system analysis.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                Currently I am an engineer at Illinois Medical Advancements through Design and Engineering (i-MADE) as a software engineer on the Stealth team. Here, we are using muscle EMG from a wearable sensor to determine muscle fatigue and set length. 
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                In addition to figuring out optimal muscle training, I am pursuing my own personal projects and applications for a position during the summer. 
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                If I'm not at club meetings or doing homework, you can find me at the gym hitting chest, running some poker, or playing Team Fight Tactics.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                If there are a few things I value its hardwork, discpline, and problem solving. I try to follow these every day. 
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0F0909] mb-4">
                If you want to talk about anything interesting, contact me on LinkedIn or email, I'm always ready to meet new people. 
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-0 w-full text-center text-xs sm:text-base py-3 sm:py-5 bg-black/50 backdrop-blur-sm" style={{ color: '#FFFFFF' }}>
        © 2025 Chris Xu. All rights reserved.
      </div> */}
    </motion.div>
  );
}