import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { FULL_CLASS } from "../data/students";

// ============================================================
// Roulette — Animated scrolling name strip
// Exposes start(duration, onDone) via ref
// ============================================================
const Roulette = forwardRef(function Roulette({ onTick }, ref) {
  const trackRef = useRef(null);
  const rafRef = useRef(null);

  // Build the track with many copies so it loops seamlessly
  const items = [];
  for (let i = 0; i < 8; i++) {
    FULL_CLASS.forEach((name) => items.push(name.split(",")[0]));
  }

  useImperativeHandle(ref, () => ({
    start(duration, onDone) {
      const track = trackRef.current;
      if (!track) return;

      let pos = 0;
      let speed = 28;
      let elapsed = 0;
      let lastT = performance.now();
      const itemW = 180; // approx px per item
      const maxScroll = items.length * itemW;

      cancelAnimationFrame(rafRef.current);

      function frame(t) {
        const dt = Math.min(t - lastT, 50);
        lastT = t;
        elapsed += dt;

        // Ease out in the final 40% of duration
        const progress = elapsed / duration;
        if (progress > 0.6) {
          speed = Math.max(0.8, speed * 0.975);
        }

        pos = (pos + speed) % maxScroll;
        track.style.transform = `translateX(${-pos}px)`;

        // Trigger tick sound every ~itemW pixels
        if (Math.floor(pos / itemW) !== Math.floor((pos - speed) / itemW)) {
          onTick?.();
        }

        if (elapsed < duration) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onDone?.();
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(rafRef.current);
    },
  }));

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      style={{
        position: "relative",
        width: "clamp(260px,52vw,500px)",
        height: 56,
        overflow: "hidden",
        border: "1px solid #1a1a1a",
        background: "#050505",
        marginBottom: 20,
        flexShrink: 0,
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(to right,#050505,transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Center marker */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "#ff1a1a",
          zIndex: 3,
          boxShadow: "0 0 8px #ff1a1a",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(to left,#050505,transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {items.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              padding: "0 26px",
              color: "#2a2a2a",
              letterSpacing: 1,
              flexShrink: 0,
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
});

export default Roulette;
