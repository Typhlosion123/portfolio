"use client";

const FIREBASE_CONFIG = {
apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const COLOR_LOW  = [239, 68,  68]; 
const COLOR_MID  = [250, 204, 21]; 
const COLOR_HIGH = [34,  197, 94]; 
 
const PERSON_A_LABEL = "Alexa";
const PERSON_B_LABEL = "Chris";
 
import { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
 
const firebaseApp = getApps().length === 0
  ? initializeApp(FIREBASE_CONFIG)
  : getApps()[0];
const db = getDatabase(firebaseApp);
 
function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
}
 
function lerpColor(a: any[], b: number[], t: number) {
  return a.map((c, i) => Math.round(c + (b[i] - c) * t));
}
 
function ratingToColor(rating: number) {
  const t = Math.max(0, Math.min(10, rating)) / 10;
  const rgb = t <= 0.5
    ? lerpColor(COLOR_LOW, COLOR_MID, t / 0.5)
    : lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) / 0.5);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
 
function darkenColor(rating: number) {
  const t = Math.max(0, Math.min(10, rating)) / 10;
  const rgb = t <= 0.5
    ? lerpColor(COLOR_LOW, COLOR_MID, t / 0.5)
    : lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) / 0.5);
  return `rgb(${Math.round(rgb[0]*0.4)}, ${Math.round(rgb[1]*0.4)}, ${Math.round(rgb[2]*0.4)})`;
}
 
function saveRating(person: any, rating: unknown) {
  return set(ref(db, `ratings/${todayKey()}/${person}`), rating);
}
 
// ── Draggable gradient slider ─────────────────────────────────
function GradientSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);
 
  const stops = Array.from({ length: 101 }, (_, i) => ratingToColor(i / 10));
  const gradient = `linear-gradient(to right, ${stops.join(", ")})`;
  const pct = (value / 10) * 100;
  const color = ratingToColor(value);
 
  function posToValue(clientX: number) {
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    // Round to nearest 0.1
    return Math.round(clamped * 100) / 10;
  }
 
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    trackRef.current.setPointerCapture(e.pointerId);
    onChange(posToValue(e.clientX));
  }, [onChange]);
 
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    onChange(posToValue(e.clientX));
  }, [onChange]);
 
  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);
 
  return (
    <div style={{ position: "relative", width: "100%", marginTop: 16, paddingBottom: 20 }}>
      {/* Clickable/draggable track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          height: 18,
          borderRadius: 999,
          background: gradient,
          position: "relative",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.25)",
          cursor: "pointer",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* Thumb */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: color,
          border: "3px solid white",
          boxShadow: `0 2px 14px ${color}bb, 0 1px 4px rgba(0,0,0,0.3)`,
          transition: dragging.current ? "none" : "left 0.08s ease",
          cursor: "grab",
          zIndex: 2,
        }} />
      </div>
 
      {/* Tick labels */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 8, color: "#666", fontSize: 11,
        paddingLeft: 2, paddingRight: 2,
      }}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
          <span key={n} style={{ width: 14, textAlign: "center" }}>{n}</span>
        ))}
      </div>
    </div>
  );
}
 
