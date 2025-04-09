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
      className="min-h-screen bg-[#0F0909] text-white flex items-center justify-center"
    >
      <div className="relative w-full max-w-6xl flex px-4">
        {/* Square Sticky Note Close Button */}
        <motion.button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10"
          style={{
            backgroundColor: '#FEF3A2',
            color: '#0F0909',
            border: '1px solid #D9D38B',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            transform: 'rotate(2deg)',
            width: '80px',
            height: '80px',
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
          <span className="font-mono" style={{ fontSize: '0.9rem' }}>Close</span>
          <span className="font-mono" style={{ fontSize: '0.7rem' }}>(ESC)</span>
        </motion.button>

        {/* Separator Line */}
        <div className="absolute left-1/2 transform -translate-x-[50%] w-px h-full bg-white" />

        {/* Left Side: Name and Contact */}
        <div className="w-1/2 pr-12 flex flex-col justify-center items-end text-right">
          <h1 className="text-4xl font-mono mb-4">Chris Xu</h1>
          <p className="text-lg font-mono">Email: cxu57@illinois.edu</p>
          <p className="text-lg font-mono">Current Location: Champaign, IL</p>
          <div className="mt-4 space-x-14">
            <a
              href="https://linkedin.com/in/chrisyxu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono" style={{ color: '#ADD8E6' }}
            >
              /LinkedIn 
            </a>
            <a
              href="https://github.com/Typhlosion123"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono" style={{ color: '#ADD8E6' }}
            >
              /GitHub
            </a>
            <a
              href="https://chrisyxu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono" style={{ color: '#ADD8E6' }}
            >
              /Website
            </a>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-1/2 pl-12 flex flex-col justify-center">
          {/* Outer rounded square */}
          <div className="rounded-xl p-6 relative" style={{ backgroundColor: '#EEF1DB', border: '2px solid #0F0909' }}>
            {/* Red power light */}
            <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            
            {/* Inner square (monitor) */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#B0AEA5', border: '2px solid #0F0909' }}>
              <h2 className="text-2xl font-mono mb-4 text-[#0F0909]">About Me</h2>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                Hello, I am Chris Xu. 
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                I'm a first-year at UIUC studying computer engineering with plans to minor in either CS or semiconductors. I am interested in hardware-software integration as well as hardware system analysis.
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
              Currently I am an engineer at Illinois Medical Advancements through Design and Engineering (i-MADE) as a software engineer on the Stealth team. Here, we are using muscle EMG from a wearable sensor to determine muscle fatigue and set length. 
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                In addition to figuring out optimal muscle training, I am pursuing my own personal projects and applications for a position during the summer. 
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                If I'm not at club meetings or doing homework, you can find me at the gym hitting chest, running some poker, or playing Team Fight Tactics.
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                If there are a few things I value its hardwork, discpline, and problem solving. I try to follow these every day. 
              </p>
              <p className="text-base leading-relaxed text-[#0F0909] mb-4">
                If you want to talk about anything interesting, contact me on LinkedIn or email, I'm always ready to meet new people. 
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full text-center text-base py-5 bg-black/50 backdrop-blur-sm" style={{ color: '#FFFFFF' }}>
        © 2025 Chris Xu. All rights reserved.
      </div>
    </motion.div>
  );
}