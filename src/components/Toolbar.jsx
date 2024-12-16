import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaSave,
  FaFilter,
  FaRedo,
  FaFolderOpen,
  FaLayerGroup,
  FaComment,
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
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className='toolbar-container'>
      {/* Menú de archivos */}
      <div className='toolbar-item'>
        <button
          className='toolbar-button'
          title='Archivos'
          onClick={() => setShowFileMenu((prev) => !prev)}
        >
          <FaFolderOpen />
        </button>

        {showFileMenu && (
          <div className='toolbar-menu'>
            <button
              className='toolbar-menu-item'
              onClick={() => {
                onLoadDiagram();
                setShowFileMenu(false); // Cierra el menú
              }}
            >
              Abrir diagrama
            </button>
            <button
              className='toolbar-menu-item'
              onClick={() => {
                onSaveDiagram();
                setShowFileMenu(false); // Cierra el menú
              }}
            >
              Guardar diagrama
            </button>
          </div>
        )}
      </div>

      {/* Menú de filtro */}
      <div className='toolbar-item'>
        <button
          className='toolbar-button'
          title='Filtrar'
          onClick={() => setShowFilterMenu((prev) => !prev)}
        >
          <FaFilter />
        </button>

        {showFilterMenu && (
          <div className='toolbar-menu'>
            <input
              type='text'
              placeholder='Filtrar'
              className='toolbar-input'
              onChange={(e) => onFilterChange(e)}
            />
            <button
              onClick={() => {
                onFilterApply();
                setShowFilterMenu(false); // Cierra el menú
              }}
              className='toolbar-menu-item mt-4'
            >
              Aplicar filtro
            </button>
          </div>
        )}
      </div>

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
        <FaComment />
      </button>

      {/* Menú Desplegable de Tipos */}
      <button
        onClick={() => setShowTypesMenu((prev) => !prev)}
        className='toolbar-button'
        title='Tipos'
      >
        <FaLayerGroup />
      </button>

      {showTypesMenu && (
        <div className='toolbar-menu'>
          <h4>Tipos de recurso</h4>
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
