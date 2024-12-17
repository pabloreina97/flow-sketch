import React, { useRef, useCallback, useState } from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import CustomNode from './CustomNode';
import AnnotationNode from './AnnotationNode';
import ContextMenu from '../components/ContextMenu';

const ReactFlowComponent = ({ nodes, edges, onNodesChange, onDeleteNode }) => {
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const nodeTypes = {
    tooltipNode: CustomNode,
    annotationNode: AnnotationNode,
  };

  const reactFlowWrapperRef = useRef(null);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div
      style={{ width: '100%', height: '100vh' }}
      ref={reactFlowWrapperRef}
      className='relative'
    >
      <ReactFlow
        minZoom={0.1}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant='dots' gap={12} size={1} />
      </ReactFlow>
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
    </div>
  );
};

export default ReactFlowComponent;
