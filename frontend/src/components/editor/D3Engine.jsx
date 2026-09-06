import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Engine = ({ stepData, previousStepData }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!stepData || !stepData.state) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    let currentY = 80;
    const state = stepData.state;

    // Define colors
    const colors = {
      default: 'rgba(0, 0, 0, 0.05)',
      defaultStroke: '#ddd',
      active: '#8B5CF6',     // Purple for active/current
      swapping: '#F59E0B',   // Yellow for swapping
      text: '#333',
      label: '#888',
      accentRed: '#EF4444',
      accentBlue: '#3B82F6',
      accentGreen: '#10B981'
    };

    // Iterate over all state keys
    Object.keys(state).forEach((key) => {
      // Ignore 'result' (handled by Terminal)
      if (key === 'result') return;

      const data = state[key];
      if (!data || typeof data !== 'object') return;

      const g = svg.append('g').attr('transform', `translate(40, ${currentY})`);
      const contentGroup = g.append('g').attr('transform', 'translate(0, 25)');

      // Title/Label for the data structure
      g.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .text(key.toUpperCase())
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', colors.label)
        .attr('letter-spacing', '1.5px');

      const isSwapping = (idx) => Array.isArray(data.swapping) && data.swapping.includes(idx);
      const isActive = (idx) => Array.isArray(data.active) && data.active.includes(idx);
      const isNodeActive = (name) => Array.isArray(data.active) && data.active.includes(String(name));

      // 1. Arrays, Stacks, Queues
      if (data.type === 'array' || data.type === 'stack' || data.type === 'queue') {
        const values = Array.isArray(data.values) ? data.values : [];
        const boxSize = 55;
        const padding = 12;
        const isStack = data.type === 'stack';
        const isQueue = data.type === 'queue';

        const cells = contentGroup.selectAll('g.cell')
          .data(values)
          .enter()
          .append('g')
          .attr('class', 'cell');

        // Positioning logic
        cells.attr('transform', (d, idx) => {
          let visualIndex = idx;
          if (Array.isArray(data.swapping) && data.swapping.length === 2) {
            const [i, j] = data.swapping;
            if (idx === i) visualIndex = j;
            else if (idx === j) visualIndex = i;
          }

          if (isStack) {
            // Build upwards (bottom to top)
            const totalHeight = values.length * (40 + padding);
            return `translate(0, ${totalHeight - (visualIndex + 1) * (40 + padding)})`;
          }
          return `translate(${visualIndex * (boxSize + padding)}, 0)`;
        });

        // Animation for swapping
        if (Array.isArray(data.swapping)) {
          cells.transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr('transform', (d, idx) => {
              if (isStack) {
                const totalHeight = values.length * (40 + padding);
                return `translate(0, ${totalHeight - (idx + 1) * (40 + padding)})`;
              }
              return `translate(${idx * (boxSize + padding)}, 0)`;
            });
        }

        // Cell Box
        cells.append('rect')
          .attr('width', isStack ? 120 : boxSize)
          .attr('height', isStack ? 40 : boxSize)
          .attr('rx', 8)
          .attr('fill', (d, idx) => {
            if (isSwapping(idx)) return `${colors.swapping}30`;
            if (isActive(idx)) return `${colors.active}30`;
            return colors.default;
          })
          .attr('stroke', (d, idx) => {
            if (isSwapping(idx)) return colors.swapping;
            if (isActive(idx)) return colors.active;
            return colors.defaultStroke;
          })
          .attr('stroke-width', (d, idx) => (isActive(idx) || isSwapping(idx) ? 2 : 1))
          .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)');

        // Cell Value
        cells.append('text')
          .attr('x', (isStack ? 120 : boxSize) / 2)
          .attr('y', (isStack ? 40 : boxSize) / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', colors.text)
          .attr('font-size', '16px')
          .attr('font-weight', '600')
          .text(d => String(d));

        // Indices
        if (!isStack) {
          cells.append('text')
            .attr('x', boxSize / 2)
            .attr('y', boxSize + 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#aaa')
            .text((_, i) => i);
        }

        currentY += isStack ? (values.length * (40 + padding)) + 50 : boxSize + 70;
      }


      // 3. Graph
      else if (data.type === 'graph' && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        const nodesData = data.nodes.map(id => ({ id: String(id) }));
        const edgesData = data.edges.map(e => ({ source: String(e.from), target: String(e.to) }));

        const graphWidth = width - 80;
        const graphHeight = 250;
        const graphGroup = contentGroup.append('g').attr('transform', `translate(${graphWidth / 2}, ${graphHeight / 2})`);

        const simulation = d3.forceSimulation(nodesData)
          .force('link', d3.forceLink(edgesData).id(d => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-300))
          .force('center', d3.forceCenter(0, 0))
          .stop();

        for (let i = 0; i < 300; i++) simulation.tick(); // Run simulation statically

        // Edges
        graphGroup.selectAll('line.link')
          .data(edgesData)
          .enter()
          .append('line')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 2)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        // Nodes
        const node = graphGroup.selectAll('g.node')
          .data(nodesData)
          .enter()
          .append('g')
          .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
          .attr('r', 22)
          .attr('fill', d => isNodeActive(d.id) ? `${colors.active}40` : '#fff')
          .attr('stroke', d => isNodeActive(d.id) ? colors.active : '#888')
          .attr('stroke-width', d => isNodeActive(d.id) ? 3 : 2)
          .style('filter', 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))');

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-weight', 'bold')
          .attr('fill', '#333')
          .text(d => d.id);

        currentY += graphHeight + 40;
      }

      // 4. Tree
      else if (data.type === 'tree' && data.root) {
        const treeWidth = width - 80;
        const treeHeight = 250;
        const treeGroup = contentGroup.append('g').attr('transform', 'translate(0, 30)');

        const root = d3.hierarchy(data.root);
        const treeLayout = d3.tree().size([treeWidth, treeHeight - 60]);
        treeLayout(root);

        // Links
        treeGroup.selectAll('path.link')
          .data(root.links())
          .enter()
          .append('path')
          .attr('fill', 'none')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 2)
          .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
          );

        // Nodes
        const node = treeGroup.selectAll('g.node')
          .data(root.descendants())
          .enter()
          .append('g')
          .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
          .attr('r', 20)
          .attr('fill', d => isNodeActive(d.data.name) ? `${colors.active}40` : '#fff')
          .attr('stroke', d => isNodeActive(d.data.name) ? colors.active : '#888')
          .attr('stroke-width', d => isNodeActive(d.data.name) ? 3 : 2)
          .style('filter', 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))');

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-weight', 'bold')
          .attr('fill', '#333')
          .text(d => d.data.name);

        currentY += treeHeight + 40;
      }

      // Fallback for missing/incorrect type
      else {
        contentGroup.append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('font-family', 'monospace')
          .attr('font-size', '14px')
          .attr('fill', '#333')
          .text(JSON.stringify(data));
        currentY += 40;
      }
    });

  }, [stepData, previousStepData]);

  const primitives = [];
  let resultOutput = null;

  if (stepData && stepData.state) {
    Object.keys(stepData.state).forEach(key => {
      if (key === 'result') {
        resultOutput = stepData.state[key];
      } else if (stepData.state[key] && stepData.state[key].type === 'primitive') {
        primitives.push({ key, value: stepData.state[key].value });
      }
    });
  }

  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden">
      <div className="sticky top-4 left-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-md p-3 rounded-lg shadow-sm border border-black/5 z-10 flex justify-between items-center mx-4 mt-4 min-h-[50px]">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {stepData?.action || 'Initializing...'}
          </p>
          {primitives.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-600 dark:text-gray-400 mt-1">
              {primitives.map(p => (
                <span key={p.key} className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md border border-black/5 dark:border-white/5">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{p.key}</span> = {p.value}
                </span>
              ))}
            </div>
          )}
        </div>
        {resultOutput && (
          <div className="bg-gray-900 text-green-400 font-mono text-[11px] px-3 py-2 rounded-md shadow-inner border border-black/20 flex items-center max-w-sm break-all ml-4">
            <span className="text-gray-500 mr-2 select-none">{'>'}</span>
            {String(resultOutput)}
          </div>
        )}
      </div>
      <svg ref={svgRef} className="w-full h-full min-h-[600px]" />
    </div>
  );
};

export default D3Engine;
