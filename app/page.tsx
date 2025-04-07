'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [typedCommand, setTypedCommand] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  // Timer to switch models
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  // Focus management and cursor blink
  useEffect(() => {
    // Force focus on mount
    if (mainRef.current) {
      mainRef.current.focus();
    }

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Key listener for command
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for Enter key to avoid any form submission behavior
      if (e.key === "Enter") {
        e.preventDefault();
        if (typedCommand.trim().toLowerCase() === "cd aboutme") {
          router.push("/aboutme");
        }
        setTypedCommand("");
      } else if (e.key === "Backspace") {
        setTypedCommand(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && /[a-zA-Z0-9 ]/.test(e.key)) {
        setTypedCommand(prev => (prev + e.key).slice(-20));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedCommand, router]);

  return (
    <div 
      ref={mainRef}
      tabIndex={0} 
      className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen outline-none"
      onKeyDown={(e) => e.stopPropagation()} // Prevent event bubbling
    >
      {/* Command line feedback */}
      <div className="absolute top-4 left-4 z-50 text-green-500 font-mono text-sm">
        {">"} {typedCommand}
        <span className={`inline-block w-2 h-4 bg-green-500 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
      </div>

      {/* Spline iframes */}
      <div className="w-full h-full pointer-events-none">
        {activeModel === 1 ? (
          <iframe
            src="https://my.spline.design/progressbarscrollevent-3aac3574d664080593953458a814650d/"
            frameBorder="0"
            className="w-full h-full pointer-events-none"
          />
        ) : (
          <iframe
            src="https://my.spline.design/thepc-de0c3202fab3683d455ead2170633d43/"
            frameBorder="0"
            className="w-full h-full pointer-events-none"
            allow="autoplay; fullscreen"
          />
        )}
      </div>
    </div>
  );
}