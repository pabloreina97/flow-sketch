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
import Modal from './Modal';

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
  onCreateAnnotationNode,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState('');
  const [showDiagramList, setShowDiagramList] = useState(false);
  const [showTypesMenu, setShowTypesMenu] = useState(false); // Estado para mostrar/ocultar el menú de tipos

  const handleSaveClick = () => {
    setModalOpen(true); // Abre el modal
  };

  const handleSaveConfirm = () => {
    onSaveDiagram(diagramTitle);
    setDiagramTitle('');
    setModalOpen(false);
  };

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
        onClick={handleSaveClick}
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

      {/* Mostrar Lista de Diagramas */}
      <button
        onClick={() => setShowDiagramList((prev) => !prev)}
        className='toolbar-button'
        title='Abrir'
      >
        <FaFolderOpen />
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

      {/* Lista de Diagramas Guardados */}
      {showDiagramList && (
        <div className='diagram-list'>
          <h4>Diagramas Guardados</h4>
          <ul>
            {diagrams.map((diagram) => (
              <li key={diagram.id} className='diagram-list-item'>
                <span>{diagram.title}</span>
                <button
                  onClick={() => {
                    onLoadDiagram(diagram.id);
                    setShowDiagramList(false);
                  }}
                  className='toolbar-button'
                  title='Cargar'
                >
                  <FaFolderOpen />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal para ingresar título */}
      <Modal
        title='Guardar Diagrama'
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSaveConfirm}
      >
        <input
          type='text'
          placeholder='Título del diagrama'
          value={diagramTitle}
          onChange={(e) => setDiagramTitle(e.target.value)}
          className='toolbar-input'
          style={{ width: '100%', marginBottom: '8px' }}
        />
      </Modal>
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
  onCreateAnnotationNode: PropTypes.func.isRequired,
};

export default Toolbar;
