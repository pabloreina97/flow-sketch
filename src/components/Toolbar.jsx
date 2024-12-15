import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Toolbar = ({
  filter,
  onFilterChange,
  onFilterApply,
  onRecalculatePositions,
  onSaveDiagram,
  diagrams,
  onLoadDiagram,
  visibleTypes,
  onTypeChange,
}) => {
  const [diagramTitle, setDiagramTitle] = useState('');

  return (
    <div className='toolbar-container'>
      <input
        type='text'
        value={filter}
        onChange={onFilterChange}
        placeholder='Filtrar por modelo'
        className='toolbar-container-input'
      />
      <button onClick={onFilterApply} className='toolbar-container-button'>
        Filtrar
      </button>
      <button
        onClick={onRecalculatePositions}
        className='toolbar-container-button'
      >
        Reorganizar
      </button>

      {/* Guardar Diagrama */}
      <div>
        <input
          type='text'
          placeholder='Título del diagrama'
          value={diagramTitle}
          onChange={(e) => setDiagramTitle(e.target.value)}
          className='toolbar-container-input'
        />
        <button
          onClick={() => {
            onSaveDiagram(diagramTitle);
            setDiagramTitle('');
          }}
          className='toolbar-container-button'
        >
          Guardar Diagrama
        </button>
      </div>

      {/* Lista de Diagramas Guardados */}
      <div>
        <h4>Diagramas Guardados</h4>
        <ul>
          {diagrams.map((diagram) => (
            <li key={diagram.id} style={{ display: 'flex', gap: '8px' }}>
              <span>{diagram.title}</span>
              <button
                onClick={() => onLoadDiagram(diagram.id)}
                className='toolbar-container-button'
              >
                Cargar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtros de Tipos */}
      {['model', 'seed', 'source', 'test'].map((type) => (
        <label key={type} className='flex items-center gap-4 text-sm'>
          <div className='flex gap-1'>
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
};

Toolbar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onRecalculatePositions: PropTypes.func.isRequired,
  onSaveDiagram: PropTypes.func.isRequired,
  diagrams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onLoadDiagram: PropTypes.func.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Toolbar;
