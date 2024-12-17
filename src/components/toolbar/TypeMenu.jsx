import React from 'react';
import { BsStack } from 'react-icons/bs';

export default function TypeMenu({ visibleTypes, onTypeChange }) {
  const resourceTypes = ['model', 'seed', 'source', 'test'];

  return (
    <div className='toolbar-item'>
      <button className='toolbar-button' title='Tipos de recursos'>
        <BsStack />
      </button>
      <div className='toolbar-menu'>
        <h4>Tipos de recurso</h4>
        <ul>
          {resourceTypes.map((type) => (
            <li key={type} className='types-menu-item'>
              <label>
                <input
                  type='checkbox'
                  checked={visibleTypes.includes(type)}
                  onChange={() => onTypeChange(type)}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
