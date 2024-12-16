import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaSave,
  FaFilter,
  FaRedo,
  FaPlus,
  FaFolderOpen,
  FaLayerGroup,
} from 'react-icons/fa';

const Toolbar = ({
  filter,
  onFilterChange,
  onFilterApply,
  onRecalculatePositions,
  onSaveDiagram,
  onLoadDiagram,
  visibleTypes,
  onTypeChange,
  onCreateAnnotationNode,
}) => {
  const [showTypesMenu, setShowTypesMenu] = useState(false);


  return (
    <div className='toolbar-container'>
      {/* Filtro */}
      <div className='toolbar-item'>
        <input
          type='text'
          value={filter}
          onChange={onFilterChange}
          placeholder='Filtrar'
          className='toolbar-input'
        />
        <button
          onClick={onFilterApply}
          className='toolbar-button'
          title='Filtrar'
        >
          <FaFilter />
        </button>
      </div>

      {/* Guardar */}
      <button
        onClick={onSaveDiagram}
        className='toolbar-button'
        title='Guardar'
      >
        <FaSave />
      </button>

      {/* Reorganizar */}
      <button
        onClick={onRecalculatePositions}
        className='toolbar-button'
        title='Reorganizar'
      >
        <FaRedo />
      </button>

      {/* Añadir Nodo */}
      <button onClick={onCreateAnnotationNode} className='toolbar-button'>
        <FaPlus />
      </button>

      {/* Menú Desplegable de Tipos */}
      <div className='toolbar-item'>
        <button
          onClick={() => setShowTypesMenu((prev) => !prev)}
          className='toolbar-button'
          title='Tipos'
        >
          <FaLayerGroup />
        </button>

        {showTypesMenu && (
          <div className='types-menu'>
            <h4>Tipos de Nodos</h4>
            <ul>
              {['model', 'seed', 'source', 'test'].map((type) => (
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
        )}
      </div>

      {/* Abrir diagrama */}
      <button onClick={onLoadDiagram} className='toolbar-button' title='Abrir'>
        <FaFolderOpen />
      </button>

    </div>
  );
};

Toolbar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onRecalculatePositions: PropTypes.func.isRequired,
  onSaveDiagram: PropTypes.func.isRequired,
  onLoadDiagram: PropTypes.func.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCreateAnnotationNode: PropTypes.func.isRequired,
};

export default Toolbar;
