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
  // Re-render when onboarding tab gate changes
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    const handler = () => forceTick((x) => x + 1);
    document.addEventListener('websvf-onboarding-tabs-gate-change', handler);
    return () => document.removeEventListener('websvf-onboarding-tabs-gate-change', handler);
  }, []);

  const isSelectionAllowed = (tab: OutputType) => {
    const locked = document.documentElement.dataset.onboardingTabsLocked === 'true';
    if (!locked) return true;
    const allowed = document.documentElement.dataset.onboardingAllowedOutput;
    if (!allowed) return false;
    if (allowed === 'any') return true;
    return allowed === tab;
  };

  const handleSelect = (tab: OutputType) => {
    if (!isSelectionAllowed(tab)) return;
    setCurrentOutput(tab);
  };

  const disabledClass = (tab: OutputType) => (!isSelectionAllowed(tab) ? styles.disabledItem : '');

  return (
    <nav className={`${styles.navBar} output-menu-bar`}>
      <ul className={styles.navList}>
        <li
          className={`${styles.navItem} ${currentOutput === 'Graph' ? styles.active : ''} ${disabledClass('Graph')}`}
          onClick={() => handleSelect('Graph')}
          draggable
          onDragStart={(e) => onDragStartTab('Graph', e)}
          aria-disabled={!isSelectionAllowed('Graph')}
        >
          Graphs
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal Output' ? styles.active : ''} ${disabledClass('Terminal Output')}`}
          onClick={() => handleSelect('Terminal Output')}
          draggable
          onDragStart={(e) => onDragStartTab('Terminal Output', e)}
          aria-disabled={!isSelectionAllowed('Terminal Output')}
        >
          Terminal Output
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'CodeGPT' ? styles.active : ''} ${disabledClass('CodeGPT')}`}
          onClick={() => handleSelect('CodeGPT')}
          draggable
          onDragStart={(e) => onDragStartTab('CodeGPT', e)}
          aria-disabled={!isSelectionAllowed('CodeGPT')}
        >
          CodeGPT
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'LLVMIR' ? styles.active : ''} ${disabledClass('LLVMIR')}`}
          onClick={() => handleSelect('LLVMIR')}
          draggable
          onDragStart={(e) => onDragStartTab('LLVMIR', e)}
          aria-disabled={!isSelectionAllowed('LLVMIR')}
        >
          LLVMIR
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal' ? styles.active : ''} ${disabledClass('Terminal')}`}
          onClick={() => handleSelect('Terminal')}
          draggable
          onDragStart={(e) => onDragStartTab('Terminal', e)}
          aria-disabled={!isSelectionAllowed('Terminal')}
        >
          Terminal
        </li>
      </ul>
    </nav>
  );
};

export default OutputMenuBar;
