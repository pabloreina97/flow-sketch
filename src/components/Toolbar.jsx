import PropTypes from 'prop-types';

const Toolbar = ({
  filter,
  onFilterChange,
  onFilterApply,
  onRecalculatePositions,
  visibleTypes,
  onTypeChange,
  onCreateAnnotationNode,
}) => (
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
    <button
      onClick={onCreateAnnotationNode}
      className='toolbar-container-button'
    >
      Añadir Anotación
    </button>
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

Toolbar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onRecalculatePositions: PropTypes.func.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCreateAnnotationNode: PropTypes.func.isRequired,
};

export default Toolbar;
