export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black">
      <h1 className="text-3xl font-bold mb-4 text-white">Spline 3D Model</h1>
      <div className="w-full h-full">
        <iframe
          src="https://prod.spline.design/6UTcgkxAaa7nu36T/scene.splinecode"
          frameBorder="0"
          width="100%"
          height="100%"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>
    </main>
  );
}