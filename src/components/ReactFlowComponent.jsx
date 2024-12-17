import React, { useRef } from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import CustomNode from './CustomNode';
import AnnotationNode from './AnnotationNode';

const ReactFlowComponent = ({ nodes, edges, onNodesChange, onDeleteNode }) => {

  const nodeTypes = {
    tooltipNode: CustomNode,
    annotationNode: AnnotationNode,
  };

  const reactFlowWrapperRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '100vh' }} ref={reactFlowWrapperRef} className="relative">
      <ReactFlow
        minZoom={0.1}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
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
