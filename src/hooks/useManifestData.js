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
    if (!filter) {
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

    const matchParents = filter.startsWith('+');
    const matchChildren = filter.endsWith('+');
    const nodeName = filter.replace(/\+/g, '').toLowerCase();

    const filteredNodes = nodes.filter(
      (node) =>
        node.data.label.toLowerCase().includes(nodeName) &&
        types.includes(getNodeType(node.id))
    );
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    if (matchParents || matchChildren) {
      const expandNodes = (nodeId, direction) => {
        edges.forEach((edge) => {
          if (
            direction === 'parents' &&
            edge.target === nodeId &&
            types.includes(getNodeType(edge.source))
          ) {
            filteredNodeIds.add(edge.source);
            expandNodes(edge.source, direction);
          } else if (
            direction === 'children' &&
            edge.source === nodeId &&
            types.includes(getNodeType(edge.target))
          ) {
            filteredNodeIds.add(edge.target);
            expandNodes(edge.target, direction);
          }
        });
      };

      filteredNodes.forEach((node) => {
        if (matchParents) expandNodes(node.id, 'parents');
        if (matchChildren) expandNodes(node.id, 'children');
      });
    }

    const newFilteredEdges = edges.filter(
      (edge) =>
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
    const newFilteredNodes = nodes.filter((node) =>
      filteredNodeIds.has(node.id)
    );

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
