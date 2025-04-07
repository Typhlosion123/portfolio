'use client';

import { useState, useEffect, useRef } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [inputCommand, setInputCommand] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);


  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (inputCommand.trim().toLowerCase() === "cd aboutme") {
          router.push('/aboutme');
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

  // Model switching effect
  useEffect(() => {
    const timer = setTimeout(() => setActiveModel(2), 9000);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Spline models */}
      <div className="w-full h-full">
        {activeModel === 1 ? (
          <Spline
            scene="https://prod.spline.design/7JTroMEqlN2ok6WN/scene.splinecode"
            className="w-full h-full"
          />
        ) : (
          <Spline
            scene="https://prod.spline.design/6UTcgkxAaa7nu36T/scene.splinecode"
            className="w-full h-full"
          />
        )}
      </div>
      <div className="absolute bottom-0 w-full text-center text-white text-base py-5 bg-black/50 backdrop-blur-sm">
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}