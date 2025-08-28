import React from 'react';
import styles from './outputMenuBar.module.css';
import type { OutputType } from '../../multiSession/sessionManager';

interface OutputMenuBarProps {
  currentOutput: OutputType;
  setCurrentOutput: (outputType: OutputType) => void;
  onDragStartTab: (tab: OutputType, e: React.DragEvent<HTMLElement>) => void;
}

const OutputMenuBar: React.FC<OutputMenuBarProps> = ({
  currentOutput,
  setCurrentOutput,
  onDragStartTab,
}) => {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li
          className={`${styles.navItem} ${currentOutput === 'Graph' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Graph')}
          draggable
          onDragStart={(e) => onDragStartTab('Graph', e)}
        >
          Graphs
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal Output' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Terminal Output')}
          draggable
          onDragStart={(e) => onDragStartTab('Terminal Output', e)}
        >
          Terminal Output
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'CodeGPT' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('CodeGPT')}
          draggable
          onDragStart={(e) => onDragStartTab('CodeGPT', e)}
        >
          CodeGPT
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'LLVMIR' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('LLVMIR')}
          draggable
          onDragStart={(e) => onDragStartTab('LLVMIR', e)}
        >
          LLVMIR
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Terminal')}
          draggable
          onDragStart={(e) => onDragStartTab('Terminal', e)}
        >
          Terminal
        </li>
      </ul>
    </nav>
  );
};

export default OutputMenuBar;
