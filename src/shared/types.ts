export interface NavRouteEntry {
  StarSystem: string;
  SystemAddress: number;
  StarPos: [number, number, number];
  StarClass: string;
}

export interface RouteState {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
  route: NavRouteEntry[];
}

export interface JumpEvent {
  completed: number;
  remaining: number;
  currentSystem: string;
}

// Extend Window interface for Electron API
declare global {
  interface Window {
    electronAPI: {
      getJumpState: () => Promise<RouteState | null>;
      setAlwaysOnTop: (value: boolean) => Promise<void>;
      closeWindow: () => Promise<void>;
      minimizeWindow: () => Promise<void>;
      onRouteUpdate: (callback: (data: RouteState) => void) => () => void;
      onJumpComplete: (callback: (data: JumpEvent) => void) => () => void;
    };
  }
}
