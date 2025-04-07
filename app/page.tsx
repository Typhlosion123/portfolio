export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Spline 3D Model</h1>
      <div className="w-full h-[600px]">
        <iframe
          src="https://my.spline.design/thepc-de0c3202fab3683d455ead2170633d43/"
          frameBorder="0"
          width="100%"
          height="100%"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>
    </main>
  );
}