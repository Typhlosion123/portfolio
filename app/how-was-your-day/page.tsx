"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, onValue, Database } from "firebase/database";

// --- Types ---
type PersonKey = 'person_a' | 'person_b';
interface DayRating {
  person_a: number | null;
  person_b: number | null;
}
type AllRatings = Record<string, DayRating>;

// --- Constants ---
const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const COLOR_LOW = [239, 68, 68];
const COLOR_MID = [250, 204, 21];
const COLOR_HIGH = [34, 197, 94];

const PERSON_A_LABEL = "Alexa";
const PERSON_B_LABEL = "Chris";

// --- Firebase Init ---
const firebaseApp: FirebaseApp = getApps().length === 0
  ? initializeApp(FIREBASE_CONFIG)
  : getApps()[0];
const db: Database = getDatabase(firebaseApp);

// --- Helpers ---
function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
}

function lerpColor(a: number[], b: number[], t: number): number[] {
  return a.map((c, i) => Math.round(c + (b[i] - c) * t));
}

function ratingToColor(rating: number): string {
  const t = Math.max(0, Math.min(10, rating)) / 10;
  const rgb = t <= 0.5
    ? lerpColor(COLOR_LOW, COLOR_MID, t / 0.5)
    : lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) / 0.5);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function darkenColor(rating: number): string {
  const t = Math.max(0, Math.min(10, rating)) / 10;
  const rgb = t <= 0.5
    ? lerpColor(COLOR_LOW, COLOR_MID, t / 0.5)
    : lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) / 0.5);
  return `rgb(${Math.round(rgb[0] * 0.4)}, ${Math.round(rgb[1] * 0.4)}, ${Math.round(rgb[2] * 0.4)})`;
}

function saveRating(person: PersonKey, rating: number) {
  return set(ref(db, `ratings/${todayKey()}/${person}`), rating);
}

