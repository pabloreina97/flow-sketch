import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { GoDatabase, GoComment } from 'react-icons/go';

const CustomNode = ({ data }) => {
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const isEnabled = data.enabled !== false;
  const nodeRef = useRef(null);

  const toogleTooltip = () => {
    setVisibleTooltip((prev) => !prev);
  };

  // Cerrar el tooltip si se hace clic fuera del nodo
  const handleClickOutside = (event) => {
    if (nodeRef.current && !nodeRef.current.contains(event.target)) {
      setVisibleTooltip(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={nodeRef}
      onMouseEnter={() => {
        nodeRef.current.hoverTimeout = setTimeout(() => setHovered(true), 500);
      }}
      onMouseLeave={() => {
        clearTimeout(nodeRef.current.hoverTimeout);
        setHovered(false);
      }}
    >
      <NodeToolbar
        isVisible={visibleTooltip}
        position={Position.Bottom}
        align='center'
        offset={20}
      >
        <ul className='tooltip'>
          {Object.keys(data.node.columns).map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </NodeToolbar>
      {data.enabled && (
        <NodeToolbar
          isVisible={isHovered && data.description !== ''}
          position={Position.Top}
          align='center'
          offset={20}
          className='description-tooltip'
        >
          {data.description || ''}
        </NodeToolbar>
      )}
      <div className='text-center'>
        <div className='text-l font-semibold text-gray-800'>{data.label}</div>
      </div>
      {data.enabled && (
        <div className='flex gap-1 items-center justify-between mt-1'>
          <div className='flex gap-1 items-center justify-center'>
            <GoDatabase className='text-gray-500' />
            <span className='text-gray-600 text-xs'>
              {data.node.config.materialized}
            </span>
          </div>
          <div className='flex gap-1 items-center justify-center'>
            <button
              className='text-gray-600 text-xs'
              onClick={() => toogleTooltip()}
            >
              {Object.keys(data.node.columns).length > 0
                ? `${Object.keys(data.node.columns).length} cols`
                : ''}
            </button>
            {data.description !== '' && (
              <GoComment className='text-gray-500 ml-1' />
            )}
          </div>
        </div>
      )}
      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
};

export { CustomNode };

export default memo(CustomNode);
