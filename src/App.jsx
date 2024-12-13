import React, { useState, useEffect, useCallback } from 'react';
import ReactFlowComponent from './components/ReactFlowComponent';
import { ReactFlow, applyNodeChanges } from '@xyflow/react';
import Toolbar from './components/Toolbar';
import { loadManifest } from './utils/loadManifest';
import { applyFilter } from './utils/filterNodes';

export default function App() {
  // Estados para nodos y aristas
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [filteredEdges, setFilteredEdges] = useState([]);

  const [filter, setFilter] = useState('');
  const [visibleTypes, setVisibleTypes] = useState(['model', 'seed', 'source']);

  // Cargar el manifiesto al iniciar la aplicación
  useEffect(() => {
    const fetchManifest = async () => {
      const { nodes, edges } = await loadManifest();
      setOriginalNodes(nodes);
      setOriginalEdges(edges);
      setFilteredNodes(nodes);
      setFilteredEdges(edges);
    };
    fetchManifest();
  }, []);

  // Aplicar el filtro
  const handleFilterApply = () => {
    const { nodes, edges } = applyFilter(
      filter,
      visibleTypes,
      originalNodes,
      originalEdges
    );
    setFilteredNodes(nodes);
    setFilteredEdges(edges);
  };

  const handleTypeChange = (type) => {
    const newTypes = visibleTypes.includes(type)
      ? visibleTypes.filter((t) => t !== type)
      : [...visibleTypes, type];
    setVisibleTypes(newTypes);
    handleFilterApply();
  }

  // Manejar cambios en los nodos filtrados
  const handleNodesChange = useCallback(
    (changes) => {
      setFilteredNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setFilteredNodes]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
        onFilterApply={handleFilterApply}
        visibleTypes={visibleTypes}
        onTypeChange={handleTypeChange}
      />
      <ReactFlowComponent
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={handleNodesChange}
      />
    </div>
  );
}
