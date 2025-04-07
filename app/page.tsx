'use client';

import { useState, useEffect } from "react";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2); // After 7 seconds, switch to the second model
    }, 7000);

    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white absolute z-10">Spline 3D Model</h1>
      <div className="w-2500 h-1100">
        {activeModel === 1 ? (
          <iframe
            src="https://my.spline.design/progressbarscrollevent-3aac3574d664080593953458a814650d/"
            frameBorder="0"
            className="w-full h-full"
            allow="autoplay; fullscreen"
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
