import React, { useState, useEffect, useCallback } from 'react';
import ReactFlowComponent from '../components/ReactFlowComponent';
import { ReactFlow, applyNodeChanges } from '@xyflow/react';
import Toolbar from '../components/Toolbar';
import { loadManifest } from '../utils/loadManifest';
import { applyFilter } from '../utils/applyFilter';
import { recalculatePositions } from '../utils/recalculatePositions';
import { saveDiagram, loadDiagram } from '../services/fileStorage';

export default function App() {
  // Estados para nodos y aristas
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [filteredEdges, setFilteredEdges] = useState([]);

  const [filter, setFilter] = useState('');
  const [visibleTypes, setVisibleTypes] = useState(['model', 'seed', 'source']);

  const [fileName, setFileName] = useState('Sin título');
  const [isModified, setIsModified] = useState(false);

  // Cargar el manifiesto al iniciar la aplicación
  useEffect(() => {
    const fetchManifest = async () => {
      const { nodes, edges } = await loadManifest();

      // 1. Aplicar el filtro inicial (por visibleTypes y filter)
      const { nodes: filteredByTypeNodes, edges: filteredByTypeEdges } =
        applyFilter(filter, visibleTypes, nodes, edges);

      // 2. Recalcular posiciones con los nodos ya filtrados
      const recalculatedNodes = recalculatePositions(
        filteredByTypeNodes,
        filteredByTypeEdges
      );

      // 3. Actualizar los estados con los datos originales y procesados
      setOriginalNodes(nodes);
      setOriginalEdges(edges);
      setFilteredNodes(recalculatedNodes);
      setFilteredEdges(filteredByTypeEdges);
    };

    fetchManifest();
  }, []); // Solo se ejecuta al montar el componente

  // Aplicar los filtros manualmente (botón "Aplicar Filtro")
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

  // Manejar cambios en los filtros (filter y visibleTypes)
  useEffect(() => {
    const { nodes, edges } = applyFilter(
      filter,
      visibleTypes,
      originalNodes,
      originalEdges
    );
    setFilteredNodes(nodes);
    setFilteredEdges(edges);
  }, [filter, visibleTypes, originalNodes, originalEdges]);

  // Manejar cambios en los nodos filtrados
  const handleNodesChange = useCallback(
    (changes) => {
      setFilteredNodes((nds) => applyNodeChanges(changes, nds));
      setIsModified(true);
    },
    [setFilteredNodes]
  );

  // Guardar un diagrama actual
  const handleSaveDiagram = async () => {
    try {
      const savedFileName = await saveDiagram(filteredNodes, filteredEdges);
      setFileName(savedFileName);
      setIsModified(false);
    } catch (error) {
      console.error('Error al guardar el diagrama:', error);
    }
  };

  // Cargar un diagrama desde un archivo JSON
  const handleLoadDiagram = async () => {
    try {
      const { nodes, edges, name } = await loadDiagram();
      setFilteredNodes(nodes);
      setFilteredEdges(edges);
      setIsModified(false);
      setFileName(name);
    } catch (error) {
      console.error('Error al cargar el diagrama:', error);
    }
  };

  // Función para eliminar un nodo por su ID
  const deleteNode = (id) => {
    setOriginalNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
    setFilteredNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };

  // Crear un nuevo nodo de anotación
  const handleCreateAnnotationNode = () => {
    const newNode = {
      id: `annotation-${Date.now()}`,
      type: 'annotationNode',
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      data: { label: 'Nueva anotación' },
    };

    setFilteredNodes((prev) => [...prev, newNode]);
    setOriginalNodes((prev) => [...prev, newNode]);
  };

  // Recalcular posiciones manualmente
  const handleRecalculatePositions = () => {
    const recalculatedNodes = recalculatePositions(
      filteredNodes,
      filteredEdges
    );
    setFilteredNodes(recalculatedNodes);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        fileName={fileName}
        isModified={isModified}
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
        onFilterApply={handleFilterApply}
        onTypeChange={(type) => {
          const newTypes = visibleTypes.includes(type)
            ? visibleTypes.filter((t) => t !== type)
            : [...visibleTypes, type];
          setVisibleTypes(newTypes);
        }}
        onRecalculatePositions={handleRecalculatePositions}
        visibleTypes={visibleTypes}
        onCreateAnnotationNode={handleCreateAnnotationNode}
        onSaveDiagram={handleSaveDiagram}
        onLoadDiagram={handleLoadDiagram}
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
