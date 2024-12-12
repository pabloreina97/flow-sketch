import { useEffect, useState, useCallback } from 'react';
import computeLevels from '../utils/computeLevels';
import computePositions from '../utils/computePositions';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export const useManifestData = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [filteredEdges, setFilteredEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setFilteredNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setFilteredEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const [visibleTypes, setVisibleTypes] = useState(['model', 'seed', 'source']);
  const customOnNodesChange = (changes) => {
    console.log('Cambios detectados por ReactFlow:', changes); // Depura los cambios en nodos
    onNodesChange(changes); // Aplica los cambios originales de ReactFlow
  };

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch('/manifest_d.json');
        const manifest = await response.json();

        const edgeSet = new Set();

        const newEdges = Object.entries(manifest.parent_map || {}).flatMap(
          ([nodeId, parents]) => {
            return parents
              .map((parentId) => {
                const edgeId = `e-${parentId}-${nodeId}`;
                if (!edgeSet.has(edgeId)) {
                  edgeSet.add(edgeId);
                  return {
                    id: edgeId,
                    source: parentId,
                    target: nodeId,
                  };
                }
                return null;
              })
              .filter((edge) => edge !== null);
          }
        );

        const nodesToInclude = new Set([
          ...Object.keys(manifest.parent_map || {}),
          ...Object.values(manifest.parent_map || {}).flat(),
        ]);

        // Calcular niveles y posiciones
        const levels = computeLevels(manifest, nodesToInclude);
        const positions = computePositions(levels, manifest, nodesToInclude);

        const getNodeBackgroundColor = (id) => {
          if (id.startsWith('model')) return '#F6D6D6';
          if (id.startsWith('source')) return '#F6F7C4';
          if (id.startsWith('test')) return '#7BD3EA';
          if (id.startsWith('seed')) return '#A1EEBD';
          return '#F8EDED';
        };

        const newNodes = Object.entries(manifest.nodes)
          .filter(([id]) => nodesToInclude.has(id))
          .map(([id, node]) => ({
            id,
            position: positions[id],
            type: 'tooltipNode',
            data: {
              label: node.name,
              color: getNodeBackgroundColor(id),
              info: node,
            },
            sourcePosition: 'right',
            targetPosition: 'left',
          }));

        setNodes(newNodes);
        setEdges(newEdges);
        setFilteredNodes(newNodes);
        setFilteredEdges(newEdges);
      } catch (error) {
        console.error('Error loading manifest:', error);
      }
    };

    loadManifest();
  }, []);

const applyFilter = (filter, types) => {
  const getNodeType = (id) => {
    if (id.startsWith('model')) return 'model';
    if (id.startsWith('seed')) return 'seed';
    if (id.startsWith('source')) return 'source';
    if (id.startsWith('test')) return 'test';
    return 'unknown';
  };

  if (!filter) {
    // Sin filtro: mostrar solo los tipos visibles
    setFilteredNodes(
      nodes.filter((node) => types.includes(getNodeType(node.id)))
    );
    setFilteredEdges(
      edges.filter(
        (edge) =>
          types.includes(getNodeType(edge.source)) &&
          types.includes(getNodeType(edge.target))
      )
    );
    return;
  }

  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');
  const filteredNodeIds = new Set();

  // Expande nodos hacia arriba (padres) y abajo (hijos)
  const expandNodes = (nodeId, direction) => {
    edges.forEach((edge) => {
      if (
        direction === 'parents' &&
        edge.target === nodeId &&
        types.includes(getNodeType(edge.source))
      ) {
        if (!filteredNodeIds.has(edge.source)) {
          filteredNodeIds.add(edge.source);
          expandNodes(edge.source, direction);
        }
      } else if (
        direction === 'children' &&
        edge.source === nodeId &&
        types.includes(getNodeType(edge.target))
      ) {
        if (!filteredNodeIds.has(edge.target)) {
          filteredNodeIds.add(edge.target);
          expandNodes(edge.target, direction);
        }
      }
    });
  };

  // Filtra los nodos iniciales según el filtro
  const initialFilteredNodes = nodes.filter(
    (node) =>
      node.data.label.toLowerCase().includes(nodeName) &&
      types.includes(getNodeType(node.id))
  );

  initialFilteredNodes.forEach((node) => {
    filteredNodeIds.add(node.id);

    if (matchParents) expandNodes(node.id, 'parents');
    if (matchChildren) expandNodes(node.id, 'children');
  });

  // Si no se especifica "+" en el filtro, expande en ambas direcciones
  if (!matchParents && !matchChildren) {
    filteredNodeIds.forEach((nodeId) => {
      expandNodes(nodeId, 'parents');
      expandNodes(nodeId, 'children');
    });
  }

  // Genera los nuevos nodos y aristas filtrados
  const newFilteredEdges = edges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );
  const newFilteredNodes = nodes.filter((node) => filteredNodeIds.has(node.id));

  setFilteredNodes(newFilteredNodes);
  setFilteredEdges(newFilteredEdges);
};

  const recalculatePositions = () => {
    const nodesToInclude = new Set(filteredNodes.map((node) => node.id));
    const levels = computeLevels({ parent_map: edges }, nodesToInclude);
    const positions = computePositions(
      levels,
      { nodes: filteredNodes },
      nodesToInclude
    ); // Pasar nodesToInclude
    const recalculatedNodes = filteredNodes.map((node) => ({
      ...node,
      position: positions[node.id],
    }));
    setFilteredNodes(recalculatedNodes);
  };

  const getNodeType = (id) => {
    if (id.startsWith('model')) return 'model';
    if (id.startsWith('seed')) return 'seed';
    if (id.startsWith('source')) return 'source';
    if (id.startsWith('test')) return 'test';
    return 'unknown';
  };

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    onNodesChange: customOnNodesChange,
    onEdgesChange,
    applyFilter,
    recalculatePositions,
    visibleTypes,
    setVisibleTypes,
  };
};
