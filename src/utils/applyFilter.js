import { filterByType } from "./applyFilterType";

export const applyFilter = (filter, visibleTypes, nodes, edges) => {
  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');

  const { nodes: typeFilteredNodes, edges: typeFilteredEdges } = filterByType(
    visibleTypes,
    nodes,
    edges
  );


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

  const initialFilteredNodes = typeFilteredNodes.filter((node) => {
    const cleanFilter = filter.replace(/\+/g, '').toLowerCase();

    // Condición adicional: verificar si el tipo está en visibleTypes
    const matchesType = visibleTypes.includes(node.data.node.resource_type);
    const matchesName = node.data.label.toLowerCase().includes(cleanFilter);

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

  const newFilteredNodes = typeFilteredNodes.filter((node) =>
    filteredNodeIds.has(node.id)
  );
  const newFilteredEdges = typeFilteredEdges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  return { nodes: newFilteredNodes, edges: newFilteredEdges };
};