function GradientSlider({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Optimization: Only generate the gradient string once
  const gradient = useMemo(() => {
    const stops = Array.from({ length: 11 }, (_, i) => ratingToColor(i));
    return `linear-gradient(to right, ${stops.join(", ")})`;
  }, []);

  const pct = (value / 10) * 100;
  const color = ratingToColor(value);

  const posToValue = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    return Math.round(clamped * 100) / 10;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    e.preventDefault();
    isDragging.current = true;
    trackRef.current.setPointerCapture(e.pointerId);
    onChange(posToValue(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onChange(posToValue(e.clientX));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div style={{ position: "relative", width: "100%", marginTop: 16, paddingBottom: 20 }}>
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
        }}
      >
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
          transition: isDragging.current ? "none" : "left 0.15s cubic-bezier(0.2, 0, 0, 1)",
          zIndex: 2,
        }} />
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 8, color: "#666", fontSize: 11,
        paddingLeft: 2, paddingRight: 2, pointerEvents: "none"
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <span key={n} style={{ width: 14, textAlign: "center" }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function RatingCard({ person, label, todayRating }: { person: PersonKey; label: string; todayRating: number | null }) {
  const [sliderVal, setSliderVal] = useState(todayRating ?? 5.0);
  const [inputVal, setInputVal] = useState(String(todayRating ?? 5.0));
  const [saved, setSaved] = useState(todayRating !== null);
  const [flash, setFlash] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (todayRating !== null) {
      setSliderVal(todayRating);
      setInputVal(String(todayRating));
      setSaved(true);
    }
  }, [todayRating]);

  function handleSliderChange(val: number) {
    setSliderVal(val);
    setInputVal(val.toFixed(1));
    setSaved(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    } catch (err) {
        console.error("Failed to save:", err);
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
      <div style={{ fontSize: 22, fontWeight: 700, color: color, marginBottom: 4, fontFamily: "'DM Serif Display', serif" }}>
        {label}
      </div>

      <div style={{
        fontSize: 72, fontWeight: 800, lineHeight: 1, color,
        fontFamily: "'DM Serif Display', serif",
        textShadow: `0 4px 20px ${color}55`,
        letterSpacing: "-2px",
        marginBottom: 4,
      }}>
        {displayRating.toFixed(1)}
      </div>

      <GradientSlider value={sliderVal} onChange={handleSliderChange} />

      <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          inputMode="decimal"
          style={{
            width: 90, padding: "10px 14px", fontSize: 18, fontWeight: 700,
            borderRadius: 10, border: `1.5px solid ${color}66`,
            background: `${color}11`, color: darkColor, textAlign: "center", outline: "none",
          }}
          onKeyDown={e => e.key === "Enter" && handleSave()}
        />

        {!saved ? (
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
              background: color, color: "white", fontSize: 14, fontWeight: 700,
              cursor: isValid ? "pointer" : "not-allowed", opacity: isValid ? 1 : 0.4,
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
                padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${color}44`,
                background: "transparent", color: darkColor, fontSize: 12, fontWeight: 600, cursor: "pointer",
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

function HistoryHeatmap({ allRatings }: { allRatings: AllRatings }) {
  const dates = useMemo(() => Object.keys(allRatings).sort((a, b) => a.localeCompare(b)), [allRatings]);
  const [tooltip, setTooltip] = useState<{ date: string; y: number } | null>(null);

  if (dates.length === 0) return null;

  const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  const BAR_H = 18;

  return (
    <div style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 26, color: "#f0f0f0", fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>History</h2>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{fmtDate(dates[0])}</div>

      <div className="heatmap-container" onMouseLeave={() => setTooltip(null)} style={{ position: "relative", display: "flex", gap: 4 }}>
        {(['person_a', 'person_b'] as const).map((pk) => (
          <div key={pk} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 15, color: "#ccc", marginBottom: 8, textAlign: "center", fontFamily: "'DM Serif Display', serif" }}>
              {pk === 'person_a' ? PERSON_A_LABEL : PERSON_B_LABEL}
            </div>
            <div style={{ borderRadius: 6, overflow: "hidden" }}>
              {dates.map((date) => {
                const rating = allRatings[date]?.[pk] ?? null;
                return (
                  <div
                    key={date}
                    onMouseEnter={(e) => setTooltip({ date, y: e.currentTarget.offsetTop })}
                    style={{
                      height: BAR_H,
                      background: rating !== null ? ratingToColor(rating) : "#1e1e1e",
                      transition: "filter 0.1s",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {tooltip && (
          <div style={{
            position: "absolute", left: "50%", top: tooltip.y + 24, transform: "translateX(-50%)",
            background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, padding: "8px 14px",
            fontSize: 12, color: "#ddd", pointerEvents: "none", zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontWeight: 700, color: "#fff" }}>{fmtDate(tooltip.date)}</div>
            {['person_a', 'person_b'].map(k => {
                const r = allRatings[tooltip.date]?.[k as keyof DayRating];
                const c = r !== null ? ratingToColor(r as number) : "#555";
                return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                        <span style={{ color: "#888" }}>{k === 'person_a' ? PERSON_A_LABEL : PERSON_B_LABEL}:</span>
                        <span style={{ fontWeight: 700, color: c }}>{r !== null ? (r as number).toFixed(1) : "—"}</span>
                    </div>
                )
            })}
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{fmtDate(dates[dates.length - 1])}</div>
    </div>
  );
}
export default function DayRater() {
  const [allRatings, setAllRatings] = useState<AllRatings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ratingsRef = ref(db, "ratings");
    const unsub = onValue(ratingsRef, (snapshot) => {
      setAllRatings(snapshot.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>Connecting…</div>;

  const todayData = allRatings[todayKey()] || {};

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#eee", padding: "40px 20px 80px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase" }}>{todayKey()} · Central Time</div>
          <h1 style={{ fontSize: 38, fontFamily: "'DM Serif Display', serif", margin: 0 }}>How was your day?</h1>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RatingCard person="person_a" label={PERSON_A_LABEL} todayRating={todayData.person_a ?? null} />
          <RatingCard person="person_b" label={PERSON_B_LABEL} todayRating={todayData.person_b ?? null} />
        </div>

        <HistoryHeatmap allRatings={allRatings} />
      </div>
    </div>
  );
}