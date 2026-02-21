# EDJumpCounter - Technical Specification

## Overview
A desktop application that displays remaining jumps in an Elite Dangerous route on a second screen. Designed to be visually appealing with ED's dark sci-fi aesthetic.

## Data Source

### Elite Dangerous Journal Files
ED writes game events to JSON log files in real-time:
- **Location**: `%USERPROFILE%\Saved Games\Frontier Developments\Elite Dangerous\`
- **Format**: Line-delimited JSON (one event per line)
- **Files**: `Journal.<timestamp>.log`

### Key Events

#### NavRoute Event
Written when player plots a route:
```json
{
  "timestamp": "2026-02-21T10:00:00Z",
  "event": "NavRoute",
  "Route": [
    {"StarSystem": "Sol", "SystemAddress": 123, "StarPos": [0,0,0], "StarClass": "G"},
    {"StarSystem": "Alpha Centauri", "SystemAddress": 456, "StarPos": [3.5,0,0], "StarClass": "K"}
  ]
}
```

Also writes `NavRoute.json` with full route details.

#### FSDJump Event
Written when completing a jump:
```json
{
  "timestamp": "2026-02-21T10:05:00Z",
  "event": "FSDJump",
  "StarSystem": "Alpha Centauri",
  "SystemAddress": 456,
  "JumpDist": 4.37,
  "FuelUsed": 0.5,
  "FuelLevel": 15.2
}
```

#### NavRouteClear Event
Written when route is cleared/completed.

### Logic
1. Watch journal directory for new files and changes
2. Parse `NavRoute` events to get total jumps in route
3. Count `FSDJump` events to track completed jumps
4. Calculate: `remaining = total - completed`
5. Reset on `NavRouteClear` or new `NavRoute`

## Technology Stack

### Recommended: Electron + React + TypeScript
**Rationale:**
- Cross-platform (Windows primary, Mac/Linux bonus)
- Easy to create custom dark UI matching ED aesthetic
- Simple packaging and distribution (single .exe)
- Large ecosystem, easy to find help
- File watching APIs built into Node.js

**Alternatives considered:**
- **Flutter**: Good UI, but less mature for desktop, Dart ecosystem smaller
- **Tauri**: Lighter than Electron, but smaller community
- **.NET MAUI**: Windows-first, less design flexibility
- **Python + PyQt**: Works, but packaging is messier

### Key Dependencies
- `chokidar`: File watching
- `electron-builder`: Packaging
- `framer-motion`: Animations (optional)

## Features

### MVP (v1.0)
- [ ] Auto-detect ED journal directory
- [ ] Display remaining jumps in route (big, readable number)
- [ ] Real-time updates as jumps complete
- [ ] Always-on-top option for second monitor
- [ ] Dark theme matching ED aesthetic (orange/blue accents)
- [ ] System tray icon
- [ ] Windows installer

### Nice-to-Have (v1.x)
- [ ] Current system name display
- [ ] Destination system name
- [ ] Estimated time remaining (based on avg jump time)
- [ ] Jump history/log
- [ ] Fuel level indicator
- [ ] Custom themes/colors
- [ ] Mac/Linux support
- [ ] Sound notifications

## UI Design

### Main Display
```
┌─────────────────────────────────┐
│                                 │
│              12                 │  ← Large number (remaining jumps)
│         JUMPS REMAINING         │
│                                 │
│  ────────────────────────────   │
│  Current: Sol                   │
│  Destination: Colonia           │
│                                 │
└─────────────────────────────────┘
```

### Visual Style
- Dark background (#0a0a0a or pure black)
- Orange accent (#ff8c00) matching ED HUD
- Optional blue accent (#00b4ff)
- Monospace/tech font (Rajdhani, Orbitron, or ED-like)
- Subtle glow effects on numbers
- Minimal chrome, borderless window option

## Development Phases

### Phase 1: Core (MVP)
1. Set up Electron + React + TypeScript project
2. Implement journal file watcher
3. Parse NavRoute and FSDJump events
4. Create basic UI with jump counter
5. Add always-on-top functionality
6. Package for Windows

### Phase 2: Polish
1. Improve UI/animations
2. Add system tray integration
3. Settings panel (journal path override, theme)
4. Error handling and edge cases

### Phase 3: Extras
1. Additional data displays
2. Mac/Linux builds
3. Auto-updater

## Gotchas & Considerations

1. **Journal file rotation**: ED creates new journal files per session. Need to watch for new files, not just changes.

2. **Game not running**: Handle gracefully when no journal updates are happening.

3. **Route changes mid-journey**: Player can re-plot route. Need to handle `NavRoute` events at any time.

4. **Carrier jumps**: `CarrierJump` events are different from `FSDJump`. May want to handle these too.

5. **Odyssey vs Horizons**: Both use same journal format, should work for both.

6. **Permissions**: Journal directory is user-accessible, no admin needed.

7. **Performance**: File watching should be efficient. Don't poll too frequently.

## Repository Structure
```
ed-jump-counter/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts
│   │   └── journal-watcher.ts
│   ├── renderer/       # React UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles/
│   └── shared/         # Shared types
│       └── types.ts
├── assets/             # Icons, fonts
├── package.json
├── electron-builder.yml
├── tsconfig.json
└── README.md
```

## Getting Started (for coding agent)

1. Create new directory and initialize:
   ```bash
   mkdir ed-jump-counter && cd ed-jump-counter
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install electron react react-dom chokidar
   npm install -D typescript @types/react electron-builder vite
   ```

3. Set up Electron + React boilerplate

4. Implement journal watcher in main process

5. Create React UI in renderer

6. Test with sample journal files (can create mock data)

7. Package with electron-builder
