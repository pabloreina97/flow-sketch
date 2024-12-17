import React from 'react';
import { BsFilter } from 'react-icons/bs';

export default function FilterMenu({ filter, onFilterChange, onFilterApply }) {
  return (
    <div className='toolbar-item'>
      <button className='toolbar-button' title='Filtrar'>
        <BsFilter />
      </button>
      <div className='toolbar-menu'>
        <input
          type='text'
          placeholder='Filtrar'
          className='toolbar-input'
          value={filter}
          onChange={onFilterChange}
        />
        <button onClick={onFilterApply} className='toolbar-menu-item mt-2'>
          Aplicar filtro
        </button>
      </div>
    </div>
  );
}
