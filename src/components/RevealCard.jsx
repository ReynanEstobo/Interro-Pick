import { forwardRef, useImperativeHandle, useRef, useState } from "react";

// ============================================================
// RevealCard — Displays the selected name with dramatic effects
// Exposes: showCountdown(n), showGlitch(), typeName(text, onDone)
// ============================================================
const RevealCard = forwardRef(function RevealCard(_, ref) {
  const [content, setContent] = useState({ type: "idle", text: "—" });
  const [active, setActive] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      clearTimeout(typingTimer.current);
      setContent({ type: "idle", text: "—" });
      setActive(false);
      setTyping(false);
    },

    showCountdown(n, onDone) {
      setContent({ type: "countdown", text: String(n) });
      setTimeout(onDone, 900);
    },

    showGlitch() {
      setContent({ type: "glitch", text: "▓▓▓▓▓▓▓▓▓▓" });
      setActive(true);
    },

    typeName(name, sfxKey, onDone) {
      setActive(true);
      setTyping(true);
      let i = 0;
      const speed = Math.max(35, Math.min(110, Math.floor(2800 / name.length)));

      function tick() {
        i++;
        setContent({ type: "name", text: name.slice(0, i) });
        sfxKey?.();
        if (i < name.length) {
          typingTimer.current = setTimeout(tick, speed);
        } else {
          setTyping(false);
          onDone?.();
        }
      }
      tick();
    },
  }));

  const isCountdown = content.type === "countdown";
  const isGlitch = content.type === "glitch";

  return (
    <div
      style={{
        position: "relative",
        width: "clamp(260px,56vw,540px)",
        minHeight: 140,
        border: active ? "1px solid rgba(255,26,26,0.6)" : "1px solid #1a1a1a",
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 28px",
        textAlign: "center",
        overflow: "hidden",
        boxShadow: active
          ? "inset 0 0 40px rgba(255,26,26,0.08), 0 0 30px rgba(255,26,26,0.15)"
          : "none",
        transition: "border 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Corner decorations */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <CornerDeco key={pos} pos={pos} active={active} />
      ))}

      {/* Glitch scan lines (decorative) */}
      {active && (
        <>
          <div style={glitchLineStyle("30%")} />
          <div style={{ ...glitchLineStyle("62%"), animationDelay: "1.1s" }} />
        </>
      )}

      {/* Label */}
      {!isCountdown && (
        <div
          style={{
            fontSize: 9,
            color: "#444",
            letterSpacing: 4,
            marginBottom: 12,
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          SELECTED SUBJECT
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          fontFamily: isCountdown ? "'Bebas Neue', cursive" : "'Bebas Neue', cursive",
          fontSize: isCountdown
            ? "clamp(52px,10vw,88px)"
            : "clamp(22px,4.5vw,50px)",
          color: isCountdown ? "#ff1a1a" : "#f0f0f0",
          letterSpacing: isCountdown ? 2 : 3,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          textShadow: isCountdown
            ? "0 0 20px rgba(255,26,26,0.8), 0 0 40px rgba(255,26,26,0.4)"
            : active
            ? "0 0 10px rgba(255,255,255,0.1)"
            : "none",
          animation: isCountdown
            ? "ip-cdpop 0.4s ease-out"
            : isGlitch
            ? "ip-glitch 0.25s infinite"
            : "none",
          borderRight: typing ? "2px solid #ff1a1a" : "2px solid transparent",
          transition: "border-color 0.1s",
        }}
      >
        {content.text}
      </div>

      <style>{`
        @keyframes ip-cdpop{0%{transform:scale(1.6);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes ip-glitch{
          0%,100%{transform:translate(0);filter:none}
          20%{transform:translate(-3px,1px);filter:hue-rotate(90deg)}
          40%{transform:translate(3px,-1px)}
          60%{transform:translate(-2px,2px)}
          80%{transform:translate(2px,-2px)}
        }
        @keyframes ip-glitchline{
          0%,80%,100%{opacity:0;transform:translateX(0)}
          83%{opacity:1;transform:translateX(-12px)}
          87%{opacity:0.4;transform:translateX(8px)}
          93%{opacity:0.8;transform:translateX(0)}
        }
      `}</style>
    </div>
  );
});

function glitchLineStyle(top) {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    top,
    height: 1,
    background: "rgba(255,26,26,0.3)",
    animation: "ip-glitchline 2.5s infinite",
    pointerEvents: "none",
  };
}

function CornerDeco({ pos, active }) {
  const isRight = pos.includes("r");
  const isBottom = pos.includes("b");
  const color = active ? "rgba(255,26,26,0.5)" : "rgba(255,26,26,0.15)";

  return (
    <div
      style={{
        position: "absolute",
        width: 18,
        height: 18,
        [isBottom ? "bottom" : "top"]: 8,
        [isRight ? "right" : "left"]: 8,
        borderTop: !isBottom ? `1px solid ${color}` : "none",
        borderBottom: isBottom ? `1px solid ${color}` : "none",
        borderLeft: !isRight ? `1px solid ${color}` : "none",
        borderRight: isRight ? `1px solid ${color}` : "none",
        transition: "border-color 0.4s",
      }}
    />
  );
}

export default RevealCard;
