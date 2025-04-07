'use client';

import { useState, useEffect } from "react";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2); // After 7 seconds, switch to the second model
    }, 9000);

    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen">
      <div className="w-full h-full">
        {activeModel === 1 ? (
          <iframe
            src="https://my.spline.design/progressbarscrollevent-3aac3574d664080593953458a814650d/"
            frameBorder="0"
            className="w-full h-full"
            //allow="autoplay; fullscreen"
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