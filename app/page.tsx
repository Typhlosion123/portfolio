import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Spline component with no SSR (Server-Side Rendering)
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Spline 3D model */}
      <Spline scene="https://app.spline.design/file/c2639800-a10c-47ae-bbeb-912b9c8969e3" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      
      {/* "Hello World" text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        fontSize: '3rem', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
      }}>
        Hello World
      </div>
    </div>
  );
};

export default LandingPage;