export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-black">
      <h1 className="text-3xl font-bold mb-4 text-white">Spline 3D Model</h1>
      <div className="w-[2500] h-[1100]">
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