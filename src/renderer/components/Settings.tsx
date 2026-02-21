import React from 'react';

interface SettingsProps {
  alwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
}

function Settings({ alwaysOnTop, onToggleAlwaysOnTop }: SettingsProps) {
  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="setting-item">
        <label className="toggle-label">
          <span>Always on Top</span>
          <input 
            type="checkbox" 
            checked={alwaysOnTop}
            onChange={onToggleAlwaysOnTop}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-info">
        <p>ED Jump Counter v1.0.0</p>
        <p>Watches your Elite Dangerous journal for route and jump data.</p>
      </div>
    </div>
  );
}

export default Settings;
