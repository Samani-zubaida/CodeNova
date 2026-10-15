import React from 'react';
import DryRunVariableTracker from '../../../../components/visualizer/DryRunVariableTracker';
import { getLinkedListHUDInfo } from '../utils/linkedListHUD';

export default function LinkedListRightPanel({
  currentAlgo = {},
  currentAlgoId = 'singly',
  currentStepIdx = 0,
  steps = [],
  step = {},
  nodeList = [],
  currentDryRunVariables = [],
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
          const h = getLinkedListHUDInfo(currentAlgoId, step, step.nodes || nodeList);
          const IconComp = h.icon;
          return { 
            label: h.badge, 
            icon: IconComp ? <IconComp className="w-3.5 h-3.5" /> : null, 
            bg: h.bg 
          };
        })()}
        codeStatement={currentCodeStatement}
        explanation={(() => {
          const h = getLinkedListHUDInfo(currentAlgoId, step, step.nodes || nodeList);
          return h.why;
        })()}
        variables={currentDryRunVariables}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={onToggleVoice}
      />
    </div>
  );
}
