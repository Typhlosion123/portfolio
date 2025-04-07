'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [typedCommand, setTypedCommand] = useState("");
  const router = useRouter();

  // Timer to switch models
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  // Key listener for command
  useEffect(() => {
    const handleKeyDown = (e: { key: string | any[]; }) => {
      if (e.key === "Enter") {
        if (typedCommand === "cd aboutme") {
          router.push("/aboutme/page.tsx");
        }
        setTypedCommand(""); // Reset either way
      } else if (e.key === "Backspace") {
        setTypedCommand(""); // Clear on backspace
      } else if (e.key.length === 1) {
        // Only capture printable characters
        setTypedCommand((prev) => (prev + e.key).slice(-20));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedCommand, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen">
      <div className="w-full h-full">
        {activeModel === 1 ? (
          <iframe
            src="https://my.spline.design/progressbarscrollevent-3aac3574d664080593953458a814650d/"
            frameBorder="0"
            className="w-full h-full"
          ></iframe>
        ) : (
          <iframe
            src="https://my.spline.design/thepc-de0c3202fab3683d455ead2170633d43/"
            frameBorder="0"
            className="w-full h-full"
            allow="autoplay; fullscreen"
          ></iframe>
        )}
      </div>
    </main>
  );
}
