interface ElectronAPI {
  getJumpState: () => Promise<JumpState | null>;
  setAlwaysOnTop: (value: boolean) => Promise<void>;
  closeWindow: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  onRouteUpdate: (callback: (data: JumpState) => void) => void;
  onJumpComplete: (callback: (data: JumpState) => void) => void;
}

interface JumpState {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
  route: Array<{
    StarSystem: string;
    StarClass: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export type { JumpState, ElectronAPI };
