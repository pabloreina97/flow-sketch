import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BsBarChartSteps,
  BsFileEarmark,
  BsFilter,
  BsInputCursor,
  BsStack,
} from 'react-icons/bs';

const Toolbar = ({
  fileName,
  isModified,
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
  const [activeMenu, setActiveMenu] = useState(null); // Estado único para controlar los menús

  const handleMenuToggle = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.toolbar-container')) {
      setActiveMenu(null); // Cierra los menús si haces clic fuera del toolbar
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='toolbar-container'>
      {/* Menú de archivos */}
      <div className='toolbar-item'>
        <button
          className='toolbar-button'
          title='Archivos'
          onClick={() => handleMenuToggle('fileMenu')}
        >
          <BsFileEarmark />
        </button>

        {activeMenu === 'fileMenu' && (
          <div className='toolbar-menu'>
            <button
              className='toolbar-menu-item'
              onClick={() => {
                onLoadDiagram();
                setActiveMenu(null); // Cierra el menú
              }}
            >
              Abrir diagrama
            </button>
            <button
              className='toolbar-menu-item'
              onClick={() => {
                onSaveDiagram();
                setActiveMenu(null); // Cierra el menú
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
          onClick={() => handleMenuToggle('filterMenu')}
        >
          <BsFilter />
        </button>

        {activeMenu === 'filterMenu' && (
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
                setActiveMenu(null); // Cierra el menú
              }}
              className='toolbar-menu-item mt-4'
            >
              Aplicar filtro
            </button>
          </div>
        )}
      </div>

      {/* Menú Desplegable de Tipos */}
      <div className='toolbar-item'>
        <button
          onClick={() => handleMenuToggle('typesMenu')}
          className='toolbar-button'
          title='Tipos'
        >
          <BsStack />
        </button>
        {activeMenu === 'typesMenu' && (
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

      {/* Reorganizar */}
      <button
        onClick={onRecalculatePositions}
        className='toolbar-button'
        title='Reorganizar'
      >
        <BsBarChartSteps />
      </button>

      {/* Añadir Nodo */}
      <button
        onClick={() => onCreateAnnotationNode()}
        className='toolbar-button'
      >
        <BsInputCursor />
      </button>

      {/* Mostrar nombre del archivo */}
      <span
        className='px-2'
        style={{ fontStyle: isModified ? 'italic' : 'normal' }}
      >
        {fileName.replace('.json', '')}
      </span>
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
