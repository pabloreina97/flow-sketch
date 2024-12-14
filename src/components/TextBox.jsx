import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const TextBox = ({ data, selected }) => {
  const [label, setLabel] = useState(data.label);

  return (
    <>
      <NodeResizer
        color='#ff0071'
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handle type='target' position={Position.Left} />
      <div
        style={{ padding: 10 }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setLabel(e.target.textContent)}
      >
        {label}
      </div>
      <Handle type='source' position={Position.Right} />
    </>
  );
};

export default memo(TextBox);
