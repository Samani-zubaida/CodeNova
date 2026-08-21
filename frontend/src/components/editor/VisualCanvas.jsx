import React from 'react';

const VisualCanvas = ({ data, isVisualizing }) => {
  // Zubaida will build the D3.js internals here.
  // We just provide the shell and display the raw JSON for now.

  return (
    <div className="h-full w-full bg-card rounded-md border border-border shadow-sm p-4 overflow-auto flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-primary">Data Structure Visualizer</h3>
      {isVisualizing ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
          Generating AI steps...
        </div>
      ) : data ? (
        <div className="flex-1 overflow-auto">
          <p className="text-xs text-muted-foreground mb-2">Raw AI Output (To be mapped to D3.js):</p>
          <pre className="bg-muted p-4 rounded text-xs overflow-x-auto text-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm text-center px-8">
          Click "Visualize" to generate AI execution steps for this code.
        </div>
      )}
    </div>
  );
};

export default VisualCanvas;
