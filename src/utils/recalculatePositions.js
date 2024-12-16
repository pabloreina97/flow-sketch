import computeLevels from '../utils/computeLevels';
import computePositions from '../utils/computePositions';

export const recalculatePositions = (
  nodes,
  edges,
) => {
  // Crear un conjunto con los IDs de los nodos actuales
  const nodesToInclude = new Set(nodes.map((node) => node.id));

  // Calcular niveles basados en los nodos y edges actuales
  const parentMap = edges.reduce((acc, edge) => {
    if (!acc[edge.target]) acc[edge.target] = [];
    acc[edge.target].push(edge.source);
    return acc;
  }, {});

  const levels = computeLevels(parentMap, nodesToInclude);

  // Calcular posiciones basadas en los niveles
  const positions = computePositions(levels, nodesToInclude);

  // Actualizar nodos con nuevas posiciones
  const recalculatedNodes = nodes.map((node) => ({
    ...node,
    position: positions[node.id] || { x: 0, y: 0 }, // Posición por defecto si no se calculó
  }));

  return recalculatedNodes;
};
