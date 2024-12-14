const computePositions = (levels, nodesToInclude) => {
  const levelGroups = {};
  const positions = {};
  const nodeWidth = 200; // Ancho del nodo
  const nodeHeight = 100; // Alto del nodo
  const levelSpacing = 300; // Separación horizontal entre niveles

  // Agrupar nodos por niveles
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(nodeId);
  });

  // Calcular posiciones para cada nivel
  Object.keys(levelGroups).forEach((level) => {
    const nodesInLevel = levelGroups[level];
    const totalHeight = nodesInLevel.length * nodeHeight;
    const startX = level * levelSpacing;
    const startY = (window.innerHeight - totalHeight) / 2;

    nodesInLevel.forEach((nodeId, index) => {
      const x = startX;
      const y = startY + index * nodeHeight;

      positions[nodeId] = { x, y };
    });
  });

  return positions;
};

export default computePositions;
