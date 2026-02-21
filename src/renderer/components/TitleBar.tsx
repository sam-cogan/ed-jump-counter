import React from 'react';
import '../styles/TitleBar.css';

interface TitleBarProps {
  alwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ alwaysOnTop, onToggleAlwaysOnTop, showSettings, onToggleSettings }) => {
  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag">
        <span className="title">ED JUMP COUNTER</span>
      </div>
      <div className="title-bar-controls">
        {onToggleSettings && (
          <button
            className={`control-btn settings-btn ${showSettings ? 'active' : ''}`}
            onClick={onToggleSettings}
            title={showSettings ? 'Back' : 'Settings'}
          >
            ⚙
          </button>
        )}
        <button 
          className={`control-btn pin-btn ${alwaysOnTop ? 'active' : ''}`}
          onClick={onToggleAlwaysOnTop}
          title={alwaysOnTop ? 'Unpin from top' : 'Pin to top'}
        >
          📌
        </button>
        <button 
          className="control-btn minimize-btn" 
          onClick={handleMinimize}
          title="Minimize"
        >
          —
        </button>
        <button 
          className="control-btn close-btn" 
          onClick={handleClose}
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
