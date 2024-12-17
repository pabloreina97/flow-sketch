import React, { useState, useRef, useEffect } from 'react';
import { memo } from 'react';
import { NodeResizer, NodeToolbar, Position } from '@xyflow/react';
const AnnotationNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Escribe aquí');
  const [color, setColor] = useState(data.color);
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

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor); // Actualiza el estado local
    if (data.onColorChange) {
      data.onColorChange(newColor); // Llama a la función para actualizar el color en el nivel superior
    } else {
      data.color = newColor; // Si no hay función, actualiza directamente el dato
    }
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
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        color: color, // Aplica el color seleccionado al texto
      }}
    >
      <NodeToolbar
        
        isVisible={selected}
        position={Position.Top}
        align='center'
        offset={40}
        className='bg-white shadow-md px-8 py-2 rounded-lg'
      >
        <input
          type='color'
          value={color}
          onChange={handleColorChange}
          className='w-8 h-8 rounded-full'
        />
      </NodeToolbar>

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
