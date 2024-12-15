import React, { memo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const AnnotationNode = ({ data, selected }) => {
  const contentEditableRef = useRef(null); // Referencia para el contentEditable

  // Actualizar el estado solo cuando el usuario termina de editar
  const handleBlur = () => {
    const newText = contentEditableRef.current.textContent;
    // Aquí puedes actualizar tu estado externo o la base de datos con el nuevo texto
    console.log('Texto final:', newText);
  };

  return (
    <div>
      <div
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur} // Actualizamos el texto al perder el foco
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