// ── Rating card ───────────────────────────────────────────────
function RatingCard({ person, label, todayRating }: { person: any; label: string; todayRating: number | null }) {
  const [sliderVal, setSliderVal] = useState(todayRating !== null ? todayRating : 5.0);
  const [inputVal, setInputVal]   = useState(todayRating !== null ? String(todayRating) : "5.0");
  const [saved, setSaved]         = useState(todayRating !== null);
  const [flash, setFlash]         = useState(false);
  const [saving, setSaving]       = useState(false);
 
  // Sync when Firebase pushes a remote update
  useEffect(() => {
    if (todayRating !== null) {
      setSliderVal(todayRating);
      setInputVal(String(todayRating));
      setSaved(true);
    }
  }, [todayRating]);
 
  // Keep slider and text input in sync with each other
  function handleSliderChange(val) {
    setSliderVal(val);
    setInputVal(val.toFixed(1));
    setSaved(false);
  }
 
  function handleInputChange(e) {
    const val = e.target.value;
    if (/^(\d{0,2}\.?\d?)$/.test(val) || val === "") {
      setInputVal(val);
      const n = parseFloat(val);
      if (!isNaN(n) && n >= 0 && n <= 10) {
        setSliderVal(Math.round(n * 10) / 10);
      }
      setSaved(false);
    }
  }
 
  const numeric = parseFloat(inputVal);
  const isValid = !isNaN(numeric) && numeric >= 0 && numeric <= 10;
  const displayRating = isValid ? numeric : sliderVal;
  const color = ratingToColor(displayRating);
  const darkColor = darkenColor(displayRating);
 
  async function handleSave() {
    if (!isValid || saving) return;
    const rounded = Math.round(displayRating * 10) / 10;
    setSaving(true);
    try {
      await saveRating(person, rounded);
      setSaved(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <div style={{
      borderRadius: 20,
      padding: "28px 28px 24px",
      background: `linear-gradient(145deg, ${color}22, ${color}08)`,
      border: `1.5px solid ${color}44`,
      transition: "all 0.35s ease",
      boxShadow: flash ? `0 0 0 6px ${color}44` : `0 4px 24px ${color}22`,
    }}>
 
      {/* Person name — bigger */}
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        color: color,
        marginBottom: 4,
        fontFamily: "'DM Serif Display', Georgia, serif",
        letterSpacing: "-0.3px",
      }}>
        {label}
      </div>
 
      {/* Big rating number */}
      <div style={{
        fontSize: 72, fontWeight: 800, lineHeight: 1, color,
        fontFamily: "'DM Serif Display', Georgia, serif",
        textShadow: `0 4px 20px ${color}55`,
        transition: "color 0.15s ease",
        letterSpacing: "-2px",
        marginBottom: 4,
      }}>
        {displayRating.toFixed(1)}
      </div>
 
      {/* Functional slider */}
      <GradientSlider value={sliderVal} onChange={handleSliderChange} />
 
      {/* Text input + save — always visible */}
      <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          inputMode="decimal"
          placeholder="0.0 – 10.0"
          style={{
            width: 90,
            padding: "10px 14px",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "inherit",
            borderRadius: 10,
            border: `1.5px solid ${color}66`,
            background: `${color}11`,
            color: darkColor,
            outline: "none",
            textAlign: "center",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = color}
          onBlur={e => e.target.style.borderColor = `${color}66`}
          onKeyDown={e => e.key === "Enter" && handleSave()}
        />
 
        {!saved ? (
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: color,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: isValid ? "pointer" : "not-allowed",
              opacity: isValid ? 1 : 0.4,
              fontFamily: "inherit",
              letterSpacing: "0.03em",
              boxShadow: `0 2px 12px ${color}55`,
              transition: "all 0.2s",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: darkColor, fontWeight: 600 }}>✓ Logged</span>
            <button
              onClick={() => setSaved(false)}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: `1.5px solid ${color}44`,
                background: "transparent", color: darkColor,
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
 
// ── History heatmap ───────────────────────────────────────────
function HistoryHeatmap({ allRatings }: { allRatings: Record<string, { person_a: number | null; person_b: number | null }> }) {
  // Sort oldest → newest (top to bottom) — no cap
  const dates = Object.keys(allRatings).sort((a, b) => a.localeCompare(b));
  const [tooltip, setTooltip] = useState(null);
  // tooltip: { date, ratingA, ratingB, y }
 
  if (dates.length === 0) return null;
 
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
 
  const earliest = fmtDate(dates[0]);
  const latest   = fmtDate(dates[dates.length - 1]);
 
  const BAR_H = 18; // px per day row
 
  function handleEnter(e, date) {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest(".heatmap-container").getBoundingClientRect();
    setTooltip({
      date,
      ratingA: allRatings[date]?.person_a ?? null,
      ratingB: allRatings[date]?.person_b ?? null,
      y: rect.top - containerRect.top + BAR_H / 2,
    });
  }
 
  return (
    <div style={{ marginTop: 48 }}>
      <h2 style={{
        fontSize: 26, fontWeight: 400, color: "#f0f0f0",
        fontFamily: "'DM Serif Display', Georgia, serif",
        letterSpacing: "-0.3px", margin: "0 0 16px",
      }}>
        History
      </h2>
 
      {/* Earliest date label */}
      <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{earliest}</div>
 
      {/* Heatmap grid */}
      <div
        className="heatmap-container"
        onMouseLeave={() => setTooltip(null)}
        style={{ position: "relative", display: "flex", gap: 4 }}
      >
        {/* Person A column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ccc", marginBottom: 8, textAlign: "center", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.2px" }}>
            {PERSON_A_LABEL}
          </div>
          <div style={{ borderRadius: 6, overflow: "hidden" }}>
            {dates.map((date) => {
              const rating = allRatings[date]?.person_a ?? null;
              const bg = rating !== null ? ratingToColor(rating) : "#1e1e1e";
              return (
                <div
                  key={date}
                  onMouseEnter={(e) => handleEnter(e, date)}
                  style={{
                    height: BAR_H,
                    background: bg,
                    cursor: "default",
                    transition: "filter 0.1s",
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = "brightness(1.25)"}
                  onMouseOut={e => e.currentTarget.style.filter = "brightness(1)"}
                />
              );
            })}
          </div>
        </div>
 
        {/* Person B column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ccc", marginBottom: 8, textAlign: "center", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.2px" }}>
            {PERSON_B_LABEL}
          </div>
          <div style={{ borderRadius: 6, overflow: "hidden" }}>
            {dates.map((date) => {
              const rating = allRatings[date]?.person_b ?? null;
              const bg = rating !== null ? ratingToColor(rating) : "#1e1e1e";
              return (
                <div
                  key={date}
                  onMouseEnter={(e) => handleEnter(e, date)}
                  style={{
                    height: BAR_H,
                    background: bg,
                    cursor: "default",
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = "brightness(1.25)"}
                  onMouseOut={e => e.currentTarget.style.filter = "brightness(1)"}
                />
              );
            })}
          </div>
        </div>
 
        {/* Floating tooltip */}
        {tooltip && (
          <div style={{
            position: "absolute",
            left: "50%",
            top: tooltip.y + 24,
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 12,
            color: "#ddd",
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            lineHeight: 1.7,
          }}>
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{fmtDate(tooltip.date)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                background: tooltip.ratingA !== null ? ratingToColor(tooltip.ratingA) : "#444",
              }} />
              <span style={{ color: "#888" }}>{PERSON_A_LABEL}:</span>
              <span style={{ fontWeight: 700, color: tooltip.ratingA !== null ? ratingToColor(tooltip.ratingA) : "#555" }}>
                {tooltip.ratingA !== null ? tooltip.ratingA.toFixed(1) : "—"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                background: tooltip.ratingB !== null ? ratingToColor(tooltip.ratingB) : "#444",
              }} />
              <span style={{ color: "#888" }}>{PERSON_B_LABEL}:</span>
              <span style={{ fontWeight: 700, color: tooltip.ratingB !== null ? ratingToColor(tooltip.ratingB) : "#555" }}>
                {tooltip.ratingB !== null ? tooltip.ratingB.toFixed(1) : "—"}
              </span>
            </div>
          </div>
        )}
      </div>
 
      {/* Latest date label */}
      <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{latest}</div>
    </div>
  );
}
 
// ── Main App ──────────────────────────────────────────────────
export default function DayRater() {
  const [allRatings, setAllRatings] = useState({});
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const ratingsRef = ref(db, "ratings");
    const unsub = onValue(ratingsRef, (snapshot) => {
      setAllRatings(snapshot.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);
 
  const today = todayKey();
  const todayData = allRatings[today] || {};
  const todayRatingA = todayData.person_a ?? null;
  const todayRatingB = todayData.person_b ?? null;
 
  const displayDate = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long", month: "long", day: "numeric",
  });
 
  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#111",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');`}</style>
      Connecting…
    </div>
  );
 
  return (
    <div style={{
      minHeight: "100vh", background: "#111", color: "#eee",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: "40px 20px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #111; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
 
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
            {displayDate} · Central Time
          </div>
          <h1 style={{
            margin: 0, fontSize: 38, fontWeight: 400, color: "#f0f0f0",
            fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.5px",
          }}>
            How was your day?
          </h1>
        </div>
 
        {/* Gradient legend */}
        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 8, marginBottom: 32 }}>
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} style={{ flex: 1, background: ratingToColor(i / 10) }} />
          ))}
        </div>
 
        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RatingCard person="person_a" label={PERSON_A_LABEL} todayRating={todayRatingA} />
          <RatingCard person="person_b" label={PERSON_B_LABEL} todayRating={todayRatingB} />
        </div>
 
        {/* History heatmap */}
        <HistoryHeatmap allRatings={allRatings} />
      </div>
    </div>
  );
}