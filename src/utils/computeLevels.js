const computeLevels = (parentMap, nodesToInclude) => {
  const levels = {};
  const unresolved = new Set(nodesToInclude);

  const getLevel = (nodeId) => {
    if (levels[nodeId] !== undefined) return levels[nodeId];
    if (!unresolved.has(nodeId)) return 0;

    unresolved.delete(nodeId);
    let level = 0;

    if (parentMap[nodeId]) {
      level =
        1 +
        Math.max(
          ...parentMap[nodeId]
            .filter((dep) => nodesToInclude.has(dep))
            .map(getLevel),
          0
        );
    }

    levels[nodeId] = level;
    return level;
  };

  nodesToInclude.forEach(getLevel);
  
  console.log('Niveles calculados:', levels);
  console.log('Nodos no resueltos:', Array.from(unresolved));

  return levels;
};

export default computeLevels;