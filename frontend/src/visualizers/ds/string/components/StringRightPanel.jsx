import React from 'react';
import DryRunVariableTracker from '../../../../components/visualizer/DryRunVariableTracker';
import { getStringHUDInfo } from '../utils/stringHUD';

export default function StringRightPanel({
  currentAlgo = {},
  currentAlgoId = 'kmp',
  currentStepIdx = 0,
  steps = [],
  step = {},
  textInput = '',
  patternInput = '',
  secondTextInput = '',
  trackedVariables = [],
  currentCodeStatement = '',
  isVoiceEnabled = false,
  onToggleVoice = () => {}
}) {
  return (
    <div className="flex flex-col gap-3">
      <DryRunVariableTracker
        title={`${currentAlgo.name} — Dry Run`}
        stepNumber={currentStepIdx + 1}
        totalSteps={Math.max(1, steps.length)}
        actionBadge={(() => {
          const h = getStringHUDInfo(currentAlgoId, step, textInput, patternInput, secondTextInput);
          return { label: h.badge, icon: h.icon, bg: h.bg };
        })()}
        codeStatement={currentCodeStatement}
        explanation={(() => {
          const h = getStringHUDInfo(currentAlgoId, step, textInput, patternInput, secondTextInput);
          return h.why;
        })()}
        variables={trackedVariables}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={onToggleVoice}
      />
    </div>
  );
}
