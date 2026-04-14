import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import '../App.css';

const FilterSidebar = ({ onSort, onFilterRating, onFilterPrice, onClearFilters }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (filterType, value) => {
    setActiveFilter(`${filterType}-${value}`);
    if (filterType === 'rating') onFilterRating(value);
    if (filterType === 'price') onFilterPrice(value);
    if (filterType === 'sort') onSort(value); // <-- THIS IS THE LINE THAT WAS MISSING
  };

  const handleClear = () => {
    setActiveFilter(null);
    onClearFilters();
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>
      
      {/* Clear Filters Button */}
      {activeFilter && (
        <button className="clear-filters-btn" onClick={handleClear}>
          Clear Filters ✕
        </button>
      )}

      <div className="filter-section">
        <h4>Customer Rating</h4>
        {[5, 4, 3, 2, 1].map((star) => (
          <button 
            key={star}
            onClick={() => handleFilterClick('rating', star)}
            className={activeFilter === `rating-${star}` ? 'active-filter' : ''}
          >
            <span className="sidebar-stars">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} style={{ color: i < star ? '#C5A059' : '#444' }} />
              ))}
            </span>
            & up
          </button>
        ))}
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <button 
          onClick={() => handleFilterClick('price', 'under25')}
          className={activeFilter === 'price-under25' ? 'active-filter' : ''}
        >
          Under $25
        </button>
        <button 
          onClick={() => handleFilterClick('price', '25to40')}
          className={activeFilter === 'price-25to40' ? 'active-filter' : ''}
        >
          $25 - $40
        </button>
        <button 
          onClick={() => handleFilterClick('price', 'over40')}
          className={activeFilter === 'price-over40' ? 'active-filter' : ''}
        >
          Over $40
        </button>
      </div>

      <div className="filter-section">
        <h4>Sort by Price</h4>
        <button onClick={() => handleFilterClick('sort', 'asc')} className={activeFilter === 'sort-asc' ? 'active-filter' : ''}>
          Low to High
        </button>
        <button onClick={() => handleFilterClick('sort', 'desc')} className={activeFilter === 'sort-desc' ? 'active-filter' : ''}>
          High to Low
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;