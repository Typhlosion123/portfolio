'use client';

import React from "react";
import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-[#0F0909] text-white flex items-center justify-center"
    >
      <div className="relative w-full max-w-6xl flex px-4">
        {/* Separator Line */}
        <div className="absolute left-1/2 transform -translate-x-[40%] w-px h-full bg-white" />

        {/* Left Side: Name and Contact */}
        <div className="w-1/2 pr-12 flex flex-col justify-center items-end text-right">
          <h1 className="text-4xl font-bold mb-4">Chris Xu</h1>
          <p className="text-lg">Email: cxu57@illinois.edu</p>
          <p className="text-lg">Current Location: Champaign, IL</p>
          <div className="mt-4 space-x-14">
            <a
              href="https://linkedin.com/in/chrisyxu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline" style = {{color: '#227C9D'}}
            >
              /LinkedIn 
            </a>
            <a
              href="https://github.com/Typhlosion123"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline" style = {{color: '#227C9D'}}
            >
              /GitHub
            </a>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-1/2 pl-12 flex flex-col justify-center">
          {/* Outer rounded square */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#EEF1DB', border: '2px solid #0F0909' }}>
            {/* Inner square (monitor) */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#B0AEA5', border: '2px solid #0F0909' }}>
              <h2 className="text-2xl font-semibold mb-4 text-[#0F0909]">About Me</h2>
              <p className="text-base leading-relaxed text-[#0F0909]">
                Hello, I am Chris Xu. 

                I am a first-year at UIUC studying computer engineering with plans to minor in CS. I am orignally from Winnetka, IL.
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