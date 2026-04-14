"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, Database } from "firebase/database";

// --- Types ---
type PersonKey = 'person_a' | 'person_b';
interface DayRating {
  person_a: number | null;
  person_b: number | null;
}
type AllRatings = Record<string, DayRating>;

interface FavorEntry {
  delta: number;
  reason: string;
  timestamp: number;
}
type FavorEntries = Record<string, FavorEntry>;
type AllFavors = Record<PersonKey, FavorEntries>;

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

const COLOR_LOW = [3, 66, 20];
const COLOR_MID = [21, 67, 161];
const COLOR_HIGH = [118, 6, 156];

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

function addFavorEntry(person: PersonKey, delta: number, reason: string) {
  return push(ref(db, `favors/${person}`), {
    delta,
    reason,
    timestamp: Date.now(),
  });
}

function GradientSlider({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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

function FavorControl({ person, total, color, darkColor, logOpen, setLogOpen }: {
  person: PersonKey;
  total: number;
  color: string;
  darkColor: string;
  logOpen: boolean;
  setLogOpen: (v: boolean) => void;
}) {
  const [modalDelta, setModalDelta] = useState<null | 1 | -1>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim() || modalDelta === null || submitting) return;
    setSubmitting(true);
    try {
      await addFavorEntry(person, modalDelta, reason.trim());
      setReason("");
      setModalDelta(null);
    } catch (err) {
      console.error("Failed to save favor:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const btnStyle: React.CSSProperties = {
    width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${color}66`,
    background: `${color}11`, color: darkColor, fontSize: 16, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    padding: 0, lineHeight: 1,
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => setModalDelta(-1)} style={btnStyle} aria-label="Remove favor">−</button>
        <div style={{
          minWidth: 30, textAlign: "center", fontSize: 20, fontWeight: 700,
          color: darkColor, fontFamily: "'DM Serif Display', serif",
        }}>
          {total}
        </div>
        <button onClick={() => setModalDelta(1)} style={btnStyle} aria-label="Add favor">+</button>
        <button
          onClick={() => setLogOpen(!logOpen)}
          style={{
            ...btnStyle, fontSize: 11,
            transform: logOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
          aria-label="Toggle favor log"
        >▼</button>
      </div>

      {modalDelta !== null && (
        <div
          onClick={() => !submitting && setModalDelta(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1a1a1a", borderRadius: 18, padding: 24,
              maxWidth: 420, width: "100%",
              border: `1.5px solid ${color}66`,
              boxShadow: `0 10px 60px ${color}33`,
            }}
          >
            <div style={{
              fontSize: 22, fontWeight: 700, color,
              marginBottom: 4, fontFamily: "'DM Serif Display', serif",
            }}>
              {modalDelta > 0 ? "Add a favor" : "Remove a favor"}
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              Why should {modalDelta > 0 ? "+1" : "−1"} be logged?
            </div>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              autoFocus
              placeholder="Enter a reason…"
              rows={3}
              style={{
                width: "100%", padding: 12, borderRadius: 10,
                border: `1.5px solid ${color}44`, background: "#111", color: "#eee",
                fontSize: 14, resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setModalDelta(null)}
                disabled={submitting}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10,
                  border: "1.5px solid #444", background: "transparent",
                  color: "#aaa", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason.trim() || submitting}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
                  background: color, color: "white", fontSize: 14, fontWeight: 700,
                  cursor: reason.trim() && !submitting ? "pointer" : "not-allowed",
                  opacity: reason.trim() && !submitting ? 1 : 0.4,
                }}
              >
                {submitting ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FavorLogTable({ entries, color }: { entries: FavorEntries; color: string }) {
  const sorted = useMemo(() => {
    return Object.entries(entries || {})
      .map(([id, e]) => ({ id, ...e }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [entries]);

  const fmtDay = (ts: number) => new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={{
      marginTop: 16, borderRadius: 12,
      background: `${color}08`, border: `1px solid ${color}33`,
      overflow: "hidden",
    }}>
      {sorted.length === 0 ? (
        <div style={{ fontSize: 12, color: "#777", textAlign: "center", padding: "14px 0" }}>
          No favor history yet.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: `${color}15` }}>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Day</th>
              <th style={{ textAlign: "center", padding: "8px 8px", color: "#aaa", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, width: 50 }}>±</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, idx) => (
              <tr key={e.id} style={{ borderTop: idx === 0 ? "none" : `1px solid ${color}22` }}>
                <td style={{ padding: "10px 12px", color: "#ccc", whiteSpace: "nowrap" }}>
                  {fmtDay(e.timestamp)}
                </td>
                <td style={{
                  padding: "10px 8px", textAlign: "center", fontWeight: 800,
                  color: e.delta > 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                }}>
                  {e.delta > 0 ? `+${e.delta}` : e.delta}
                </td>
                <td style={{ padding: "10px 12px", color: "#ddd", wordBreak: "break-word" }}>
                  {e.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RatingCard({ person, label, todayRating, favorEntries }: {
  person: PersonKey;
  label: string;
  todayRating: number | null;
  favorEntries: FavorEntries;
}) {
  const [sliderVal, setSliderVal] = useState(todayRating ?? 5.0);
  const [inputVal, setInputVal] = useState(String(todayRating ?? 5.0));
  const [saved, setSaved] = useState(todayRating !== null);
  const [flash, setFlash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const favorTotal = useMemo(
    () => Object.values(favorEntries || {}).reduce((sum, e) => sum + (e?.delta || 0), 0),
    [favorEntries]
  );

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
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 4, gap: 12, flexWrap: "wrap",
      }}>
        <div style={{
          fontSize: 22, fontWeight: 700, color,
          fontFamily: "'DM Serif Display', serif",
        }}>
          {label}
        </div>
        <FavorControl
          person={person}
          total={favorTotal}
          color={color}
          darkColor={darkColor}
          logOpen={logOpen}
          setLogOpen={setLogOpen}
        />
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

      {logOpen && <FavorLogTable entries={favorEntries} color={color} />}
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
  const [allFavors, setAllFavors] = useState<AllFavors>({ person_a: {}, person_b: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ratingsRef = ref(db, "ratings");
    const unsub = onValue(ratingsRef, (snapshot) => {
      setAllRatings(snapshot.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const favorsRef = ref(db, "favors");
    const unsub = onValue(favorsRef, (snapshot) => {
      const val = snapshot.val() || {};
      setAllFavors({
        person_a: val.person_a || {},
        person_b: val.person_b || {},
      });
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
          <RatingCard
            person="person_a"
            label={PERSON_A_LABEL}
            todayRating={todayData.person_a ?? null}
            favorEntries={allFavors.person_a}
          />
          <RatingCard
            person="person_b"
            label={PERSON_B_LABEL}
            todayRating={todayData.person_b ?? null}
            favorEntries={allFavors.person_b}
          />
        </div>

        <HistoryHeatmap allRatings={allRatings} />
      </div>
    </div>
  );
}