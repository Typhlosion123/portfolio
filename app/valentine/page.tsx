"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ValentinePage = () => {
  const [noCount, setNoCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  // You can replace these URLs with your specific local paths later
  const images = [
    "/initial.gif",
    "/no_1.gif",
    "/no_2.gif",
    "/no_3.gif",
    "/no_4.gif",
    "/no_5.gif",
  ];

  const successImage = "/success.gif";

  const phrases = [
    "Will you be my valentine?",
    "Are you sure?",
    "Are you really sure?",
    "I'll give you a cookie!",
    "Don't do this to me :(",
    "Okay, I'll stop asking... JUST KIDDING YES PLS",
    "I'll give you a cookie! (Part 2)",
    "Change your mind?",
    "Is that your final answer?",
    "No way thats your final answer...right...?",
  ];

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setIsAccepted(true);
  };

  // Base dimensions for buttons
  const baseFontSize = 18;
  const basePaddingX = 32;
  const basePaddingY = 12;

  // Growth logic
  const yesFontSize = baseFontSize + noCount * 25; 
  const yesPaddingX = basePaddingX + noCount * 20; 
  const yesPaddingY = basePaddingY + noCount * 12; 
  
  // Image shrinks
  const imageScale = 1;

  if (isAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
        <div className="animate-bounce">
          <img 
            src={successImage} 
            alt="Happy celebration" 
            className="rounded-lg shadow-lg mb-8 max-w-[300px]"
          />
        </div>
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-2">
          Yay!!!
        </h1>
        <p className="text-gray-600 italic text-xl">See you on the 21st!!</p>
      </div>
    );
  }

  const currentImageIndex = noCount === 0 ? 0 : Math.min(Math.floor(noCount / 2), images.length - 1);
  const currentPhrase = phrases[Math.min(noCount, phrases.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 transition-all duration-300 overflow-hidden relative">
      {/* Image Container */}
      <div 
        className="mb-8 transition-transform duration-500 ease-in-out flex items-center justify-center min-h-[300px]"
        style={{ transform: `scale(${imageScale})` }}
      >
        <img 
          src={images[currentImageIndex]} 
          alt="Valentine illustration" 
          className="rounded-xl shadow-xl max-w-[300px] sm:max-w-[400px] h-auto object-cover"
        />
      </div>

      {/* Text Question */}
      <h1 className="text-3xl font-bold text-gray-800 text-center max-w-md relative z-10">
        {currentPhrase}
      </h1>

      {/* Buttons Container */}
      <div className="flex items-center justify-center gap-6 relative w-full max-w-xl min-h-[150px]">
        <button
          onClick={handleYesClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 shadow-xl active:scale-95 whitespace-nowrap z-50 relative"
          style={{ 
            fontSize: `${yesFontSize}px`,
            padding: `${yesPaddingY}px ${yesPaddingX}px`,
            // Negative margin pulls it over the "No" button as it grows, compensating for the initial gap
            marginRight: noCount > 0 ? `-${Math.min(noCount * 25 + 20, 150)}px` : '0px'
          }}
        >
          Yes
        </button>

        <button
          onClick={handleNoClick}
          className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap z-0 relative"
          style={{
            fontSize: `${baseFontSize}px`,
            padding: `${basePaddingY}px ${basePaddingX}px`
          }}
        >
          {noCount === 0 ? "No" : "Wait, let me rethink..."}
        </button>
      </div>
      
      {/* Decorative Hearts */}
      <div className="fixed bottom-10 left-10 opacity-20 hidden md:block animate-pulse">
         <Heart className="w-12 h-12 text-pink-200 fill-pink-200" />
      </div>
      <div className="fixed top-10 right-10 opacity-20 hidden md:block animate-pulse">
         <Heart className="w-16 h-16 text-pink-200 fill-pink-200" />
      </div>
    </div>
  );
};

export default function App() {
  return <ValentinePage />;
}