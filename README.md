# ED Jump Counter

A desktop application that displays remaining jumps in an Elite Dangerous route on a second screen. Designed to be visually appealing with ED's dark sci-fi aesthetic.

![ED Jump Counter](https://img.shields.io/badge/Elite%20Dangerous-Jump%20Counter-orange)
![Electron](https://img.shields.io/badge/Electron-28-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- 🚀 Real-time jump tracking from Elite Dangerous journal files
- 🎨 Dark ED-themed UI with orange/blue accents
- 🖥️ Always-on-top mode for second screen display
- 📊 Progress bar showing route completion
- ⚙️ Settings for window behavior
- 📦 Windows installer included

## Installation

### Windows (MSI Installer)

1. Download the latest `EDJumpCounter-Setup-x.x.x.exe` from [Releases](../../releases)
2. Run the installer
3. Launch ED Jump Counter from Start Menu or Desktop

### From Source

```bash
# Clone the repository
git clone https://github.com/sam-cogan/ed-jump-counter.git
cd ed-jump-counter

# Install dependencies
npm install

# Build and package
npm run build
```

The packaged installer will be in `release/` directory.

### Development

```bash
# Start development server with hot reload
npm run dev

# In a separate terminal, run Electron
npm run electron:dev
```

## Usage

1. Launch ED Jump Counter
2. The window will appear with a transparent background
3. Plot a route in Elite Dangerous
4. The app will automatically detect and display remaining jumps
5. Each jump completion updates the counter in real-time

### Window Controls

- **Settings (⚙️)**: Toggle settings panel
- **Close (×)**: Close the application
- **Drag**: Move the window around

### Settings

- **Always on Top**: Keep the window on top of other applications (enabled by default)

## How It Works

ED Jump Counter monitors Elite Dangerous journal files:

1. **Journal Location**: `%USERPROFILE%\Saved Games\Frontier Developments\Elite Dangerous\`
2. **Events Tracked**:
   - `NavRoute`: Detects when a route is plotted
   - `FSDJump`: Counts completed jumps
   - `NavRouteClear`: Resets when route is cleared

## Supported Versions

- Elite Dangerous: Horizons (3.8+)
- Elite Dangerous: Odyssey (4.0+)
- Windows 10/11

## Building

### Prerequisites

- Node.js 18+
- npm 9+
- Windows build tools (for Windows builds)

```bash
# Install dependencies
npm install

# Build for current platform
npm run build

# Build for specific platform
npm run build -- --win    # Windows
npm run build -- --mac    # macOS
npm run build -- --linux  # Linux
```

## Architecture

```
ed-jump-counter/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts    # Window creation & IPC
│   │   └── journal-watcher.ts  # File watching & event parsing
│   ├── renderer/       # React UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── styles/
│   └── shared/         # Shared types
├── assets/             # Icons
├── public/             # Static assets
└── package.json
```

## Tech Stack

- **Electron**: Desktop framework
- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **chokidar**: File watching
- **electron-builder**: Application packaging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Elite Dangerous is a trademark of Frontier Developments plc
- Inspired by the need for a second-screen jump counter

---

**o7, Commander! 🦑**
