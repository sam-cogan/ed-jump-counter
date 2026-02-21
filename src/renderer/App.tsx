import React, { useState, useEffect, useCallback } from 'react';
import JumpCounter from './components/JumpCounter';
import Settings from './components/Settings';
import type { JumpState } from './types';

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
      const savedState = await window.electronAPI.getJumpState();
      if (savedState) {
        setState(savedState);
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }, []);

  useEffect(() => {
    loadState();

    window.electronAPI.onRouteUpdate((data: JumpState) => {
      setState(data);
    });

    window.electronAPI.onJumpComplete((data: JumpState) => {
      setState(data);
    });
  }, [loadState]);

  const handleToggleAlwaysOnTop = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);
    await window.electronAPI.setAlwaysOnTop(newValue);
  };

  const remainingJumps = state.totalJumps - state.completedJumps;

  return (
    <div className="app">
      <div className="window-controls">
        <button className="control-btn settings-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
          ⚙
        </button>
        <button className="control-btn close-btn" onClick={() => window.electronAPI.closeWindow()} title="Close">
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
