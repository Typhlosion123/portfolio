'use client';

import { useState, useEffect, useRef } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function ComputerPage() {
  const [inputCommand, setInputCommand] = useState("");
  const [isFading, setIsFading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (inputCommand.trim().toLowerCase() === "cd aboutme") {
          setIsFading(true);
          setTimeout(() => {
            router.push('/aboutme');
          }, 500);
        } else if (inputCommand.trim().toLowerCase() === "cd resume") {
          setIsFading(true);
          setTimeout(() => {
            router.push('/resume');
          }, 500);
        } else if (inputCommand.trim().toLowerCase() === "cd chickenjockey") {
          setIsFading(true);
          setTimeout(() => {
            window.location.href = "https://www.youtube.com/watch?v=vWQpiMd-v0A";
          }, 500);
        }
        setInputCommand("");
      } else if (e.key === "Backspace") {
        setInputCommand("");
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setInputCommand(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputCommand, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen relative">
      {/* Command display */}
      <div className="absolute top-0 left-0 z-50 p-4 text-white font-mono">
        {">"} {inputCommand}
      </div>

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