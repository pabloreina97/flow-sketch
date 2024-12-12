import { useEffect, useState } from 'react';
import computeLevels from '../utils/computeLevels';
import computePositions from '../utils/computePositions';
import   { useNodesState, useEdgesState } from '@xyflow/react';


export const useManifestData = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch('/manifest.json');
        const manifest = await response.json();

        const edgeSet = new Set();

        const newEdges = Object.entries(manifest.parent_map || {}).flatMap(
          ([nodeId, parents]) => {
            return parents
              .map((parentId) => {
                const edgeId = `e-${parentId}-${nodeId}`;
                if (!edgeSet.has(edgeId)) {
                  edgeSet.add(edgeId);
                  return {
                    id: edgeId,
                    source: parentId,
                    target: nodeId,
                  };
                }
                return null;
              })
              .filter((edge) => edge !== null);
          }
        );
        const nodesToInclude = new Set([
          ...Object.keys(manifest.parent_map || {}),
          ...Object.values(manifest.parent_map || {}).flat(),
        ]);

        // Calcular niveles y posiciones
        const levels = computeLevels(manifest, nodesToInclude);
        const positions = computePositions(levels, manifest, nodesToInclude);

        const newNodes = Object.entries(manifest.nodes)
          .filter(([id]) => nodesToInclude.has(id))
          .map(([id, node]) => ({
            id,
            position: positions[id],
            data: { label: node.name },
            sourcePosition: 'right',
            targetPosition: 'left',
          }));

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error loading manifest:', error);
      }
    };

    loadManifest();
  }, []);

  return { nodes, edges, onNodesChange, onEdgesChange };
};
