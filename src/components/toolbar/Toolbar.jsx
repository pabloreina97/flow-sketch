import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  BsBarChartSteps,
  BsFilter,
  BsInputCursor,
  BsStack,
} from 'react-icons/bs';
import useClickOutside from '../../hooks/useClickOutside';
import FileMenu from './FileMenu';

const Toolbar = ({
  filteredNodes,
  filteredEdges,
  setFilteredNodes,
  setFilteredEdges,
  initialFilter,
  initialVisibleTypes,
  onFilterApply,
  onTypeChange,
  onRecalculatePositions,
  onCreateAnnotationNode,
  fileName,
  setFileName,
  isModified,
  setIsModified,
}) => {
  const [filter, setLocalFilter] = useState(initialFilter);
  const [visibleTypes, setVisibleTypes] = useState(initialVisibleTypes);
  const [activeMenu, setActiveMenu] = useState(null);

  const toolbarRef = useRef(null);
  useClickOutside(toolbarRef, () => setActiveMenu(null));

  const handleMenuToggle = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const handleFilterChange = (e) => setLocalFilter(e.target.value);

  const handleApplyFilter = () => {
    onFilterApply(filter, visibleTypes);
    setActiveMenu(null);
  };

  const handleTypeToggle = (type) => {
    const newTypes = visibleTypes.includes(type)
      ? visibleTypes.filter((t) => t !== type)
      : [...visibleTypes, type];
    setVisibleTypes(newTypes);
    // Notificamos el cambio al hook principal
    onTypeChange(newTypes, filter);
  };

  return (
    <div className='toolbar-container' ref={toolbarRef}>
      <FileMenu
        setFileName={setFileName}
        setIsModified={setIsModified}
        setFilteredNodes={setFilteredNodes}
        setFilteredEdges={setFilteredEdges}
        filteredNodes={filteredNodes}
        filteredEdges={filteredEdges}
        handleMenuToggle={handleMenuToggle}
        setActiveMenu={setActiveMenu}
        activeMenu={activeMenu}
      ></FileMenu>
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
              value={filter}
              onChange={handleFilterChange}
            />
            <button
              onClick={handleApplyFilter}
              className='toolbar-menu-item mt-4'
            >
              Aplicar filtro
            </button>
          </div>
        )}
      </div>

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
                      onChange={() => handleTypeToggle(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={onRecalculatePositions}
        className='toolbar-button'
        title='Reorganizar'
      >
        <BsBarChartSteps />
      </button>

      <button onClick={onCreateAnnotationNode} className='toolbar-button'>
        <BsInputCursor />
      </button>

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
  filteredNodes: PropTypes.array.isRequired,
  filteredEdges: PropTypes.array.isRequired,
  setFilteredNodes: PropTypes.func.isRequired,
  setFilteredEdges: PropTypes.func.isRequired,
  initialFilter: PropTypes.string.isRequired,
  initialVisibleTypes: PropTypes.array.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onRecalculatePositions: PropTypes.func.isRequired,
  onCreateAnnotationNode: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  setFileName: PropTypes.func.isRequired,
  isModified: PropTypes.bool.isRequired,
  setIsModified: PropTypes.func.isRequired,
};

export default Toolbar;
