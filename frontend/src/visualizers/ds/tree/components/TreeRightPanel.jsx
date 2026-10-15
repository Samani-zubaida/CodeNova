import React from 'react';
import { Activity, X, Plus, Trash2 } from 'lucide-react';
import DryRunVariableTracker from '../../../../components/visualizer/DryRunVariableTracker';
import { SimpleStackDiagram, SimpleQueueDiagram } from './TreeAuxiliaryDiagrams';

export default function TreeRightPanel({
  rightPanelTab,
  setRightPanelTab,
  currentAlgo,
  currentStepIdx,
  steps = [],
  activeStep,
  stepVariables,
  isVoiceEnabled,
  setIsVoiceEnabled,
  activeDiagram,
  setDiagramTab,
  selectedNode,
  setSelectedNode,
  setInCanvasModal,
  handleDelete
}) {
  return (
    <div className="flex flex-col h-full gap-3 overflow-y-auto pr-1">
      {/* Tab Switcher */}
      <div className="flex items-center p-1 bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl gap-1">
        <button
          onClick={() => setRightPanelTab('tracker')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            rightPanelTab === 'tracker'
              ? 'bg-[#AB526B] text-white shadow-sm'
              : 'text-gray-600 dark:text-[#BCA297]'
          }`}
        >
          Dry Run
        </button>
        <button
          onClick={() => setRightPanelTab('chamber')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            rightPanelTab === 'chamber'
              ? 'bg-[#AB526B] text-white shadow-sm'
              : 'text-gray-600 dark:text-[#BCA297]'
          }`}
        >
          Chamber
        </button>
      </div>

      {rightPanelTab === 'tracker' ? (
        <DryRunVariableTracker
          title={`${currentAlgo.name} — Trace`}
          stepNumber={currentStepIdx + 1}
          totalSteps={Math.max(1, steps.length)}
          actionBadge={{
            label: activeStep?.phase || 'READY',
            icon: <Activity className="w-3.5 h-3.5 text-[#AB526B]" />,
            bg: 'bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/30'
          }}
          codeStatement={activeStep?.codeStatement || `// Algorithm: ${currentAlgo.name}`}
          explanation={activeStep?.explanation?.intuition || activeStep?.explanation?.action || 'Step trace'}
          variables={stepVariables}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-1 bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl gap-1">
            <button
              onClick={() => setDiagramTab('stack')}
              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeDiagram === 'stack' ? 'bg-[#AB526B] text-white shadow-sm' : 'text-gray-500 dark:text-[#BCA297]'
              }`}
            >
              Stack (LIFO)
            </button>
            <button
              onClick={() => setDiagramTab('queue')}
              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeDiagram === 'queue' ? 'bg-[#C5CEAE] text-[#2D1F23] font-bold shadow-sm' : 'text-gray-500 dark:text-[#BCA297]'
              }`}
            >
              Queue (FIFO)
            </button>
          </div>

          {activeDiagram === 'queue' ? (
            <SimpleQueueDiagram queue={activeStep?.queue || []} activeVal={activeStep?.activeNodeVal} />
          ) : (
            <SimpleStackDiagram stack={activeStep?.stack || []} activeVal={activeStep?.activeNodeVal} />
          )}
        </div>
      )}

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="p-3 rounded-2xl bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] shadow-lg mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
              Selected Node [{selectedNode.val}]
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white p-0.5">
              <X size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setInCanvasModal({
                  isOpen: true,
                  parentVal: selectedNode.val,
                  side: 'left',
                  inputVal: String(selectedNode.val - 5)
                });
              }}
              className="py-1 px-2 rounded-xl bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/40 text-[10px] font-bold flex items-center justify-center gap-1"
            >
              <Plus size={12} /> Add Left
            </button>
            <button
              onClick={() => {
                setInCanvasModal({
                  isOpen: true,
                  parentVal: selectedNode.val,
                  side: 'right',
                  inputVal: String(selectedNode.val + 5)
                });
              }}
              className="py-1 px-2 rounded-xl bg-[#C5CEAE]/25 text-[#2D1F23] dark:text-[#C5CEAE] border border-[#C5CEAE]/40 text-[10px] font-bold flex items-center justify-center gap-1"
            >
              <Plus size={12} /> Add Right
            </button>
            <button
              onClick={() => handleDelete(selectedNode.val)}
              className="col-span-2 py-1 px-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-bold flex items-center justify-center gap-1 mt-0.5"
            >
              <Trash2 size={12} /> Delete [{selectedNode.val}]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
