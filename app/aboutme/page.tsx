'use client';

export default function About() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      <iframe
        src="https://my.spline.design/patternbackground-8e7c0e03665c5a8c13b95812f0fc8909/" // Replace with your actual model URL
        frameBorder="0"
        className="w-full h-full"
        allow="autoplay; fullscreen"
      ></iframe>

      {/* Subbar */}
      <div className="absolute bottom-0 w-full text-center text-white text-base py-5 bg-black/50 backdrop-blur-sm">
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}