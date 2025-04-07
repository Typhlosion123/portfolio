'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure pdf.js worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumePage() {
  const [isFading, setIsFading] = useState(true);
  const router = useRouter();

  // Fade in effect when component mounts
  useEffect(() => {
    setIsFading(false);
  }, []);

  // Handle back to computer command
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFading(true);
        setTimeout(() => {
          router.push('/computer');
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  // Replace with your actual PDF file path
  const pdfFile = "/resume.pdf"; // Place your PDF file in the public folder

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: '#0F0909' }}>
      
      <div className="w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: '#B0AEA5' }}>
        <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#EEF1DB' }}>
          <h1 className="text-xl font-mono text-black" >Last updated: 3/31/2025</h1>
          <div className="flex space-x-2">
            <a
              href={pdfFile}
              download="Chris_Xu_Resume.pdf"
              className="px-4 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono text-sm"
              style={{ backgroundColor: '#0F0909' }}
            >
              Download
            </a>
            <button
              onClick={() => {
                setIsFading(true);
                setTimeout(() => router.push('/computer'), 500);
              }}
              className="px-4 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono text-sm"
              style={{ backgroundColor: '#0F0909' }}
            >
              Close (ESC)
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="border-2 rounded-md overflow-auto max-h-[80vh] flex justify-center" style={{ borderColor: '#0F0909' }}>
            <Document
              file={pdfFile}
              loading={
                <div className="flex justify-center items-center h-64">
                  <p style={{ color: '#0F0909' }}>Loading resume...</p>
                </div>
              }
            >
              <Page
                pageNumber={1}
                width={800}
                renderTextLayer={false}
                loading={
                  <div className="flex justify-center items-center h-64">
                    <p style={{ color: '#0F0909' }}>Loading page 1...</p>
                  </div>
                }
              />
            </Document>
          </div>
        </div>

        <div className="p-2 text-center text-xs font-mono" style={{ backgroundColor: '#EEF1DB', color: '#0F0909' }}>
          Press ESC to return to terminal
        </div>
      </div>

      <div className="absolute bottom-0 w-full text-center text-base py-5 bg-black/50 backdrop-blur-sm" style={{ color: '#FFFFFF' }}>
        © 2025 Chris Xu. All rights reserved.
      </div>
    </main>
  );
}