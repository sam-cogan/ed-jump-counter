import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  getJumpState: () => Promise<JumpState | null>;
  setAlwaysOnTop: (value: boolean) => Promise<void>;
  closeWindow: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  onRouteUpdate: (callback: (data: RouteData) => void) => () => void;
  onJumpComplete: (callback: (data: JumpData) => void) => () => void;
}

interface JumpState {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
}

interface RouteData {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
}

interface JumpData {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getJumpState: () => ipcRenderer.invoke('getJumpState'),
  setAlwaysOnTop: (value: boolean) => ipcRenderer.invoke('setAlwaysOnTop', value),
  closeWindow: () => ipcRenderer.invoke('closeWindow'),
  minimizeWindow: () => ipcRenderer.invoke('minimizeWindow'),
  
  onRouteUpdate: (callback: (data: RouteData) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: RouteData) => callback(data);
    ipcRenderer.on('routeUpdate', handler);
    return () => ipcRenderer.removeListener('routeUpdate', handler);
  },
  
  onJumpComplete: (callback: (data: JumpData) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: JumpData) => callback(data);
    ipcRenderer.on('jumpComplete', handler);
    return () => ipcRenderer.removeListener('jumpComplete', handler);
  }
} as ElectronAPI);
