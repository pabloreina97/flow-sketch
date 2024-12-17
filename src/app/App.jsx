import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlowComponent from '../components/ReactFlowComponent';
import { ReactFlow, applyNodeChanges } from '@xyflow/react';
import Toolbar from '../components/Toolbar';
import { loadManifest } from '../utils/loadManifest';
import { applyFilter } from '../utils/applyFilter';
import findPathToRoot from '../utils/findPathToRoot';
import { recalculatePositions } from '../utils/recalculatePositions';
import { saveDiagram, loadDiagram } from '../services/fileStorage';
import ContextMenu from '../components/ContextMenu';

export default function App() {
  // Estados para nodos y aristas
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [filteredEdges, setFilteredEdges] = useState([]);

  const [filter, setFilter] = useState('+stg_invoices+');
  const [visibleTypes, setVisibleTypes] = useState(['model', 'seed', 'source']);

  const [fileName, setFileName] = useState('Sin título');
  const [isModified, setIsModified] = useState(false);

  const [highlightedEdges, setHighlightedEdges] = useState([]);

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

  // Manejar cambios en los filtros (filter y visibleTypes)
  const executeFilter = () => {
    const { nodes, edges } = applyFilter(
      filter,
      visibleTypes,
      originalNodes,
      originalEdges
    );
    setFilteredNodes(nodes);
    setFilteredEdges(edges);
  };

  // Aplicar los filtros manualmente (botón "Aplicar Filtro")
  const handleFilterApply = () => {
    executeFilter();
    const nodeFiltered = filteredNodes.find((node) =>
      node.data.label.includes(filter)
    );

    if (nodeFiltered) {
      handleNodeSelection(nodeFiltered.id);
    } else {
      setHighlightedEdges([]);
    }
  };

  // Aplicar los filtros al cambiar visibleTypes
  useEffect(() => {
    executeFilter();
  }, [visibleTypes, originalNodes, originalEdges]);

  // Manejar cambios en los nodos filtrados
  const handleNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, filteredNodes); // Nodos actualizados
      setFilteredNodes(updatedNodes);
      setIsModified(true);

      const selectedNodeChange = changes.find(
        (change) => change.selected === true
      );

      if (selectedNodeChange) {
        handleNodeSelection(selectedNodeChange.id);

      }
    },
    [filteredNodes, setFilteredNodes]
  );

  const findRootNode = (filter, nodes) => {
    const cleanFilter = filter.replace(/\+/g, '').toLowerCase();
    return nodes.find((node) =>
      node.data.label.toLowerCase().includes(cleanFilter)
    );
  };

  const handleNodeSelection = (selectedNodeId) => {
    if (!selectedNodeId) return;

    // Encontrar el nodo raíz usando el filtro
    const rootNode = findRootNode(filter, filteredNodes);

    if (rootNode) {
      const pathToRoot = findPathToRoot(
        selectedNodeId,
        filteredEdges,
        rootNode.id
      );
      setHighlightedEdges(pathToRoot); // Actualizar edges resaltados
    } else {
      console.warn('No se encontró el nodo raíz filtrado.');
      setHighlightedEdges([]);
    }
  };

  const getEdgeProps = (edge) => {
    const isHighlighted = highlightedEdges.some(
      (highlightedEdge) => highlightedEdge.id === edge.id
    );

    return {
      animated: isHighlighted, // Activa animación solo si está resaltado
      style: {
        stroke: isHighlighted ? 'orange' : '#b1b1b7',
        strokeWidth: isHighlighted ? 3 : 1,
      },
    };
  };
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
      data: {
        label: 'Escribe aquí',
        color: '#000000',
        onChange: (newText) => {
          setFilteredNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, label: newText } }
                : node
            )
          );
        },
      },
    };

    setFilteredNodes((prev) => [...prev, newNode]);
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
        edges={filteredEdges.map((edge) => ({
          ...edge,
          ...getEdgeProps(edge),
        }))}
        onNodesChange={handleNodesChange}
        onDeleteNode={deleteNode}
      />
    </div>
  );
}
