import computeLevels from '../../utils/computeLevels';
import computePositions from '../../utils/computePositions';

export const recalculatePositions = (
  filteredNodes,
  edges,
  setFilteredNodes
) => {
  const nodesToInclude = new Set(filteredNodes.map((node) => node.id));
  const levels = computeLevels({ parent_map: edges }, nodesToInclude);
  const positions = computePositions(
    levels,
    { nodes: filteredNodes },
    nodesToInclude
  );

  const recalculatedNodes = filteredNodes.map((node) => ({
    ...node,
    position: positions[node.id],
  }));

  setFilteredNodes(recalculatedNodes);
};
