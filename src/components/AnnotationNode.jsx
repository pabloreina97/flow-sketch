import React, { memo, useState, useRef, useEffect } from 'react';

function AnnotationNode({ data, onLabelChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      const newLabel = contentRef.current.textContent.trim();
      if (newLabel !== data.label) {
        onLabelChange(newLabel);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      contentRef.current?.blur();
    }
  };

  const adjustHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto'; // Reiniciar altura para recálculo
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`; // Ajustar al contenido
    }
  };

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();

      // Seleccionar todo el texto al iniciar edición
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Ajustar altura inicial
      adjustHeight();
    }
  }, [isEditing]);

  // Ajustar altura al cambiar el contenido
  useEffect(() => {
    adjustHeight();
  }, [data.label]);

  return (
    <div
      ref={contentRef}
      contentEditable={isEditing}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={adjustHeight} // Detectar cambios en el contenido
      suppressContentEditableWarning={true}
      style={{
        cursor: isEditing ? 'text' : 'pointer',
        outline: isEditing ? '1px solid #4a90e2' : 'none',
        padding: '4px',
        width: '200px', // Ancho fijo
        minHeight: '20px', // Altura mínima
        maxHeight: 'none', // Sin límite de altura
        overflow: 'hidden', // Sin scroll interno
        wordBreak: 'break-word', // Romper palabras largas
        lineHeight: '1.2',
        fontSize: '14px',
      }}
    >
      {data.label}
    </div>
  );
}

export default memo(AnnotationNode);
