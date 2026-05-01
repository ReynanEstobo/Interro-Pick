import { useEffect, useState } from "react";

// ============================================================
// LoadingScreen — Cinematic boot sequence
// ============================================================
const MESSAGES = [
  "LOADING SUSPECT DATABASE...",
  "CALIBRATING INTERROGATION ARRAY...",
  "INITIALIZING SELECTION ENGINE...",
  "ARMING SPOTLIGHT SYSTEM...",
  "ENCRYPTING SCRIPTED PROTOCOLS...",
  "SYSTEM OPERATIONAL",
];

export default function LoadingScreen({ onDone }) {
  const [pct, setPct] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + Math.random() * 8 + 3);
        const mIdx = Math.min(MESSAGES.length - 1, Math.floor((next / 100) * MESSAGES.length));
        setMsgIdx(mIdx);
        if (next >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            setFading(true);
            setTimeout(onDone, 700);
          }, 400);
        }
        return next;
      });
    }, 80);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Share Tech Mono', monospace",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "clamp(40px,9vw,90px)",
          color: "#ff1a1a",
          letterSpacing: 8,
          textShadow: "0 0 30px rgba(255,26,26,0.6), 0 0 60px rgba(255,26,26,0.3)",
          animation: "ip-pulse 1.5s infinite",
        }}
      >
        INTERROGPICK
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#444",
          letterSpacing: 4,
          marginTop: 8,
          animation: "ip-blink 1s infinite",
        }}
      >
        INTERROGATION SELECTION SYSTEM v2.4
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 48,
          width: "clamp(200px,50vw,420px)",
          height: 2,
          background: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "#ff1a1a",
            boxShadow: "0 0 10px #ff1a1a",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <div style={{ marginTop: 14, fontSize: 10, color: "#333", letterSpacing: 2, minHeight: 14 }}>
        {MESSAGES[msgIdx]}
      </div>

      <style>{`
        @keyframes ip-pulse {
          0%,100%{text-shadow:0 0 20px rgba(255,26,26,0.6),0 0 40px rgba(255,26,26,0.3)}
          50%{text-shadow:0 0 40px rgba(255,26,26,0.9),0 0 80px rgba(255,26,26,0.5)}
        }
        @keyframes ip-blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  );
}
