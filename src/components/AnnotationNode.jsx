import React, { useState, useRef, useEffect } from 'react';
import { memo } from 'react';

const AnnotationNode = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Escribe aquí');

  const handleFocus = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleInput = (e) => {
    setText(e.currentTarget.innerText);
  };

  return (
    <div
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onClick={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        padding: '8px',
        border: isEditing ? '1px solid #0078d4' : '1px dashed #ccc',
        borderRadius: '4px',
        minHeight: '24px',
        cursor: isEditing ? 'text' : 'pointer',
        outline: 'none',
        backgroundColor: '#fff',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
      tabIndex={0}
    >
      {text}
    </div>
  );
};


export default memo(AnnotationNode);
