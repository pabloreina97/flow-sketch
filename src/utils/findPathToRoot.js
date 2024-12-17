const findPathToRoot = (startNodeId, edges, rootNodeId) => {
  const path = []; // Almacena los edges del camino
  const visited = new Set(); // Evita visitar edges repetidos

  const outgoingMap = new Map(); // Edges salientes (source -> target)
  const incomingMap = new Map(); // Edges entrantes (target -> source)

  // Construir los mapas de edges
  edges.forEach((edge) => {
    if (!outgoingMap.has(edge.source)) outgoingMap.set(edge.source, []);
    outgoingMap.get(edge.source).push(edge);

    if (!incomingMap.has(edge.target)) incomingMap.set(edge.target, []);
    incomingMap.get(edge.target).push(edge);
  });

  // Función para encontrar camino directo rootNode → startNode
  const findPathFromRootToStart = (currentNode) => {
    if (currentNode === startNodeId) return true; // Detener en el startNode

    const outgoingEdges = outgoingMap.get(currentNode) || [];
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        path.push(edge);
        if (findPathFromRootToStart(edge.target)) return true;
        path.pop(); // Si no es un camino válido, eliminar el edge
      }
    }
    return false;
  };

  // Función para resaltar padres del startNode
  const findParents = (currentNode) => {
    const incomingEdges = incomingMap.get(currentNode) || [];
    for (const edge of incomingEdges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        path.push(edge);
        findParents(edge.source);
      }
    }
  };

  // Función para encontrar camino startNode → rootNode
  const findPathToRootNode = (currentNode) => {
    if (currentNode === rootNodeId) return true; // Detener en el rootNode

    const outgoingEdges = outgoingMap.get(currentNode) || [];
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        path.push(edge);
        if (findPathToRootNode(edge.target)) return true;
        path.pop(); // Si no es un camino válido, eliminar el edge
      }
    }
    return false;
  };

  visited.clear();
  path.length = 0;

  // Comprobar si el startNode es hijo del rootNode
  if (findPathFromRootToStart(rootNodeId)) {
    // Caso: startNode es hijo → resaltar solo camino rootNode → startNode
    return path;
  } else {
    // Caso: startNode es padre o no está conectado directamente
    findParents(startNodeId); // Resaltar padres del startNode
    findPathToRootNode(startNodeId); // Resaltar camino startNode → rootNode
  }

  return path;
};

export default findPathToRoot;
