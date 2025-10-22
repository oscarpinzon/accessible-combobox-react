import React from 'react';
import styles from './StatusBar.module.css';
import type { StatusBarProps } from './types';

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => (
  <div data-testid="status-bar" className={styles.container}>
    <span className={styles.text}>status: {status}</span>
  </div>
);
