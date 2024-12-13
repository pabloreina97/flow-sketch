import computeLevels from './computeLevels';
import computePositions from './computePositions';

export const loadManifest = async () => {
  try {
    const response = await fetch('/manifest_d.json');
    const manifest = await response.json();

    // Estos son los nodos que queremos incluir en el gráfico
    const originalNodes = Object.entries(manifest.nodes).filter(
      ([, node]) =>
        node.package_name === 'dbtlearn' ||
        node.package_name === 'analytics_genially'
    );

    // Crear un Set con los IDs de nodos disponibles
    const nodeIds = new Set(originalNodes.map(([id]) => id));

    // Filtrar el parent_map para mantener solo las claves y valores relevantes
    const cleanParentMap = Object.entries(manifest.parent_map || {})
      .filter(([key]) => nodeIds.has(key)) // Mantén solo claves que están en los nodos filtrados
      .reduce((acc, [key, parents]) => {
        const filteredParents = parents.filter((parent) => nodeIds.has(parent)); // Filtra los valores que estén en los nodos filtrados
        acc[key] = filteredParents;
        return acc;
      }, {});

    // Calcular niveles y posiciones basados en el parent_map limpio
    const levels = computeLevels(cleanParentMap, nodeIds);
    const positions = computePositions(levels, manifest, nodeIds);

    // Construir los edges usando el parent_map limpio
    const edgeSet = new Set();
    const edges = Object.entries(cleanParentMap).flatMap(
      ([nodeId, parents]) => {
        return parents
          .map((parentId) => {
            const edgeId = `e-${parentId}-${nodeId}`;
            if (!edgeSet.has(edgeId)) {
              edgeSet.add(edgeId);
              return { id: edgeId, source: parentId, target: nodeId };
            }
            return null;
          })
          .filter(Boolean);
      }
    );

    // Construir los nodos con posiciones y estilos
    const getNodeBackgroundColor = (node) => {
      if (node.resource_type === 'model') return '#F6D6D6';
      if (node.resource_type === 'source') return '#F6F7C4';
      if (node.resource_type === 'test') return '#7BD3EA';
      if (node.resource_type === 'seed') return '#D3C4F6';
      return '#F8EDED';
    };

    const nodes = originalNodes.map(([id, node]) => ({
      id,
      position: positions[id],
      type: 'tooltipNode',
      data: {
        label: node.name,
        color: getNodeBackgroundColor(node),
        node,
      },
      sourcePosition: 'right',
      targetPosition: 'left',
    }));

    return { nodes, edges };
  } catch (error) {
    console.error('Error loading manifest:', error);
    return { nodes: [], edges: [] };
  }
};
