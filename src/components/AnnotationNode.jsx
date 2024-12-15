import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const AnnotationNode = ({ data, selected }) => {
  const [label, setLabel] = useState(data.label || 'Escribe aquí');

  return (
    <div
      className={`annotation-node px-4 py-2 shadow-md rounded-md border ${
        selected ? 'border-blue-400' : 'border-gray-300'
      }`}
      style={{ backgroundColor: '#FFFDE7' }}
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setLabel(e.target.textContent)}
        style={{ outline: 'none', cursor: 'text' }}
      >
        {label}
      </div>
      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
};

export default memo(AnnotationNode);
