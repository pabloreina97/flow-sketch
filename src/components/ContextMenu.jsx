import { useCallback, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import Modal from './Modal'; // Importamos el componente Modal

export default function ContextMenu({ id, top, left, onClose }) {
  const { getNode, setNodes, setEdges } = useReactFlow();
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');

  // Función para cerrar el menú
  const closeMenu = () => {
    if (onClose) onClose();
  };

  // Eliminar nodo
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
    closeMenu();
  }, [id, setNodes, setEdges]);

  // Deshabilitar/Habilitar nodo
  const toggleDisableNode = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          const isEnabled = node.data.enabled !== false; // Si está habilitado o no
          return {
            ...node,
            data: {
              ...node.data,
              enabled: !isEnabled, // Alterna el estado de enabled
            },
            style: isEnabled
              ? {
                  ...node.style,
                  background: '#f5f5f5',
                  color: '#b0b0b0',
                  opacity: 0.6,
                }
              : { ...node.data.originalStyle }, // Restaurar estilos originales
          };
        }
        return node;
      })
    );
    onClose();
  }, [id, setNodes]);

  // Abrir el modal para editar la descripción
  const openEditModal = () => {
    const node = getNode(id);
    setDescription(node.data.description || ''); // Cargar la descripción actual
    setIsModalOpen(true);
  };

  // Guardar la descripción actualizada
  const saveDescription = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, description } } : node
      )
    );
    setIsModalOpen(false);
    onClose();
  };

  return (
    <>
      <div
        ref={menuRef}
        className='context-menu'
        style={{
          top: `${top}px`,
          left: `${left}px`,
        }}
      >
        <button onClick={deleteNode}>Eliminar</button>
        <button onClick={toggleDisableNode}>Deshabilitar/Habilitar</button>
        <button onClick={openEditModal}>Editar descripción</button>
      </div>

      {/* Modal para edición de descripción */}
      <Modal
        title='Editar descripción'
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={saveDescription}
      >
        <textarea
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Nueva descripción'
          className='modal-input'
          style={{ resize: 'none', overflow: 'auto', minHeight: '100px' }} // Altura mínima fija
        />
      </Modal>
    </>
  );
}
