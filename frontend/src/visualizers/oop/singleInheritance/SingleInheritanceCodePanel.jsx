import React from 'react';
import OopIdeCodePanel from '../components/common/OopIdeCodePanel';
import { JAVA_CODE_LINES } from '../data/singleInheritanceData';

/**
 * SingleInheritanceCodePanel - Synchronized Java architecture view
 * Automatically highlights code lines corresponding to active transfer animations or hovered members.
 * Backed by OopIdeCodePanel for smooth auto-scrolling, syntax highlighting, and collapse controls.
 */
export const SingleInheritanceCodePanel = ({
  activeMemberId = null,
  activeHighlightKey = null,
  activeStepNumber = 1,
  telemetry = null,
  isOpen = true,
  onToggleOpen,
  maxHeight = '230px',
  className = '',
}) => {
  return (
    <OopIdeCodePanel
      filename="SingleInheritanceDemo.java"
      codeLines={JAVA_CODE_LINES}
      activeMemberId={activeMemberId}
      activeHighlightKey={activeHighlightKey}
      telemetry={telemetry}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      maxHeight={maxHeight}
      accentColor="#0EA5E9"
      className={className}
    />
  );
};
