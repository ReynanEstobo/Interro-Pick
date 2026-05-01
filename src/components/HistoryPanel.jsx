// ============================================================
// HistoryPanel — Right panel showing pick history
// ============================================================
export default function HistoryPanel({ history }) {
  return (
    <div
      style={{
        width: 206,
        borderLeft: "1px solid #1a1a1a",
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
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
        <span>HISTORY</span>
        <span style={{ color: "#8b0000" }}>{history.length}</span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 0",
          scrollbarWidth: "thin",
          scrollbarColor: "#8b0000 transparent",
        }}
      >
        {history.length === 0 ? (
          <div
            style={{
              padding: "20px 14px",
              fontSize: 9,
              color: "#1e1e1e",
              letterSpacing: 1,
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            NO PICKS YET
          </div>
        ) : (
          history.map((name, i) => (
            <div
              key={i}
              style={{
                padding: "5px 14px",
                fontSize: 9,
                fontFamily: "'Share Tech Mono', monospace",
                color: i === 0 ? "#666" : "#333",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                lineHeight: 1.5,
                background: i === 0 ? "rgba(255,26,26,0.03)" : "transparent",
                borderLeft: i === 0 ? "2px solid #8b0000" : "2px solid transparent",
                transition: "all 0.3s",
              }}
            >
              <span style={{ color: "#8b0000", flexShrink: 0 }}>
                {String(history.length - i).padStart(2, "0")}
              </span>
              <span>{name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
