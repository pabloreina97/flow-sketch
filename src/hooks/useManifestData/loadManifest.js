import computeLevels from '../../utils/computeLevels';
import computePositions from '../../utils/computePositions';

export const loadManifest = async () => {
  try {
    const response = await fetch('/manifest_d.json');
    const manifest = await response.json();

    const edgeSet = new Set();

    const edges = Object.entries(manifest.parent_map || {}).flatMap(
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

    const nodesToInclude = new Set([
      ...Object.keys(manifest.parent_map || {}),
      ...Object.values(manifest.parent_map || {}).flat(),
    ]);

    const levels = computeLevels(manifest, nodesToInclude);
    const positions = computePositions(levels, manifest, nodesToInclude);

    const getNodeBackgroundColor = (id) => {
      if (id.startsWith('model')) return '#F6D6D6';
      if (id.startsWith('source')) return '#F6F7C4';
      if (id.startsWith('test')) return '#7BD3EA';
      if (id.startsWith('seed')) return '#A1EEBD';
      return '#F8EDED';
    };

    const nodes = Object.entries(manifest.nodes)
      .filter(([id]) => nodesToInclude.has(id))
      .map(([id, node]) => ({
        id,
        position: positions[id],
        type: 'tooltipNode',
        data: {
          label: node.name,
          color: getNodeBackgroundColor(id),
          node: node,
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
