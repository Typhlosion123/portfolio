'use client';

import { useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveModel(2); // After 9 seconds, switch to the second model
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black w-screen h-screen">
      <div className="w-full h-full">
        {activeModel === 1 ? (
          <Spline
            scene="https://prod.spline.design/7JTroMEqlN2ok6WN/scene.splinecode"
            className="w-full h-full"
            onLoad={() => {
              console.log('Model 1 Loaded');
              setIsLoading(false);
            }}
            onError={() => console.error('Error loading Model 1')}
          />
        ) : (
          <Spline
            scene="https://prod.spline.design/6UTcgkxAaa7nu36T/scene.splinecode"
            className="w-full h-full"
            onLoad={() => {
              console.log('Model 2 Loaded');
              setIsLoading(false);
            }}
            onError={() => console.error('Error loading Model 2')}
          />
        )}
      </div>
    </main>
  );
}