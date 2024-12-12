import React from 'react';
import PropTypes from 'prop-types';
import FilterInput from './FilterInput';

const Toolbar = ({
  filter,
  onFilterChange,
  onFilterApply,
  onRecalculatePositions,
  visibleTypes,
  onTypeChange,
}) => (
  <div className='toolbar-container'>
    <input
      type='text'
      value={filter}
      onChange={onFilterChange}
      placeholder='Filtrar por modelo'
      className='text-sm p-2 border border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:border-blue-500'
    />
    <button
      onClick={onFilterApply}
      className='toolbar-container-button font-medium rounded-lg px-4 py-2 hover:shadow-lg'
    >
      Actualizar
    </button>
    <button
      onClick={onRecalculatePositions}
      className='toolbar-container-button font-medium rounded-lg px-4 py-2 hover:shadow-lg'
    >
      Recalcular
    </button>
    {['model', 'seed', 'source', 'test'].map((type) => (
      <label key={type} className='flex items-center gap-4 text-sm'>
        <div className='flex gap-1' >
          <input
            type='checkbox'
            checked={visibleTypes.includes(type)}
            onChange={() => onTypeChange(type)}
            className='accent-blue-500'
          />
          <span>{type}</span>
        </div>
      </label>
    ))}
  </div>
);

Toolbar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default Toolbar;
