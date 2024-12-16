import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
 
const CustomNode = ({ data, selected }) => {
  return (
    <div>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align='center'
        offset={40}
      >
        <ul className={`tooltip ${selected ? 'show' : ''}`}>
          {Object.keys(data.node.columns).map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </NodeToolbar>

      <div className='text-center'>
        <div className='text-l font-semibold text-gray-800'>{data.label}</div>
      </div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
};

export { CustomNode };
 
export default memo(CustomNode);