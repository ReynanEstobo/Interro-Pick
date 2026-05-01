import { useState, useEffect, useCallback } from "react";
import { SCRIPTED_QUEUE } from "../data/students";

// ============================================================
// useScriptedMode — Hidden mode manager
// Activated/deactivated by: Ctrl + Shift + S
// Invisible to the audience — only a small badge changes
// in the top bar (visible only to the operator/teacher)
// ============================================================
export function useScriptedMode(remaining) {
  const [isScripted, setIsScripted] = useState(false);
  const [scriptedQueue, setScriptedQueue] = useState([...SCRIPTED_QUEUE]);

  // Listen for the secret key combo
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setIsScripted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // When mode toggles on, refresh queue against current remaining list
  useEffect(() => {
    if (isScripted) {
      setScriptedQueue(SCRIPTED_QUEUE.filter((n) => remaining.includes(n)));
    }
  }, [isScripted]); // eslint-disable-line

  // Consume the next scripted pick (if available in remaining pool)
  const consumeScripted = useCallback(
    (remaining) => {
      const available = scriptedQueue.filter((n) => remaining.includes(n));
      if (available.length === 0) return null;
      const chosen = available[0];
      setScriptedQueue((q) => q.filter((n) => n !== chosen));
      return chosen;
    },
    [scriptedQueue]
  );

  const reset = useCallback(() => {
    setScriptedQueue([...SCRIPTED_QUEUE]);
  }, []);

  return { isScripted, consumeScripted, reset };
}
