'use client';

import { useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [inputCommand, setInputCommand] = useState("");
  const router = useRouter();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: { key: string | any[]; preventDefault: () => void; }) => {
      if (e.key === "Enter") {
        if (inputCommand.trim().toLowerCase() === "cd aboutme") {
          router.push('/aboutme');
          window.history.pushState({}, '', '/aboutme');
        }
        setInputCommand(""); // Clear input on Enter
      } else if (e.key === "Backspace") {
        setInputCommand(prev => prev.slice(0, -1));
        e.preventDefault();
      } else if (e.key.length === 1) {
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
      {/* Hidden command input display */}
      <div className="absolute top-0 left-0 z-50 p-4 text-white font-mono pointer-events-none">
        {">"} {inputCommand}
      </div>

      {/* Hidden input to capture keyboard events */}
      <input
        type="text"
        autoFocus
        className="absolute opacity-0 w-0 h-0"
        onBlur={({ target }) => target.focus()}
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
    </main>
  );
}