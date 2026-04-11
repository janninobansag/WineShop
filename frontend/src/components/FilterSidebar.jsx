import React from 'react';
import '../App.css';

const FilterSidebar = ({ onSort, onFilterRating }) => {
  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <h4>Sort by Price</h4>
        <button onClick={() => onSort('asc')}>Low to High</button>
        <button onClick={() => onSort('desc')}>High to Low</button>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        {[4.0, 4.5, 4.7, 4.8].map((rating) => (
          <button key={rating} onClick={() => onFilterRating(rating)}>
            {rating}+ ⭐
          </button>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;