export default function Home() {
  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <iframe
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
        <spline-viewer url="https://prod.spline.design/6UTcgkxAaa7nu36T/scene.splinecode"></spline-viewer>
        frameBorder="0"
        width="100%"
        height="100%"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
