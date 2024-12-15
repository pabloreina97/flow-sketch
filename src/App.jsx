import React, { useState, useEffect, useCallback } from 'react';
import ReactFlowComponent from './components/ReactFlowComponent';
import { ReactFlow, applyNodeChanges } from '@xyflow/react';
import Toolbar from './components/Toolbar';
import { loadManifest } from './utils/loadManifest';
import { applyFilter } from './utils/applyFilter';
import { recalculatePositions } from './utils/recalculatePositions';

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

  // Aplicar los filtros
  const handleTypeChange = (type) => {
    const newTypes = visibleTypes.includes(type)
      ? visibleTypes.filter((t) => t !== type)
      : [...visibleTypes, type];
    setVisibleTypes(newTypes);
  };

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

  // Manejar cambios en los nodos filtrados
  const handleNodesChange = useCallback(
    (changes) => {
      // Actualizar las posiciones en filteredNodes
      setFilteredNodes((nds) => applyNodeChanges(changes, nds));

      // Actualizar las posiciones en originalNodes
      setOriginalNodes(
        (onds) => applyNodeChanges(changes, onds) // Actualiza las posiciones en los nodos originales
      );
    },
    [setFilteredNodes, setOriginalNodes]
  );

  // Función para eliminar un nodo por su ID
  const deleteNode = (id) => {
    setOriginalNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
    setFilteredNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };

  const handleCreateAnnotationNode = () => {
    const newNode = {
      id: `annotation-${Date.now()}`,
      type: 'annotationNode',
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, // Posición inicial
      data: { label: 'Nueva anotación' },
    };

    setFilteredNodes((prev) => [...prev, newNode]);
    setOriginalNodes((prev) => [...prev, newNode]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
        onFilterApply={handleFilterApply}
        onTypeChange={handleTypeChange}
        onRecalculatePositions={() =>
          recalculatePositions(filteredNodes, filteredEdges, setFilteredNodes)
        }
        visibleTypes={visibleTypes}
        onCreateAnnotationNode={handleCreateAnnotationNode}
      />
      <ReactFlowComponent
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={handleNodesChange}
        onDeleteNode={deleteNode}
      />
    </div>
  );
}
