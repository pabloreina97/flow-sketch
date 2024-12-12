import React from 'react';
import FilterInput from './FilterInput';

const Toolbar = ({ filter, onFilterChange, onFilterApply }) => (
  <div>
    <FilterInput
      filter={filter}
      onFilterChange={onFilterChange}
      onFilterApply={onFilterApply}
    />
  </div>
);

export default Toolbar;
