import { useCallback, useEffect, useState } from 'react';
import { loadManifest } from '../services/manifestLoader';
import { applyFilter } from '../../utils/applyFilter';
import { applyNodeChanges } from '@xyflow/react';
import { recalculatePositions } from '../../utils/recalculatePositions';
import { findRootNode, findPathToRoot } from '../../utils/findPathToRoot';
import { saveDiagram, loadDiagram } from '../services/fileStorage';

export const useDiagramState = () => {
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

  // Cargar el manifest al iniciar la aplicación
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
  const handleFilterApply = (newFilter, newVisibleTypes) => {
    setFilter(newFilter);
    setVisibleTypes(newVisibleTypes);
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

  const handlePaneClick = () => {
    // Limpia los edges resaltados
    setHighlightedEdges([]);
  };

  return {
    filteredNodes,
    filteredEdges,
    setFilteredNodes,
    setFilteredEdges,
    filter,
    visibleTypes,
    highlightedEdges,
    handleFilterApply,
    fileName,
    setFileName,
    isModified,
    setIsModified,
    getEdgeProps,
    handleRecalculatePositions,
    handleCreateAnnotationNode,
    handlePaneClick,
    handleNodeSelection,
    handleNodesChange,
  };
};
