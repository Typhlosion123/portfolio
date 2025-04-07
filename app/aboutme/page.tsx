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
          <div className="mt-4 space-y-25">
            <a
              href="https://linkedin.com/in/chrisyxu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-400 hover:underline"
            >
              /LinkedIn 
            </a>
            <a
              href="https://github.com/Typhlosion123"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-400 hover:underline"
            >
              /GitHub
            </a>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-1/2 pl-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p className="text-base leading-relaxed">
            I’m a passionate developer with a love for solving complex problems and building interactive web applications. I enjoy working with modern technologies and always seek to learn something new.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
