import { useState, useEffect, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { loadManifest } from './loadManifest';
import { applyFilter } from './filterData';
import { recalculatePositions } from './recalculatePositions';

export const useManifestData = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [filteredEdges, setFilteredEdges] = useState([]);
  const [visibleTypes, setVisibleTypes] = useState(['model', 'seed', 'source']);

  const onNodesChange = useCallback(
    (changes) => setFilteredNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setFilteredEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const { nodes: initialNodes, edges: initialEdges } = await loadManifest();
      setNodes(initialNodes);
      setEdges(initialEdges);
      setFilteredNodes(initialNodes);
      setFilteredEdges(initialEdges);
    };
    fetchData();
  }, []);

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    onNodesChange,
    onEdgesChange,
    applyFilter: (filter) =>
      applyFilter(
        filter,
        visibleTypes,
        nodes,
        edges,
        setFilteredNodes,
        setFilteredEdges
      ),
    recalculatePositions: () =>
      recalculatePositions(filteredNodes, edges, setFilteredNodes),
    visibleTypes,
    setVisibleTypes,
  };
};
