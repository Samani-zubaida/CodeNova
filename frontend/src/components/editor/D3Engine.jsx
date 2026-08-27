import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Engine = ({ stepData }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!stepData || !stepData.state) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    let currentY = 80;

    const stateEntries = Object.entries(stepData.state);

    stateEntries.forEach(([key, data]) => {
      if (!data || typeof data !== 'object') return;

      const g = svg.append('g').attr('transform', `translate(0, ${currentY})`);

      // Title for the structure
      g.append('text')
        .attr('x', 20)
        .attr('y', 0)
        .text(key)
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#666');

      const contentGroup = g.append('g').attr('transform', 'translate(20, 20)');

      if (data.type === 'array' || data.type === 'stack' || data.type === 'queue') {
        const boxSize = 50;
        const padding = 10;
        const vals = data.values || [];
        const active = data.active || [];
        const swapping = data.swapping || [];

        const cells = contentGroup.selectAll('g.cell')
          .data(vals)
          .enter()
          .append('g')
          .attr('class', 'cell');

        // Swap animation logic:
        // If swapping is present, the array is in its POST-swap state.
        // We start the visual elements at their PRE-swap positions, then transition them to POST-swap.
        cells.attr('transform', (d, i) => {
          let visualIndex = i;
          if (swapping.length === 2) {
            if (i === swapping[0]) visualIndex = swapping[1];
            else if (i === swapping[1]) visualIndex = swapping[0];
          }
          return `translate(${visualIndex * (boxSize + padding)}, 0)`;
        });

        if (swapping.length === 2) {
          cells.transition()
            .duration(800)
            .ease(d3.easeCubicInOut)
            .attr('transform', (d, i) => `translate(${i * (boxSize + padding)}, 0)`);
        }

        cells.append('rect')
          .attr('width', boxSize)
          .attr('height', boxSize)
          .attr('rx', 8)
          .attr('fill', (d, i) => active.includes(i) ? 'rgba(200, 107, 133, 0.2)' : 'rgba(0,0,0,0.05)')
          .attr('stroke', (d, i) => active.includes(i) ? '#C86B85' : '#ccc')
          .attr('stroke-width', (d, i) => active.includes(i) ? 3 : 1);

        cells.append('text')
          .attr('x', boxSize / 2)
          .attr('y', boxSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#333')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .text(d => typeof d === 'object' ? JSON.stringify(d) : String(d));

        cells.append('text')
          .attr('x', boxSize / 2)
          .attr('y', boxSize + 15)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('fill', '#999')
          .text((_, i) => i);

        // If it's a stack or queue, add labels for Top/Front/Rear
        if (data.type === 'stack' && vals.length > 0) {
           contentGroup.append('text')
             .attr('x', (vals.length - 1) * (boxSize + padding) + boxSize / 2)
             .attr('y', -10)
             .attr('text-anchor', 'middle')
             .attr('font-size', '12px')
             .attr('fill', '#C86B85')
             .text('Top →');
        }

        currentY += boxSize + 60;
      } 
      else if (data.type === 'tree') {
        const rootData = data.root;
        const active = data.active || [];
        
        if (rootData) {
           const rootNode = d3.hierarchy(rootData);
           const treeLayout = d3.tree().size([width - 100, 200]);
           treeLayout(rootNode);

           const treeGroup = contentGroup.append('g').attr('transform', 'translate(0, 20)');

           // Links
           treeGroup.selectAll('line.link')
             .data(rootNode.links())
             .enter()
             .append('line')
             .attr('class', 'link')
             .attr('x1', d => d.source.x)
             .attr('y1', d => d.source.y)
             .attr('x2', d => d.target.x)
             .attr('y2', d => d.target.y)
             .attr('stroke', '#ccc')
             .attr('stroke-width', 2);

           // Nodes
           const nodes = treeGroup.selectAll('g.node')
             .data(rootNode.descendants())
             .enter()
             .append('g')
             .attr('class', 'node')
             .attr('transform', d => `translate(${d.x},${d.y})`);

           nodes.append('circle')
             .attr('r', 20)
             .attr('fill', d => active.includes(d.data.name) ? 'rgba(200, 107, 133, 0.2)' : 'white')
             .attr('stroke', d => active.includes(d.data.name) ? '#C86B85' : '#888')
             .attr('stroke-width', d => active.includes(d.data.name) ? 3 : 2);

           nodes.append('text')
             .attr('text-anchor', 'middle')
             .attr('dominant-baseline', 'central')
             .attr('fill', '#333')
             .attr('font-weight', 'bold')
             .text(d => d.data.name);

           currentY += 280;
        }
      }
      else if (data.type === 'primitive') {
        contentGroup.append('rect')
          .attr('width', 100)
          .attr('height', 40)
          .attr('rx', 6)
          .attr('fill', '#f3f4f6')
          .attr('stroke', '#e5e7eb');
          
        contentGroup.append('text')
          .attr('x', 50)
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('fill', '#333')
          .text(String(data.value).length > 8 ? String(data.value).substring(0,8) + '..' : String(data.value));

        currentY += 70;
      }
      else {
        // Fallback generic renderer
        contentGroup.append('text')
          .attr('x', 0)
          .attr('y', 15)
          .attr('fill', '#666')
          .text(JSON.stringify(data));
        currentY += 40;
      }
    });

  }, [stepData]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-md p-3 rounded-lg shadow-sm border border-black/5 z-10">
         <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Line {stepData?.line || '-'}</span>
         <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{stepData?.action || 'Initializing...'}</p>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default D3Engine;
