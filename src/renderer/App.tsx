import React, { useState, useEffect, useCallback } from 'react';
import JumpCounter from './components/JumpCounter';
import Settings from './components/Settings';

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

function App() {
  const [state, setState] = useState<JumpState>({
    totalJumps: 0,
    completedJumps: 0,
    currentSystem: '',
    destinationSystem: '',
    route: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);

  const loadState = useCallback(async () => {
    try {
      const savedState = await (window as unknown as { electronAPI: { getJumpState: () => Promise<JumpState> } }).electronAPI.getJumpState();
      if (savedState) {
        setState(savedState);
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }, []);

  useEffect(() => {
    loadState();

    const electronAPI = (window as unknown as { electronAPI: { onRouteUpdate: (cb: (data: JumpState) => void); onJumpComplete: (cb: (data: JumpState) => void) } }).electronAPI;
    
    electronAPI.onRouteUpdate((data) => {
      setState(data);
    });

    electronAPI.onJumpComplete((data) => {
      setState(data);
    });
  }, [loadState]);

  const handleToggleAlwaysOnTop = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);
    await (window as unknown as { electronAPI: { setAlwaysOnTop: (v: boolean) => Promise<void> } }).electronAPI.setAlwaysOnTop(newValue);
  };

  const remainingJumps = state.totalJumps - state.completedJumps;

  return (
    <div className="app">
      <div className="window-controls">
        <button className="control-btn settings-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
          ⚙
        </button>
        <button className="control-btn close-btn" onClick={() => (window as unknown as { electronAPI: { closeWindow: () => void } }).electronAPI.closeWindow()} title="Close">
          ×
        </button>
      </div>

      {showSettings ? (
        <Settings 
          alwaysOnTop={alwaysOnTop} 
          onToggleAlwaysOnTop={handleToggleAlwaysOnTop}
        />
      ) : (
        <JumpCounter 
          remainingJumps={remainingJumps}
          currentSystem={state.currentSystem}
          destinationSystem={state.destinationSystem}
          totalJumps={state.totalJumps}
          hasRoute={state.totalJumps > 0}
        />
      )}
    </div>
  );
}

export default App;
