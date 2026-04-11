import React, { useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import WineGrid from '../components/WineGrid';
import useWines from '../hooks/useWines';
import '../App.css';

const Home = ({ activeCategory }) => {
  const { wines, loading, error, fetchByCategory, searchWines, sortByPrice, filterByRating } = useWines();

  // Re-fetch when category changes
  useEffect(() => {
    fetchByCategory(activeCategory);
  }, [activeCategory, fetchByCategory]);

  const categoryTitle = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Premium {categoryTitle} Wines</h1>
        <p>Discover our curated collection of finest {categoryTitle}</p>
        <SearchBar onSearch={searchWines} />
      </div>

      <div className="main-content">
        <FilterSidebar onSort={sortByPrice} onFilterRating={filterByRating} />
        <div className="wines-section">
          <p className="results-count">{wines.length} wines found</p>
          <WineGrid wines={wines} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Home;