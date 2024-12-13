export const applyFilter = (filter, types, nodes, edges) => {
  // Normalizar el filtro y determinar las expansiones
  const nodeName = filter.toLowerCase();
  const matchParents = filter.startsWith('+');
  const matchChildren = filter.endsWith('+');

  // Conjunto de IDs de nodos filtrados
  const filteredNodeIds = new Set();

  // Expande nodos en la dirección especificada
  const expandNodes = (nodeIds, direction) => {
    let hasNewNodes = false; // Para controlar si se añaden nuevos nodos

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

    // Si se añadieron nuevos nodos, expande otra vez recursivamente
    if (hasNewNodes) {
      const newNodes = Array.from(filteredNodeIds).filter(
        (id) => !nodeIds.includes(id)
      );
      expandNodes(newNodes, direction);
    }
  };

  // Identifica los nodos iniciales según el filtro
  const initialFilteredNodes = nodes.filter((node) => {
    const cleanFilter = filter.replace(/\+/g, '').toLowerCase();
    const matchesName = node.data.label.toLowerCase().includes(cleanFilter);
    return matchesName;
  });

  // Añadir nodos iniciales al conjunto filtrado
  initialFilteredNodes.forEach((node) => {
    filteredNodeIds.add(node.id);

    if (matchParents) expandNodes([node.id], 'parents');
    if (matchChildren) expandNodes([node.id], 'children');
  });

  // Expande en ambas direcciones si no hay "+" en el filtro
  if (!matchParents && !matchChildren) {
    const expandAll = Array.from(filteredNodeIds); // Copia los IDs para evitar modificaciones durante la iteración
    expandNodes(expandAll, 'parents');
    expandNodes(expandAll, 'children');
  }

  // Genera los nodos y aristas filtrados
  const newFilteredEdges = edges.filter(
    (edge) =>
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  const newFilteredNodes = nodes.filter((node) => filteredNodeIds.has(node.id));

  return { nodes: newFilteredNodes, edges: newFilteredEdges };
};
