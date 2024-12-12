import React from 'react';
import PropTypes from 'prop-types';
import FilterInput from './FilterInput';

const Toolbar = ({
  filter,
  onFilterChange,
  onFilterApply,
  onRecalculatePositions,
  visibleTypes,
  onTypeChange,
}) => (
  <div className="toolbar-container">
    <input
      type="text"
      value={filter}
      onChange={onFilterChange}
      placeholder="Filtrar por modelo"
      className="text-sm p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500"
    />
    <button
      onClick={onFilterApply}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg px-4 py-2 hover:shadow-lg"
    >
      Actualizar
    </button>
    <button
      onClick={onRecalculatePositions}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg px-4 py-2 hover:shadow-lg"
    >
      Recalcular
    </button>
    {['model', 'seed', 'source', 'test'].map((type) => (
      <label key={type} className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          checked={visibleTypes.includes(type)}
          onChange={() => onTypeChange(type)}
          className="accent-blue-500"
        />
        <span className="text-white">{type}</span>
      </label>
    ))}
  </div>
);

Toolbar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default Toolbar;
