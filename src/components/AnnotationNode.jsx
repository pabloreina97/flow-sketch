import React, { useState, useRef, useEffect } from 'react';
import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';
const AnnotationNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Escribe aquí');
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Restablece la altura
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajusta según el contenido
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight(); // Ajusta la altura inicial al entrar en modo edición
    }
  }, [isEditing]);

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      style={{
        /* estilos similares a los que tenías */
        padding: '8px',
        borderRadius: '4px',
        minHeight: '24px',
        cursor: 'text',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      <NodeResizer minWidth={100} minHeight={30} isVisible={selected} />
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onBlur={() => {
            setIsEditing(false);
            data.onChange && data.onChange(text);
          }}
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
            outline: 'none',
            resize: 'none',
            font: 'inherit',
            overflow: 'hidden',
          }}
          autoFocus
        />
      ) : (
        text
      )}
    </div>
  );
};

export default memo(AnnotationNode);
