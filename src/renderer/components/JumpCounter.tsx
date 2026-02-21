import React from 'react';

interface JumpCounterProps {
  remainingJumps: number;
  currentSystem: string;
  destinationSystem: string;
  totalJumps: number;
  hasRoute: boolean;
}

function JumpCounter({ 
  remainingJumps, 
  currentSystem, 
  destinationSystem,
  totalJumps,
  hasRoute 
}: JumpCounterProps) {
  if (!hasRoute) {
    return (
      <div className="jump-counter no-route">
        <div className="counter-display">
          <div className="number">NO ROUTE</div>
          <div className="label">PLOT A ROUTE</div>
        </div>
        <div className="system-info">
          <span className="system-name">Waiting for navigation data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="jump-counter">
      <div className="counter-display">
        <div className="number glow">{remainingJumps}</div>
        <div className="label">JUMPS REMAINING</div>
      </div>
      
      <div className="route-info">
        <div className="route-line">
          <span className="label">FROM</span>
          <span className="system from">{currentSystem || 'Unknown'}</span>
        </div>
        <div className="route-line">
          <span className="label">TO</span>
          <span className="system to">{destinationSystem}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(totalJumps - remainingJumps) / totalJumps * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {totalJumps - remainingJumps} / {totalJumps} jumps
        </div>
      </div>
    </div>
  );
}

export default JumpCounter;
