import React, { useRef } from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import CustomNode from './CustomNode';
import { useState } from 'react';
import AnnotationNode from './AnnotationNode';

const ReactFlowComponent = ({ nodes, edges, onNodesChange, onDeleteNode }) => {
  const [currentNodes, setNodes] = useState(nodes);

  const handleSelectionChange = (selection) => {
    // Obtén los IDs de los nodos seleccionados
    const selectedNodeIds = selection.nodes.map((node) => node.id);

    // Comprueba si los nodos seleccionados han cambiado
    const hasSelectionChanged = currentNodes.some(
      (node) => node.data.isSelected !== selectedNodeIds.includes(node.id)
    );

    if (!hasSelectionChanged) {
      // Si no hay cambios, no actualices el estado
      return;
    }

    // Actualiza el estado solo si la selección ha cambiado
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedNodeIds.includes(node.id), // Actualizar selección
        },
      }))
    );
  };

  const nodeTypes = {
    tooltipNode: CustomNode,
    annotationNode: AnnotationNode,
  };

  const reactFlowWrapperRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '100vh' }} ref={reactFlowWrapperRef} className="relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant='dots' gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;
