# InterroPick 🔴
### Classroom Random Name Picker — Interrogation Game Edition

A dramatic, cinematic name picker for classrooms with two modes:
- **Normal Mode** — True random selection with theatrical animations
- **Scripted Mode** — Silent priority queue, visually identical to normal

---

## Folder Structure

```
InterroPick/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Main orchestrator + pick sequence logic
    ├── data/
    │   └── students.js           # Class list + scripted queue
    ├── hooks/
    │   ├── useAudio.js           # Web Audio API SFX engine
    │   └── useScriptedMode.js    # Secret mode + keyboard listener
    └── components/
        ├── LoadingScreen.jsx     # Cinematic boot sequence
        ├── ClassList.jsx         # Left panel — all 32 students
        ├── HistoryPanel.jsx      # Right panel — pick history
        ├── Roulette.jsx          # Scrolling name strip animation
        └── RevealCard.jsx        # Countdown + glitch + typing reveal
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

```bash
# 1. Navigate to project folder
cd InterroPick

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

---

## How to Use

### Normal Mode
1. Open the app — watch the loading screen boot sequence
2. Click **▶ START INTERROGATION**
3. The roulette spins → countdown 3→2→1 → name reveals with typing effect
4. Previously picked names appear in red on the left panel
5. Pick history accumulates on the right panel
6. Click **↺ RESET ALL** to start over

### Secret Scripted Mode (Hidden)
- Press **`Ctrl + Shift + S`** to toggle scripted mode
- A small orange badge appears in the top bar — only visible to the operator
- The animation looks **100% identical** to normal mode
- Scripted priority order:
  1. DAYAO, BABY JOY C.
  2. LAYUG, ERICK
  3. LALO, JOHN PATRICK RUSSEL D.
  4. CAUSAPIN, IVERENE GRACE M.
  5. TADAS, CIELO A.
  6. LOPEZ, RANIEL CARL M.
- After the scripted queue is exhausted, falls back to true random

### Other Controls
| Control | Action |
|--------|--------|
| `♪ SFX ON/OFF` | Toggle all sound effects |
| `⊞ FULLSCREEN` | Enter fullscreen mode |
| `↺ RESET ALL` | Clear all picks and restart |
| `Ctrl+Shift+S` | Toggle scripted mode (secret) |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM rendering |
| vite | ^6.0.5 | Build tool + dev server |
| @vitejs/plugin-react | ^4.3.4 | Vite React plugin |

> **No Framer Motion or Tailwind CSS required** — all animations are done with
> CSS keyframes + inline styles, and all sounds via Web Audio API synthesis.
> This keeps the app dependency-light and fully offline-capable after build.

---

## Technical Notes

### Why the scripted pick happens BEFORE the animation
The winner is selected at the start of `startPick()`, before the roulette
even begins spinning. The roulette is purely theatrical. This means:
- No timing quirks between animation speed and pick result
- Scripted mode is undetectable — same animation every time
- True randomness is preserved for non-scripted picks

### Sound Engine
All SFX are synthesized in real-time using the Web Audio API:
- No audio files to host or load
- Instant playback, no latency
- Tones: tick, spin, countdown beeps, dramatic reveal chord

### Responsive Design
- Left and right panels hide on screens < 700px wide
- Stage and roulette use `clamp()` for fluid sizing
- Works on tablets and mobile in landscape mode
"# Interro-Pick" 
