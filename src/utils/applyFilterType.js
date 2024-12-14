export const filterByType = (types, nodes, edges) => {
  // Filtrar nodos según el tipo
  const filteredNodes = nodes.filter((node) =>
    types.includes(node.data.node.resource_type)
  );

  // Crear un conjunto con los IDs de los nodos filtrados
  const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

  // Filtrar aristas donde tanto el origen como el destino están en los nodos filtrados
  const filteredEdges = edges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
};
