import React from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const ReactFlowComponent = ({ nodes, edges, onNodesChange, onEdgesChange }) => {

  const handleNodesChange = (updatedNodes) => {
    const validatedNodes = updatedNodes.map((node) => ({
      ...node,
      position: node.position || { x: 0, y: 0 }, // Posición por defecto si falta
    }));
    onNodesChange(validatedNodes); // Llama al callback original con los nodos validados
  };

  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default ReactFlowComponent;