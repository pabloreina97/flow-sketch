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
  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
    <input
      type='text'
      value={filter}
      onChange={onFilterChange}
      placeholder='Filtrar por modelo'
      style={{ marginRight: '10px', padding: '5px' }}
    />
    <button
      onClick={onFilterApply}
      style={{ padding: '5px 10px', marginRight: '10px' }}
    >
      Actualizar
    </button>
    <button
      onClick={onRecalculatePositions}
      style={{ padding: '5px 10px', marginRight: '10px' }}
    >
      Recalcular
    </button>
    {['model', 'seed', 'source', 'test'].map((type) => (
      <label key={type} style={{ marginRight: '10px' }}>
        <input
          type='checkbox'
          checked={visibleTypes.includes(type)}
          onChange={() => onTypeChange(type)}
        />
        {type}
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
