import React, { useState } from 'react';
import { useManifestData } from './hooks/useManifestData';
import ReactFlowComponent from './components/ReactFlowComponent';
import Toolbar from './components/Toolbar';
import computeLevels from './utils/computeLevels';
import computePositions from './utils/computePositions';

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useManifestData();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* <Toolbar
        filter={filter}
        onFilterChange={dummy_function_1}
        onFilterApply={dummy_function_1}
      /> */}
      <ReactFlowComponent 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
}
