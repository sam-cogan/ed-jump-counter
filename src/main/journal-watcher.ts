import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import chokidar, { FSWatcher } from 'chokidar';

interface NavRoute {
  StarSystem: string;
  SystemAddress: number;
  StarPos: number[];
  StarClass: string;
}

interface RouteData {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
  route: NavRoute[];
}

interface JournalEvent {
  timestamp: string;
  event: string;
  [key: string]: unknown;
}

export class JournalWatcher extends EventEmitter {
  private journalDir: string;
  private watcher: FSWatcher | null = null;
  private currentFile: string = '';
  private filePosition: number = 0;
  private state: RouteData = {
    totalJumps: 0,
    completedJumps: 0,
    currentSystem: '',
    destinationSystem: '',
    route: []
  };
  private routeFilePath: string = '';

  constructor(journalDir: string) {
    super();
    this.journalDir = journalDir;
    this.routeFilePath = path.join(this.journalDir, 'NavRoute.json');
    this.startWatching();
  }

  private startWatching(): void {
    // Check if directory exists
    if (!fs.existsSync(this.journalDir)) {
      console.warn(`Journal directory not found: ${this.journalDir}`);
      return;
    }

    // Initialize with existing files
    const files = fs.readdirSync(this.journalDir)
      .filter(f => f.startsWith('Journal.') && f.endsWith('.log'))
      .sort();

    if (files.length > 0) {
      this.currentFile = path.join(this.journalDir, files[files.length - 1]);
      this.readCurrentFile();
    }

    // Watch for new files and changes
    this.watcher = chokidar.watch(this.journalDir, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    this.watcher.on('add', (filePath: string) => {
      const basename = path.basename(filePath);
      if (basename.startsWith('Journal.') && basename.endsWith('.log')) {
        console.log('New journal file detected:', filePath);
        this.currentFile = filePath;
        this.filePosition = 0;
        this.readCurrentFile();
      }
    });

    this.watcher.on('change', (filePath: string) => {
      if (filePath === this.currentFile) {
        this.readCurrentFile();
      }
    });

    // Also watch NavRoute.json
    if (fs.existsSync(this.routeFilePath)) {
      this.readNavRouteFile();
    }

    this.watcher.add(this.routeFilePath);
  }

  private readCurrentFile(): void {
    if (!this.currentFile || !fs.existsSync(this.currentFile)) {
      return;
    }

    try {
      const content = fs.readFileSync(this.currentFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());

      // Only process new lines
      const linesToProcess = lines.slice(this.filePosition);
      this.filePosition = lines.length;

      for (const line of linesToProcess) {
        try {
          const event: JournalEvent = JSON.parse(line);
          this.processEvent(event);
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    } catch (e) {
      console.error('Error reading journal file:', e);
    }
  }

  private processEvent(event: JournalEvent): void {
    switch (event.event) {
      case 'NavRoute':
        this.handleNavRoute(event);
        break;
      case 'FSDJump':
        this.handleFSDJump(event);
        break;
      case 'NavRouteClear':
        this.handleNavRouteClear();
        break;
      case 'CarrierJump':
        this.handleCarrierJump(event);
        break;
    }
  }

  private handleNavRoute(event: JournalEvent): void {
    const routeData = event.Route as NavRoute[];
    if (routeData && routeData.length > 0) {
      this.state.route = routeData;
      this.state.totalJumps = routeData.length - 1;
      this.state.completedJumps = 0;
      this.state.destinationSystem = routeData[routeData.length - 1].StarSystem;
      
      // Read NavRoute.json for more details
      this.readNavRouteFile();

      this.emit('routeUpdate', { ...this.state });
    }
  }

  private readNavRouteFile(): void {
    try {
      if (fs.existsSync(this.routeFilePath)) {
        const content = fs.readFileSync(this.routeFilePath, 'utf-8');
        const routeData = JSON.parse(content);
        
        if (routeData.Route && routeData.Route.length > 0) {
          this.state.route = routeData.Route;
          this.state.totalJumps = routeData.Route.length - 1;
          this.state.destinationSystem = routeData.Route[routeData.Route.length - 1].StarSystem;
        }
      }
    } catch (e) {
      // NavRoute.json might not exist yet
    }
  }

  private handleFSDJump(event: JournalEvent): void {
    this.state.completedJumps++;
    this.state.currentSystem = event.StarSystem as string;

    this.emit('jumpComplete', { ...this.state });
  }

  private handleCarrierJump(event: JournalEvent): void {
    // Carrier jumps also count as jumps
    this.state.completedJumps++;
    this.state.currentSystem = event.FarSystem as string;

    this.emit('jumpComplete', { ...this.state });
  }

  private handleNavRouteClear(): void {
    this.state = {
      totalJumps: 0,
      completedJumps: 0,
      currentSystem: '',
      destinationSystem: '',
      route: []
    };

    this.emit('routeUpdate', { ...this.state });
  }

  getState(): RouteData {
    return { ...this.state };
  }

  destroy(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
