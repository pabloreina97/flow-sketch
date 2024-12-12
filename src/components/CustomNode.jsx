import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
 
const CustomNode = ({ data }) => {
  return (
    <div className={'px-4 py-2 shadow-md rounded-md'} style={{ backgroundColor: data.color }}>
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={Position.Top}
        align='center'
        offset={40}
      >
        <div className={`tooltip ${data.toolbarVisible ? 'show' : ''}`}>
          {data.info.resource_type}
        </div>
      </NodeToolbar>

      <div className='text-center'>
        <div className='text-l font-semibold text-gray-800'>
          {data.label}
        </div>
      </div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
};

export { CustomNode };
 
export default memo(CustomNode);