import React from 'react';

const FilterInput = ({ filter, onFilterChange, onFilterApply }) => (
  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
    <input
      type='text'
      value={filter}
      onChange={onFilterChange}
      placeholder='Filtrar por modelo'
      style={{ marginRight: '10px', padding: '5px' }}
    />
    <button onClick={onFilterApply} style={{ padding: '5px 10px' }}>
      Actualizar
    </button>
  </div>
);

export default FilterInput;
