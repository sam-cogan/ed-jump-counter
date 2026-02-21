# ED Jump Counter

A desktop application that displays remaining jumps in an Elite Dangerous route on a second screen. Designed with ED's dark sci-fi aesthetic.

![Elite Dangerous Jump Counter](./assets/screenshot.png)

## Features

- **Real-time jump tracking** - Watches Elite Dangerous journal files for route and jump events
- **Sleek ED-themed UI** - Dark theme with orange accents matching the game's HUD
- **Always-on-top option** - Perfect for second monitor/overlay use
- **Frameless window** - Minimalist design that stays out of the way
- **Carrier jump support** - Tracks both FSD and carrier jumps

## How It Works

Elite Dangerous writes game events to JSON log files in real-time. This app watches those files and:

1. Detects when you plot a route (`NavRoute` event)
2. Counts completed jumps (`FSDJump` / `CarrierJump` events)
3. Updates the display with remaining jumps
4. Resets when you clear the route or plot a new one

## Installation

### From Release

1. Download the latest release from the [Releases page](https://github.com/sam-cogan/ed-jump-counter/releases)
2. Run the installer (Windows) or extract the archive
3. Launch "ED Jump Counter"

### From Source

```bash
# Clone the repository
git clone https://github.com/sam-cogan/ed-jump-counter.git
cd ed-jump-counter

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Usage

1. Launch ED Jump Counter
2. Start Elite Dangerous
3. Plot a route to your destination
4. The counter will automatically update as you make jumps

### Controls

- **📌 Pin button** - Toggle always-on-top mode
- **— Minimize** - Minimize to taskbar
- **× Close** - Exit the application
- **Drag title bar** - Move the window

## Configuration

The app automatically detects Elite Dangerous journal files in the default location:

```
%USERPROFILE%\Saved Games\Frontier Developments\Elite Dangerous\
```

## Tech Stack

- **Electron** - Cross-platform desktop framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **chokidar** - File watching

## Development

```bash
# Start development server
npm run dev

# In another terminal, start Electron in dev mode
npm run electron:dev

# Build for production
npm run build

# Package for distribution
npm run package
```

## Journal Events

The app monitors these Elite Dangerous journal events:

| Event | Purpose |
|-------|---------|
| `NavRoute` | New route plotted - sets total jumps |
| `FSDJump` | FSD jump completed - increments counter |
| `CarrierJump` | Fleet carrier jump - increments counter |
| `NavRouteClear` | Route cleared - resets counter |

## License

MIT

## Author

Sam Cogan - [@sam_cogan](https://twitter.com/sam_cogan)

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

*Not affiliated with Frontier Developments. Elite Dangerous is a trademark of Frontier Developments plc.*
