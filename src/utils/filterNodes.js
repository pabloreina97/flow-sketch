export const applyFilter = (filter, types, nodes, edges) => {
  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');

  // IDs de los nodos que pasarán el filtro
  const filteredNodeIds = new Set();

  const expandNodes = (nodeIds, direction) => {
    let hasNewNodes = false;

    nodeIds.forEach((nodeId) => {
      edges.forEach((edge) => {
        if (
          direction === 'parents' &&
          edge.target === nodeId &&
          !filteredNodeIds.has(edge.source)
        ) {
          filteredNodeIds.add(edge.source);
          hasNewNodes = true;
        } else if (
          direction === 'children' &&
          edge.source === nodeId &&
          !filteredNodeIds.has(edge.target)
        ) {
          filteredNodeIds.add(edge.target);
          hasNewNodes = true;
        }
      });
    });

    if (hasNewNodes) {
      const newNodes = Array.from(filteredNodeIds).filter(
        (id) => !nodeIds.includes(id)
      );
      expandNodes(newNodes, direction);
    }
  };

  const initialFilteredNodes = nodes.filter((node) => {
    const cleanFilter = filter.replace(/\+/g, '').toLowerCase();
    const matchesName = node.data.label.toLowerCase().includes(cleanFilter);
    const matchesType = types.includes(node.data.node.resource_type);
    return matchesName && matchesType;
  });

  initialFilteredNodes.forEach((node) => {
    filteredNodeIds.add(node.id);
    if (matchParents) expandNodes([node.id], 'parents');
    if (matchChildren) expandNodes([node.id], 'children');
  });

  if (!matchParents && !matchChildren) {
    const expandAll = Array.from(filteredNodeIds);
    expandNodes(expandAll, 'parents');
    expandNodes(expandAll, 'children');
  }

  // Filtrar los nodos y mantener sus posiciones originales
  const newFilteredNodes = nodes
    .filter((node) => filteredNodeIds.has(node.id))
    .map((node) => ({
      ...node, // Mantener toda la información del nodo intacta
    }));

  // Filtrar las aristas basadas en los nodos visibles
  const newFilteredEdges = edges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  return { nodes: newFilteredNodes, edges: newFilteredEdges };
};
