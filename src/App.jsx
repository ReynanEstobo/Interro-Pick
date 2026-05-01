import { useState, useRef, useCallback, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import ClassList from "./components/ClassList";
import HistoryPanel from "./components/HistoryPanel";
import Roulette from "./components/Roulette";
import RevealCard from "./components/RevealCard";
import { useAudio } from "./hooks/useAudio";
import { useScriptedMode } from "./hooks/useScriptedMode";
import { FULL_CLASS } from "./data/students";

// ============================================================
// App — Main orchestrator
// Pick sequence:
//   1. chooseName() — selects winner (normal or scripted) BEFORE animation
//   2. Roulette spins (3–4 seconds) — purely cosmetic
//   3. Countdown 3→2→1
//   4. Glitch flash → typing reveal
// The winner is chosen first so scripted mode is undetectable
// ============================================================
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [remaining, setRemaining] = useState([...FULL_CLASS]);
  const [picked, setPicked] = useState([]);
  const [currentName, setCurrentName] = useState(null);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [statusText, setStatusText] = useState("SYSTEM READY — PRESS START TO BEGIN INTERROGATION");
  const [soundOn, setSoundOn] = useState(true);
  const [shaking, setShaking] = useState(false);
  const [flash, setFlash] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(false);

  const rouletteRef = useRef(null);
  const revealRef = useRef(null);
  const audio = useAudio();
  const { isScripted, consumeScripted, reset: resetScripted } = useScriptedMode(remaining);

  // Clock
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Sync sound enabled state
  useEffect(() => {
    audio.setEnabled(soundOn);
  }, [soundOn, audio]);

  // ---- Screen flash ----
  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }, []);

  // ---- Screen shake ----
  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 700);
  }, []);

  // ---- Choose the winning name BEFORE animation starts ----
  // This is the key trick: the winner is already determined,
  // the roulette is purely theatrical.
  const chooseName = useCallback(() => {
    if (isScripted) {
      const scripted = consumeScripted(remaining);
      if (scripted) return scripted;
    }
    // True random from remaining pool
    return remaining[Math.floor(Math.random() * remaining.length)];
  }, [isScripted, consumeScripted, remaining]);

  // ---- Countdown 3 → 2 → 1 ----
  const runCountdown = useCallback(
    (n, onDone) => {
      if (n === 0) { onDone(); return; }
      revealRef.current?.showCountdown(n, () => {
        triggerFlash();
        audio.sfxCountdown(n);
        runCountdown(n - 1, onDone);
      });
    },
    [triggerFlash, audio]
  );

  // ---- Main pick sequence ----
  const startPick = useCallback(() => {
    if (running || remaining.length === 0) return;
    setRunning(true);
    setSpotlightOn(true);
    revealRef.current?.reset();
    setStatusText("SCANNING SUSPECT DATABASE...");

    // Pre-select winner — invisible to audience
    const winner = chooseName();

    // Phase 1: Roulette spin (3–4s, cosmetic only)
    const spinDuration = 3000 + Math.random() * 1000;
    rouletteRef.current?.start(spinDuration, () => {
      // Phase 2: Countdown
      setStatusText("SUBJECT IDENTIFIED — REVEALING IN...");
      runCountdown(3, () => {
        // Phase 3: Glitch flash
        revealRef.current?.showGlitch();
        triggerFlash();
        triggerShake();
        audio.sfxReveal();

        // Phase 4: Type out the name
        setTimeout(() => {
          // Commit pick to state
          setRemaining((r) => r.filter((n) => n !== winner));
          setPicked((p) => [...p, winner]);
          setCurrentName(winner);
          setHistory((h) => [winner, ...h]);

          revealRef.current?.typeName(winner, audio.sfxKey, () => {
            setStatusText(`CONFIRMED: ${winner.split(",")[0]} — INTERROGATION INITIATED`);

            // Re-enable after a pause
            setTimeout(() => {
              setRunning(false);
              setSpotlightOn(false);
              setCurrentName(null);
            }, 2200);
          });
        }, 350);
      });
    });
  }, [running, remaining, chooseName, runCountdown, triggerFlash, triggerShake, audio]);

  // ---- Reset ----
  const handleReset = useCallback(() => {
    if (running) return;
    setRemaining([...FULL_CLASS]);
    setPicked([]);
    setCurrentName(null);
    setHistory([]);
    revealRef.current?.reset();
    setStatusText("SYSTEM READY — PRESS START TO BEGIN INTERROGATION");
    resetScripted();
    audio.sfxBeep();
  }, [running, resetScripted, audio]);

  // ---- Fullscreen ----
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const allDone = remaining.length === 0;

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {/* Red flash overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(255,0,0,0.14)",
          opacity: flash ? 1 : 0,
          pointerEvents: "none",
          zIndex: 998,
          transition: "opacity 0.08s",
        }}
      />

      {/* CRT scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,26,26,0.025) 2px,rgba(255,26,26,0.025) 4px)",
          pointerEvents: "none",
          zIndex: 997,
        }}
      />

      {/* Main app */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          background: "#050505",
          fontFamily: "'Share Tech Mono', monospace",
          color: "#f0f0f0",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s",
          overflow: "hidden",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 16px",
            borderBottom: "1px solid #1a1a1a",
            background: "#0d0d0d",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 22,
                color: "#ff1a1a",
                letterSpacing: 4,
                textShadow: "0 0 10px rgba(255,26,26,0.4)",
              }}
            >
              INTERROGPICK
            </div>
            {/* Scripted mode badge — only visible to operator */}
            <div
              style={{
                fontSize: 9,
                padding: "3px 8px",
                border: isScripted ? "1px solid #ff6600" : "1px solid #1a1a1a",
                color: isScripted ? "#ff6600" : "#222",
                letterSpacing: 2,
                background: isScripted ? "rgba(255,102,0,0.08)" : "transparent",
                animation: isScripted ? "ip-blink 1.5s infinite" : "none",
                transition: "all 0.3s",
              }}
            >
              {isScripted ? "SCRIPTED MODE" : "NORMAL MODE"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => { setSoundOn((s) => !s); audio.sfxBeep(); }}
              style={topBtnStyle(soundOn)}
            >
              ♪ SFX {soundOn ? "ON" : "OFF"}
            </button>
            <button onClick={toggleFullscreen} style={topBtnStyle(false)}>
              ⊞ FULLSCREEN
            </button>
            <span style={{ fontSize: 10, color: "#333", letterSpacing: 1 }}>{clock}</span>
          </div>
        </div>

        {/* MAIN ROW */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* LEFT — Class list (hidden on small screens via CSS) */}
          <div className="ip-left-panel">
            <ClassList picked={picked} current={currentName} onReset={handleReset} />
          </div>

          {/* CENTER STAGE */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              background: "radial-gradient(ellipse at 50% 0%, #150000 0%, #050505 65%)",
              animation: shaking ? "ip-shake 0.65s ease-out" : "none",
            }}
          >
            {/* Spotlight cone */}
            <div
              style={{
                position: "absolute",
                top: -80,
                left: "50%",
                transform: "translateX(-50%)",
                width: 440,
                height: 580,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(255,26,26,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
                opacity: spotlightOn ? 1 : 0,
                transition: "opacity 1.2s",
              }}
            />

            {/* Status line */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 10,
                color: "#333",
                letterSpacing: 3,
                whiteSpace: "nowrap",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {statusText}
            </div>

            {/* Roulette */}
            <Roulette ref={rouletteRef} onTick={audio.sfxSpin} />

            {/* Reveal card */}
            <RevealCard ref={revealRef} />

            {/* START button */}
            <button
              onClick={startPick}
              disabled={running || allDone}
              style={{
                marginTop: 22,
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "clamp(15px,2.2vw,20px)",
                letterSpacing: 6,
                padding: "15px 50px",
                background:
                  running || allDone ? "#1a0000" : "#ff1a1a",
                color: running || allDone ? "#3a0000" : "#fff",
                border: "none",
                cursor: running || allDone ? "not-allowed" : "pointer",
                clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
                boxShadow:
                  running || allDone
                    ? "none"
                    : "0 0 20px rgba(255,26,26,0.3)",
                transition: "all 0.2s",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!running && !allDone) e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {allDone ? "⚠ ALL PICKED" : running ? "■ PROCESSING..." : "▶ START INTERROGATION"}
            </button>
          </div>

          {/* RIGHT — History (hidden on small screens) */}
          <div className="ip-right-panel">
            <HistoryPanel history={history} />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 16px",
            borderTop: "1px solid #1a1a1a",
            background: "#0d0d0d",
            flexShrink: 0,
            fontSize: 9,
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["PICKED", picked.length],
              ["REMAINING", remaining.length],
              ["TOTAL", FULL_CLASS.length],
            ].map(([label, val]) => (
              <span key={label} style={{ color: "#333", letterSpacing: 1 }}>
                {label}:{" "}
                <span style={{ color: "#ff1a1a", fontSize: 11 }}>{val}</span>
              </span>
            ))}
          </div>
          <span style={{ color: "#1a1a1a", letterSpacing: 2 }}>SYSTEM OPERATIONAL</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Oswald:wght@300;400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{overflow:hidden;user-select:none;background:#050505}
        @keyframes ip-shake{
          0%,100%{transform:translateX(0)}
          10%{transform:translateX(-7px) rotate(-0.4deg)}
          20%{transform:translateX(7px) rotate(0.4deg)}
          30%{transform:translateX(-5px)}
          40%{transform:translateX(5px)}
          55%{transform:translateX(-2px)}
          70%{transform:translateX(2px)}
          85%{transform:translateX(-1px)}
        }
        @keyframes ip-blink{0%,100%{opacity:1}50%{opacity:0.25}}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1a1a1a}
        .ip-left-panel,.ip-right-panel{display:flex}
        @media(max-width:700px){
          .ip-left-panel,.ip-right-panel{display:none}
        }
      `}</style>
    </>
  );
}

function topBtnStyle(active) {
  return {
    background: "transparent",
    border: `1px solid ${active ? "#ff1a1a" : "#222"}`,
    color: active ? "#ff1a1a" : "#444",
    padding: "5px 10px",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10,
    cursor: "pointer",
    letterSpacing: 1,
    background: active ? "rgba(255,26,26,0.08)" : "transparent",
  };
}
