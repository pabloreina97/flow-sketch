import { filterByType } from './applyFilterType';

export const applyFilter = (filter, visibleTypes, nodes, edges) => {
  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');

  const { nodes: typeFilteredNodes, edges: typeFilteredEdges } = filterByType(
    visibleTypes,
    nodes,
    edges
  );

  const expandNodes = (nodeIds, direction) => {
    const expandedNodeIds = new Set(nodeIds); // Nodos iniciales
    let hasNewNodes;

    do {
      hasNewNodes = false;

      edges.forEach((edge) => {
        if (
          direction === 'parents' &&
          expandedNodeIds.has(edge.target) &&
          !expandedNodeIds.has(edge.source)
        ) {
          expandedNodeIds.add(edge.source);
          hasNewNodes = true;
        } else if (
          direction === 'children' &&
          expandedNodeIds.has(edge.source) &&
          !expandedNodeIds.has(edge.target)
        ) {
          expandedNodeIds.add(edge.target);
          hasNewNodes = true;
        }
      });
    } while (hasNewNodes);

    return expandedNodeIds;
  };

  // Filtrar nodos iniciales según el filtro de texto y tipos visibles
  const initialFilteredNodes = typeFilteredNodes.filter((node) => {
    const cleanFilter = filter.replace(/\+/g, '').toLowerCase();

    const matchesType = visibleTypes.includes(node.data.node.resource_type);
    const matchesName = node.data.label.toLowerCase().includes(cleanFilter);

    return matchesName && matchesType;
  });

  const filteredNodeIds = new Set(initialFilteredNodes.map((node) => node.id));

  // Expandir padres e hijos independientemente
  let parentIds = new Set();
  let childIds = new Set();

  if (matchParents) {
    parentIds = expandNodes([...filteredNodeIds], 'parents');
  }

  if (matchChildren) {
    childIds = expandNodes([...filteredNodeIds], 'children');
  }

  // Tomar la unión de los nodos iniciales, padres y/o hijos
  const resultNodeIds = new Set([
    ...filteredNodeIds,
    ...parentIds,
    ...childIds,
  ]);

  // Filtrar nodos y aristas finales
  const newFilteredNodes = typeFilteredNodes.filter((node) =>
    resultNodeIds.has(node.id)
  );

  const newFilteredEdges = typeFilteredEdges.filter(
    (edge) => resultNodeIds.has(edge.source) && resultNodeIds.has(edge.target)
  );

  return { nodes: newFilteredNodes, edges: newFilteredEdges };
};
