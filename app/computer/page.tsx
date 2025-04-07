'use client';

import { useState, useEffect, useRef } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function ComputerPage() {
  const [inputCommand, setInputCommand] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [showFileStructure, setShowFileStructure] = useState(false);
  const [fileStructureOpacity, setFileStructureOpacity] = useState(0);
  const [fileStructurePosition, setFileStructurePosition] = useState("left"); // 'left' or 'right'
  const router = useRouter();
  const inputRef = useRef(null);

  // Add delay for file structure display
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFileStructure(true);
      // Start fade-in animation
      setFileStructureOpacity(0);
      const fadeTimer = setInterval(() => {
        setFileStructureOpacity(prev => {
          const newOpacity = prev + 0.05;
          if (newOpacity >= 1) {
            clearInterval(fadeTimer);
            return 1;
          }
          return newOpacity;
        });
      }, 30);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (inputCommand.trim().toLowerCase() === "cd aboutme") {
          setShowFileStructure(false);
          setIsFading(true);
          setTimeout(() => {
            router.push('/aboutme');
          }, 500);
        } else if (inputCommand.trim().toLowerCase() === "cd resume") {
          setShowFileStructure(false);
          setIsFading(true);
          setTimeout(() => {
            router.push('/resume');
          }, 500);
        } else if (inputCommand.trim().toLowerCase() === "cd projects") {
          setShowFileStructure(false);
          setIsFading(true);
          setTimeout(() => {
            router.push('/projects');
          }, 500);
        } else if (inputCommand.trim().toLowerCase() === "cd experience") {
          setShowFileStructure(false);
          setIsFading(true);
          setTimeout(() => {
            router.push('/experience');
          }, 500);
        } 
        setInputCommand("");
      } else if (e.key === "Backspace") {
        setInputCommand("");
      } else if (e.key === "ArrowRight") {
        // Move file structure to the right and make it bigger
        setFileStructurePosition("right");
      } else if (e.key === "ArrowLeft") {
        setFileStructurePosition("left");
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setInputCommand(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputCommand, router]);

  const navigateTo = (path: string) => {
    setIsFading(true);
    setTimeout(() => {
      if (path === 'aboutme') {
        router.push('/aboutme');
      } else {
        router.push(`/${path}`);
      }
    }, 500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen relative">
      {/* Command display */}
      <div className="absolute top-0 left-0 z-50 p-4 text-white font-mono">
        {">"} {inputCommand}
      </div>

      {/* File structure display */}
      {showFileStructure && (
        <div className={` z-50 text-white font-mono bg-black/80 rounded-lg border-6 border-[#F9F6EE] transition-all  ${
          fileStructurePosition === "left" 
            ? "absolute top-70 left-140 p-6 duration-3000 ease-in" 
            : "absolute top-110 left-15 p-8 w-[80rm] duration-1000 ease-in-out" 
        }`} style={{ opacity: fileStructureOpacity }}>
          <div className={`mb-4 ${fileStructurePosition === "right" ? "text-3xl" : "text-xl"}`}>File Structure:</div>
          <div className={fileStructurePosition === "left" ? "text-xl" : "text-3xl"}>
            <div>/home(current)</div>
            <div className="ml-4 space-y-2 mt-2">
              <button 
                onClick={() => {
                 navigateTo('aboutme')
                 setShowFileStructure(false);
                }} 
                className="hover:underline hover:text-[#ADD8E6] cursor-pointer block text-left"
              >
                |-aboutme
              </button>
              <button 
                onClick={() => {
                  navigateTo('resume')
                 setShowFileStructure(false);
                }} 
               className="hover:underline hover:text-[#ADD8E6] cursor-pointer block text-left"
              >
                |-resume
              </button>
              <button 
               onClick={() => {
                  navigateTo('projects')
                  setShowFileStructure(false);
                }} 
               className="hover:underline hover:text-[#ADD8E6] cursor-pointer block text-left"
              >
                |-projects
              </button>
              <button 
                onClick={() => {
                 navigateTo('experience')
                 setShowFileStructure(false);
               }} 
                className="hover:underline hover:text-[#ADD8E6] cursor-pointer block text-left"
              >
               |-experience
             </button>
            </div>
         </div>
          <p className={`font-mono text-white mt-6 ${
            fileStructurePosition === "left" ? "text-xl" : "text-3xl"
          }`}>
            Click to navigate or type <span className="text-yellow-300">cd (folder)</span>
          </p>
       </div>
      )}

      {/* Hidden input to capture keyboard events */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0"
        value={inputCommand}
        onChange={(e) => setInputCommand(e.target.value)}
      />

      {/* Spline model */}
      <div className="w-full h-full">
        <Spline
          scene="https://prod.spline.design/6UTcgkxAaa7nu36T/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Fade effect */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-500 ${isFading ? 'opacity-100' : 'opacity-0'}`}
      ></div>

      <div className="absolute bottom-0 w-full text-center text-white text-base py-5 bg-black/50 backdrop-blur-sm">
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}