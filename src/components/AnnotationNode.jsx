import React, { memo, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const AnnotationNode = ({ id, data, selected, deleteNode }) => {
  const contentEditableRef = useRef(null); // Referencia al contentEditable

  // Enfocar automáticamente cuando el nodo está seleccionado
  useEffect(() => {
    if (selected && contentEditableRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(contentEditableRef.current); // Selecciona todo el contenido
      range.collapse(false); // Coloca el cursor al final del texto
      selection.removeAllRanges();
      selection.addRange(range);

      contentEditableRef.current.focus(); // Enfoca el elemento
    }
  }, [selected]);

  // Eliminar nodo al pulsar "Supr"
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteNode(id); // Llama a la función para eliminar el nodo
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown} // Escucha la tecla "Delete"
      tabIndex={0} // Permite que el nodo sea enfocado para eventos de teclado
    >
      <div
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          outline: 'none',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: '#333',
          width: '100%',
        }}
      >
        {data.label || 'Escribe aquí'}
      </div>
    </div>
  );
};

export default memo(AnnotationNode);
