export const applyFilter = (
  filter,
  types,
  nodes,
  edges,
  setFilteredNodes,
  setFilteredEdges
) => {
  const getNodeType = (id) => {
    if (id.startsWith('model')) return 'model';
    if (id.startsWith('seed')) return 'seed';
    if (id.startsWith('source')) return 'source';
    if (id.startsWith('test')) return 'test';
    return 'unknown';
  };

  const filteredNodeIds = new Set();
  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');

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

  if (!matchParents && !matchChildren) {
    filteredNodeIds.forEach((nodeId) => {
      expandNodes(nodeId, 'parents');
      expandNodes(nodeId, 'children');
    });
  }

  const newFilteredNodes = nodes.filter((node) => filteredNodeIds.has(node.id));
  const newFilteredEdges = edges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  setFilteredNodes(newFilteredNodes);
  setFilteredEdges(newFilteredEdges);
};
