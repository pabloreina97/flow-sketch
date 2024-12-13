import React, { useState } from 'react';
import { useManifestData } from './hooks/useManifestData';
import ReactFlowComponent from './components/ReactFlowComponent';
import Toolbar from './components/Toolbar';

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    applyFilter,
    visibleTypes,
    setVisibleTypes,
    recalculatePositions,
  } = useManifestData();
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleFilterApply = () => {
    console.log('Aplicando filtro:', filter);
    applyFilter(filter, visibleTypes);
  };

  const handleTypeChange = (type) => {
    const newTypes = visibleTypes.includes(type)
      ? visibleTypes.filter((t) => t !== type)
      : [...visibleTypes, type];
    setVisibleTypes(newTypes);
    applyFilter(filter, newTypes);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        filter={filter}
        onFilterChange={handleFilterChange}
        onFilterApply={handleFilterApply}
        visibleTypes={visibleTypes}
        onTypeChange={handleTypeChange}
        onRecalculatePositions={recalculatePositions}
      />
      <ReactFlowComponent
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
}
