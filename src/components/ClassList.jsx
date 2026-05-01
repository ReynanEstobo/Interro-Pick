import { FULL_CLASS } from "../data/students";

// ============================================================
// ClassList — Left panel showing all students
// Picked = red, Current = white flash, Remaining = dim
// ============================================================
export default function ClassList({ picked, current, onReset }) {
  return (
    <div
      style={{
        width: 224,
        borderRight: "1px solid #1a1a1a",
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #1a1a1a",
          fontSize: 10,
          color: "#444",
          letterSpacing: 3,
          fontFamily: "'Share Tech Mono', monospace",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>SUSPECTS</span>
        <span style={{ color: "#ff1a1a" }}>{FULL_CLASS.length}</span>
      </div>

      {/* List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 0",
          scrollbarWidth: "thin",
          scrollbarColor: "#8b0000 transparent",
        }}
      >
        {FULL_CLASS.map((name) => {
          const isPicked = picked.includes(name);
          const isCurrent = name === current;
          return (
            <div
              key={name}
              title={name}
              style={{
                padding: "5px 14px",
                fontSize: 10,
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 0.5,
                lineHeight: 1.5,
                borderLeft: isCurrent
                  ? "2px solid #f0f0f0"
                  : isPicked
                  ? "2px solid #ff1a1a"
                  : "2px solid transparent",
                color: isCurrent ? "#f0f0f0" : isPicked ? "#ff1a1a" : "#333",
                background: isCurrent
                  ? "rgba(255,255,255,0.06)"
                  : isPicked
                  ? "rgba(255,26,26,0.04)"
                  : "transparent",
                transition: "all 0.3s",
                animation: isCurrent ? "ip-flashitem 0.3s" : "none",
              }}
            >
              {name}
            </div>
          );
        })}
        <style>{`@keyframes ip-flashitem{0%{background:rgba(255,255,255,0.2)}100%{background:rgba(255,255,255,0.06)}}`}</style>
      </div>

      {/* Reset button */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid #1a1a1a" }}>
        <button
          onClick={onReset}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid #222",
            color: "#333",
            padding: "8px",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10,
            cursor: "pointer",
            letterSpacing: 2,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#8b0000";
            e.currentTarget.style.color = "#8b0000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#222";
            e.currentTarget.style.color = "#333";
          }}
        >
          ↺ RESET ALL
        </button>
      </div>
    </div>
  );
}
