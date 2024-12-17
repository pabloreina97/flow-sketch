import React, { useRef, useCallback, useState } from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import CustomNode from './CustomNode';
import AnnotationNode from './AnnotationNode';
import ContextMenu from '../components/ContextMenu';

const ReactFlowComponent = ({
  nodes,
  edges,
  onNodesChange,
  onPaneClick,
}) => {
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const nodeTypes = {
    tooltipNode: CustomNode,
    annotationNode: AnnotationNode,
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault(); // Evita el menú contextual nativo

      if (ref.current) {
        const pane = ref.current.getBoundingClientRect();

        // Asegura que las posiciones sean válidas dentro del área del lienzo
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
    setMenu(null); // Cierra el menú contextual al hacer clic en el lienzo
    if (onPaneClick) onPaneClick();
  }, [setMenu, onPaneClick]);

  return (
    <div
      style={{ width: '100%', height: '100vh' }}
      ref={ref}
      className='relative'
    >
      <ReactFlow
        selectionOnDrag={true} // Selección rectangular por defecto
        panOnDrag={false} // Deshabilita el paneo al arrastrar con el botón izquierdo
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
        />
      )}
    </div>
  );
};

export default ReactFlowComponent;
