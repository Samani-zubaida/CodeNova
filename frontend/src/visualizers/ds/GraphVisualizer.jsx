import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { GRAPH_CATALOG } from './GraphHub';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';

// Modular domain imports
import { PRESET_TOPOLOGIES } from './graph/constants/graphTopologies';
import { GRAPH_CODE_SNIPPETS } from './graph/constants/graphSnippets';
import { GRAPH_INTUITIONS } from './graph/constants/graphIntuitions';
import { getInitialVisitedTable, generateGraphSteps } from './graph/generators/graphStepGenerators';
import GraphControlsPanel from './graph/components/GraphControlsPanel';
import GraphCanvasView from './graph/views/GraphCanvasView';
import GraphConceptModal from './graph/components/GraphConceptModal';
import SimpleQueueDiagram from './graph/components/SimpleQueueDiagram';
import SimpleLinkedListDiagram from './graph/components/SimpleLinkedListDiagram';

// Re-export constants for backward compatibility
export { GRAPH_INTUITIONS, GRAPH_CODE_SNIPPETS, PRESET_TOPOLOGIES };

export default function GraphVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgo = GRAPH_CATALOG.find(a => a.id === algoId) || GRAPH_CATALOG[0];

  // Graph Structure State
  const [selectedTopologyKey, setSelectedTopologyKey] = useState('standard');
  const [graphData, setGraphData] = useState(PRESET_TOPOLOGIES.standard);
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');

  // Playback & Animation Engine
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const timerRef = useRef(null);

  // Active step visual highlights
  const [activeNode, setActiveNode] = useState(null);
  const [probingNode, setProbingNode] = useState(null);
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [visitedSequence, setVisitedSequence] = useState([]);
  const [visitedTable, setVisitedTable] = useState({});
  const [queueState, setQueueState] = useState([]);
  const [stackState, setStackState] = useState([]);
  const [priorityQueueState, setPriorityQueueState] = useState([]);
  const [distanceMap, setDistanceMap] = useState({});
  const [inDegreeMap, setInDegreeMap] = useState({});
  const [topoOrder, setTopoOrder] = useState([]);
  const [nodeColors, setNodeColors] = useState({});
  const [activeEdge, setActiveEdge] = useState(null);
  const [highlightedPathEdges, setHighlightedPathEdges] = useState(new Set());
  const [highlightedPathNodes, setHighlightedPathNodes] = useState(new Set());
  const [kruskalEdgesState, setKruskalEdgesState] = useState([]);
  const [mstCost, setMstCost] = useState(0);
  const [dsuSets, setDsuSets] = useState({});
  const [rightPanelTab, setRightPanelTab] = useState('queue');
  const [showIntuitionModal, setShowIntuitionModal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // Pedagogical Explanation & Log
  const [explanation, setExplanation] = useState({
    title: `Welcome to ${currentAlgo.name}`,
    action: `Ready to begin graph algorithm dry run.`,
    why: `Explore traversal steps, node visits, and frontiers interactively.`,
    next: `Press Simulate to execute step-by-step traversal.`,
    badge: 'READY'
  });
  const [consoleLogs, setConsoleLogs] = useState([
    { msg: `> ${currentAlgo.name} visualizer mounted on ${graphData.name}.`, isError: false }
  ]);

  const log = (msg, isError = false) => {
    setConsoleLogs(prev => [{ msg, isError, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 40));
  };

  // Convert graphData edges to adjacency list for Linked List diagram
  const adjacencyList = useMemo(() => {
    const adj = {};
    graphData.nodes.forEach(n => { adj[n.id] = []; });
    graphData.edges.forEach(e => {
      adj[e.u]?.push({ target: e.v, weight: e.weight });
      if (!graphData.isDirected) {
        adj[e.v]?.push({ target: e.u, weight: e.weight });
      }
    });
    return adj;
  }, [graphData]);

  const applyStep = (idx, customSteps = null) => {
    const list = customSteps || animationSteps;
    if (!list || !list[idx]) return;
    const s = list[idx];
    setCurrentStepIdx(idx);
    if (s.activeNode !== undefined) setActiveNode(s.activeNode);
    if (s.probingNode !== undefined) setProbingNode(s.probingNode);
    if (s.visitedSet) setVisitedSet(new Set(s.visitedSet));
    if (s.visitedSequence) setVisitedSequence([...s.visitedSequence]);
    if (s.visitedTable) setVisitedTable({ ...s.visitedTable });
    if (s.queueState !== undefined) setQueueState(s.queueState);
    if (s.stackState !== undefined) setStackState(s.stackState);
    if (s.priorityQueueState !== undefined) setPriorityQueueState(s.priorityQueueState);
    if (s.distanceMap) setDistanceMap(s.distanceMap);
    if (s.inDegreeMap) setInDegreeMap(s.inDegreeMap);
    if (s.topoOrder) setTopoOrder(s.topoOrder);
    if (s.nodeColors) setNodeColors(s.nodeColors);
    if (s.activeEdge !== undefined) setActiveEdge(s.activeEdge);
    if (s.pathEdges && s.pathEdges.length > 0) {
      setHighlightedPathEdges(new Set(s.pathEdges));
      if (s.pathNodes && s.pathNodes.length > 0) {
        setHighlightedPathNodes(new Set(s.pathNodes));
      } else {
        const pNodes = new Set();
        s.pathEdges.forEach(pe => {
          const parts = pe.split('-');
          if (parts[0]) pNodes.add(parts[0]);
          if (parts[1]) pNodes.add(parts[1]);
        });
        setHighlightedPathNodes(pNodes);
      }
    } else {
      setHighlightedPathEdges(new Set());
      setHighlightedPathNodes(new Set());
    }
    if (s.kruskalEdges !== undefined) setKruskalEdgesState(s.kruskalEdges);
    if (s.mstCost !== undefined) setMstCost(s.mstCost);
    if (s.dsuSets !== undefined) setDsuSets(s.dsuSets);
    if (s.explanation) setExplanation(s.explanation);
    if (s.log) log(s.log, s.isError);
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setCurrentStepIdx(0);
    setActiveNode(null);
    setProbingNode(null);
    setVisitedSet(new Set());
    setVisitedSequence([]);
    setVisitedTable(getInitialVisitedTable(graphData.nodes));
    setQueueState([]);
    setStackState([]);
    setPriorityQueueState([]);
    setDistanceMap({});
    setInDegreeMap({});
    setTopoOrder([]);
    setNodeColors({});
    setActiveEdge(null);
    setHighlightedPathEdges(new Set());
    setHighlightedPathNodes(new Set());
    setKruskalEdgesState([]);
    setMstCost(0);
    setDsuSets({});
    setExplanation({
      title: `Reset: ${currentAlgo.name}`,
      action: `Visualizer reset to initial graph state.`,
      why: `Select start node or topology, then press Simulate to begin step-by-step animation.`,
      next: `Press Simulate ${currentAlgo.name.split(' ')[0]} to start.`,
      badge: 'RESET'
    });
    log('> Graph visualizer reset.');
  };

  // Synchronize topology with algorithm selection and auto-generate initial steps
  useEffect(() => {
    handleReset();
    let preferredTopo = 'standard';
    if (currentAlgo.id === 'toposort') preferredTopo = 'dag';
    else if (currentAlgo.id === 'cycle' || currentAlgo.id === 'tarjan_scc' || currentAlgo.id === 'kosaraju') preferredTopo = 'cyclic';
    else if (currentAlgo.id === 'bipartite') preferredTopo = 'bipartite';

    setSelectedTopologyKey(preferredTopo);
    const newGraph = PRESET_TOPOLOGIES[preferredTopo];
    setGraphData(newGraph);
    const sNode = newGraph.nodes[0]?.id || 'A';
    const tNode = newGraph.nodes[newGraph.nodes.length - 1]?.id || 'F';
    setStartNode(sNode);
    setTargetNode(tNode);
    setVisitedTable(getInitialVisitedTable(newGraph.nodes));
    log(`> Switched model to ${currentAlgo.name} on ${newGraph.name}.`);

    const steps = generateGraphSteps(currentAlgo.id, newGraph, { startNode: sNode, targetNode: tNode });
    if (steps && steps.length > 0) {
      setAnimationSteps(steps);
      applyStep(0, steps);
    }
  }, [currentAlgo.id]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < animationSteps.length - 1) {
          applyStep(currentStepIdx + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1200 / playbackSpeed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, animationSteps, playbackSpeed]);

  // Dispatch algorithm execution
  const handleExecute = () => {
    handleReset();
    const steps = generateGraphSteps(currentAlgo.id, graphData, { startNode, targetNode });
    if (steps && steps.length > 0) {
      setAnimationSteps(steps);
      applyStep(0, steps);
      setIsPlaying(true);
    }
  };

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle={currentAlgo.desc}
      currentPath={`/visualizer/graph/${currentAlgo.id}`}
      category="ds"
      cornerCard={
        <QuickCornerCard
          title="Graph Traversal"
          subtitle="Start & Target Nodes"
          position="top-left"
          graphInputs={{
            startNode,
            setStartNode,
            targetNode,
            setTargetNode,
            nodes: graphData.nodes,
            onExecute: handleExecute
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={handleReset}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Reset Graph Simulation"
              >
                <span>↺ Reset</span>
              </button>
              <button
                onClick={() => setShowIntuitionModal(true)}
                className="flex-1 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 transition-colors flex items-center justify-center gap-1"
                title="View Algorithm Intuition"
              >
                <span>💡 Intuition</span>
              </button>
            </div>
          }
        />
      }
      bannerAction={
        <div className="flex items-center gap-2">
          <Link
            to="/visualizer/graph"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#AB526B] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Graph Suite</span>
          </Link>
          <ComplexityBadge complexity={currentAlgo.complexity} />
        </div>
      }
      controls={
        <GraphControlsPanel
          currentAlgo={currentAlgo}
          onSelectAlgo={(id) => navigate(`/visualizer/graph/${id}`)}
          selectedTopologyKey={selectedTopologyKey}
          onSelectTopology={(key) => {
            setSelectedTopologyKey(key);
            const newGraph = PRESET_TOPOLOGIES[key];
            setGraphData(newGraph);
            setStartNode(newGraph.nodes[0]?.id || 'A');
            setTargetNode(newGraph.nodes[newGraph.nodes.length - 1]?.id || 'F');
            setVisitedTable(getInitialVisitedTable(newGraph.nodes));
            handleReset();
          }}
          startNode={startNode}
          setStartNode={setStartNode}
          targetNode={targetNode}
          setTargetNode={setTargetNode}
          nodes={graphData.nodes}
          onExecute={handleExecute}
          onReset={handleReset}
        />
      }
      playback={
        <VisualizerPlaybackBar
          currentStep={currentStepIdx}
          totalSteps={animationSteps.length}
          isPlaying={isPlaying}
          onPlay={() => {
            if (animationSteps.length === 0) {
              handleExecute();
              return;
            }
            if (currentStepIdx >= animationSteps.length - 1) {
              applyStep(0);
            }
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onReset={handleReset}
          onStepForward={() => {
            if (currentStepIdx < animationSteps.length - 1) {
              applyStep(currentStepIdx + 1);
            }
          }}
          onStepBackward={() => {
            if (currentStepIdx > 0) {
              applyStep(currentStepIdx - 1);
            }
          }}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          stepDescription={explanation.action || ''}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
      consoleOutput={consoleLogs}
      rightPanel={
        <div className="flex flex-col gap-3 h-full">
          {/* Top Tabs: Queue vs Linked List */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl">
            <button
              onClick={() => setRightPanelTab('queue')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'queue'
                  ? 'bg-white dark:bg-[#5C4E49] text-[#AB526B] dark:text-red-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>📥</span>
              <span>Queues (FIFO)</span>
              {(queueState.length > 0 || priorityQueueState.length > 0) && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950/80 text-[10px] font-mono text-red-700 dark:text-red-300">
                  {priorityQueueState.length || queueState.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setRightPanelTab('linkedlist')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'linkedlist'
                  ? 'bg-white dark:bg-[#5C4E49] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>🔗</span>
              <span>Linked List (Adjacency)</span>
              {visitedSequence.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                  {visitedSequence.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Tab View */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
            {rightPanelTab === 'queue' ? (
              <SimpleQueueDiagram
                queue={
                  priorityQueueState.length > 0
                    ? priorityQueueState.map(item => (typeof item === 'object' ? `${item.node || item.val} (d:${item.dist ?? item.priority})` : item))
                    : queueState.length > 0
                    ? queueState
                    : stackState.length > 0
                    ? stackState
                    : []
                }
                activeVal={activeNode}
              />
            ) : (
              <SimpleLinkedListDiagram
                adjacencyList={adjacencyList}
                activeNode={activeNode}
                probingNode={probingNode}
                visitedSequence={visitedSequence}
              />
            )}

            {/* Clean Action & Step Pill with Math and Teacher Decision */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#282828] shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {explanation.title || currentAlgo.name}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-mono font-bold text-gray-600 dark:text-gray-300">
                  Step {animationSteps.length > 0 ? currentStepIdx + 1 : 1}/{Math.max(1, animationSteps.length)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans font-medium">
                {explanation.action || 'Ready to run step-by-step traversal.'}
              </p>
              {explanation.math && (
                <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/40 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-bold">
                  🧮 {explanation.math}
                </div>
              )}
              {explanation.why && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-black/20 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                  💡 {explanation.why}
                </p>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col p-2 sm:p-4 overflow-hidden">
        <GraphCanvasView
          graphData={graphData}
          explanation={explanation}
          currentAlgo={currentAlgo}
          animationSteps={animationSteps}
          currentStepIdx={currentStepIdx}
          activeNode={activeNode}
          probingNode={probingNode}
          visitedSet={visitedSet}
          activeEdge={activeEdge}
          highlightedMstEdges={new Set(kruskalEdgesState)}
          highlightedPathEdges={highlightedPathEdges}
          highlightedPathNodes={highlightedPathNodes}
          distances={distanceMap}
          nodeColors={nodeColors}
          startNode={startNode}
          targetNode={targetNode}
          onNodeClick={(nId) => {
            setStartNode(nId);
            handleReset();
          }}
          onShowConcept={() => setShowIntuitionModal(true)}
          queueState={queueState}
          stackState={stackState}
          priorityQueueState={priorityQueueState}
          visitedSequence={visitedSequence}
          visitedTable={visitedTable}
          inDegreeMap={inDegreeMap}
        />

        <GraphConceptModal
          isOpen={showIntuitionModal}
          onClose={() => setShowIntuitionModal(false)}
          intuitionData={GRAPH_INTUITIONS[currentAlgo.id]}
        />
      </div>
    </ResponsiveVisualizerShell>
  );
}
