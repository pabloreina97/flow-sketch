import { BsFileEarmark } from 'react-icons/bs';
import { saveDiagram, loadDiagram } from '../../app/services/fileStorage';

import PropTypes from 'prop-types';

export default function FileMenu({
  setFileName,
  setIsModified,
  setFilteredNodes,
  setFilteredEdges,
  filteredNodes,
  filteredEdges,
  handleMenuToggle,
  setActiveMenu,
  activeMenu,
}) {
  // Guardar un diagrama actual
  const handleSaveDiagram = async () => {
    try {
      const savedFileName = await saveDiagram(filteredNodes, filteredEdges);
      setFileName(savedFileName);
      setIsModified(false);
    } catch (error) {
      console.error('Error al guardar el diagrama:', error);
    }
  };

  // Cargar un diagrama desde un archivo JSON
  const handleLoadDiagram = async () => {
    try {
      const { nodes, edges, name } = await loadDiagram();
      setFilteredNodes(nodes);
      setFilteredEdges(edges);
      setIsModified(false);
      setFileName(name);
    } catch (error) {
      console.error('Error al cargar el diagrama:', error);
    }
  };

  return (
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
              handleLoadDiagram();
              setActiveMenu(null);
            }}
          >
            Abrir diagrama
          </button>
          <button
            className='toolbar-menu-item'
            onClick={() => {
              handleSaveDiagram();
              setActiveMenu(null);
            }}
          >
            Guardar diagrama
          </button>
        </div>
      )}
    </div>
  );
}

FileMenu.propTypes = {
  setFileName: PropTypes.func.isRequired,
  setIsModified: PropTypes.func.isRequired,
  setFilteredNodes: PropTypes.func.isRequired,
  setFilteredEdges: PropTypes.func.isRequired,
  filteredNodes: PropTypes.array.isRequired,
  filteredEdges: PropTypes.array.isRequired,
  handleMenuToggle: PropTypes.func.isRequired,
  setActiveMenu: PropTypes.func.isRequired,
  activeMenu: PropTypes.string,
};
