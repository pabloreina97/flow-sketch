import {
  ReactFlowProvider,
  ReactFlow,
  Controls,
  MiniMap,
  Background,
} from '@xyflow/react';
import { useState, useRef, useCallback } from 'react';
import CustomNode from './CustomNode';
import AnnotationNode from './AnnotationNode';
import ContextMenu from './ContextMenu';

const ReactFlowComponent = ({ nodes, edges, setNodes, setEdges, onNodesChange, onPaneClick }) => {
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const nodeTypes = {
    tooltipNode: CustomNode,
    annotationNode: AnnotationNode,
  };

  const closeMenu = () => {
    setMenu(null); // Cierra el menú
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      if (ref.current) {
        const pane = ref.current.getBoundingClientRect();
        const menuTop = Math.min(event.clientY, pane.bottom - 200);
        const menuLeft = Math.min(event.clientX, pane.right - 200);
        setMenu({
          id: node.id,
          top: menuTop,
          left: menuLeft,
        });
      }
    },
    [setMenu]
  );

  const handlePaneClick = useCallback(() => {
    setMenu(null); // Cierra el menú contextual
    if (onPaneClick) onPaneClick();
  }, [onPaneClick]);

  return (
    <ReactFlowProvider>
      <div
        style={{ width: '100%', height: '100vh' }}
        ref={ref}
        className='relative'
      >
        <ReactFlow
          selectionOnDrag={true}
          panOnDrag={false}
          zoomOnScroll={true}
          minZoom={0.1}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onPaneClick={handlePaneClick}
          onNodeContextMenu={onNodeContextMenu}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant='dots' gap={12} size={1} />
        </ReactFlow>
        {menu && (
          <ContextMenu
            id={menu.id}
            top={menu.top}
            left={menu.left}
            onClose={closeMenu}
            setNodes={setNodes}
            setEdges={setEdges}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default ReactFlowComponent;
