import React from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';

const ReactFlowComponent = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  const nodeTypes = {
    tooltipNode: CustomNode,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <MiniMap />
      <Background variant='dots' gap={12} size={1} />
    </ReactFlow>
  );
};

export default ReactFlowComponent;