import React from 'react';
import '../styles/StatusBar.css';

interface StatusBarProps {
  status: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => (
  <div data-testid="status-bar" className="status-bar">
    <span>status: {status}</span>
  </div>
);
