const computePositions = (levels, manifest, nodesToInclude) => {
  const levelGroups = {};
  const positions = {};
  const nodeWidth = 200; // Ancho fijo para nodos
  const nodeHeight = 100; // Alto fijo para nodos
  const levelSpacing = 300; // Separación entre niveles (horizontal)

  // Agrupar nodos por niveles
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(nodeId);
  });

  console.log('Grupos por niveles:', levelGroups);

  Object.keys(levelGroups).forEach((level) => {
    const nodesInLevel = levelGroups[level];
    console.log(`Procesando nivel ${level}:`, nodesInLevel);

    const totalHeight = nodesInLevel.length * nodeHeight;
    const startX = level * levelSpacing;
    const startY = (window.innerHeight - totalHeight) / 2;

    nodesInLevel.forEach((nodeId, index) => {
      const x = startX;
      const y = startY + index * nodeHeight;

      // Asignar posición
      positions[nodeId] = { x, y };
    });
  });

  // Validar si faltan nodos
  nodesToInclude.forEach((nodeId) => {
    if (!positions[nodeId]) {
      console.warn(
        `Nodo sin posición calculada tras procesar niveles: ${nodeId}`
      );
      positions[nodeId] = { x: 0, y: 0 }; // Asignar posición por defecto
    }
  });

  return positions;
};

export default computePositions;
