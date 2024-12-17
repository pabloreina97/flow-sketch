import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { GoDatabase } from 'react-icons/go';

const CustomNode = ({ data, selected }) => {
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const nodeRef = useRef(null);

  const toogleTooltip = () => {
    setVisibleTooltip((prev) => !prev);
  };

  // Cerrar el tooltip si se hace clic fuera del nodo
  const handleClickOutside = (event) => {
    if (nodeRef.current && !nodeRef.current.contains(event.target)) {
      setVisibleTooltip(false); // Oculta el tooltip
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div ref={nodeRef}>
      <NodeToolbar
        isVisible={visibleTooltip}
        position={Position.Bottom}
        align='center'
        offset={20}
      >
        <ul className={`tooltip ${visibleTooltip ? 'show' : ''}`}>
          {Object.keys(data.node.columns).map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </NodeToolbar>

      <div className='text-center'>
        <div className='text-l font-semibold text-gray-800'>{data.label}</div>
      </div>
      <div className='flex gap-1 items-center justify-between mt-1'>
        <div className='flex gap-1 items-center justify-center'>
          <GoDatabase className='text-gray-500' />
          <span className='text-gray-600 text-xs'>
            {data.node.config.materialized}
          </span>
        </div>
        <button
          className='text-gray-600 text-xs'
          onClick={() => toogleTooltip()}
        >
          {Object.keys(data.node.columns).length > 0
            ? `${Object.keys(data.node.columns).length} cols`
            : ''}
        </button>
        {/* <button className='bg-gray-800 text-white p-2 rounded-lg' /> */}
      </div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
};

export { CustomNode };

export default memo(CustomNode);
