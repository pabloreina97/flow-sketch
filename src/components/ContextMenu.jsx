import React, { useCallback, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import Modal from './Modal'; // Importamos el componente Modal

export default function ContextMenu({ id, top, left }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');

  // Eliminar nodo
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  // Deshabilitar/Habilitar nodo
  const toggleDisableNode = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, disabled: !node.data.disabled } }
          : node
      )
    );
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
