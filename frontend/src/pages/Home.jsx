import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import WineGrid from '../components/WineGrid';
import useWines from '../hooks/useWines';
import '../App.css';

const Home = ({ activeCategory }) => {
  const { wines, loading, error, fetchByCategory, searchWines, sortByPrice, filterByRating, filterByPrice, clearFilters } = useWines();
  
  const [currentPage, setCurrentPage] = useState(1);
  const winesPerPage = 12;

  useEffect(() => {
    fetchByCategory(activeCategory);
    setCurrentPage(1);
  }, [activeCategory, fetchByCategory]);

  // SAFETY: Ensure wines is always an array
  const safeWines = Array.isArray(wines) ? wines : [];
  
  useEffect(() => {
    setCurrentPage(1);
  }, [safeWines.length]);

  // Pagination Math
  const totalPages = Math.ceil(safeWines.length / winesPerPage);
  const indexOfLastWine = currentPage * winesPerPage;
  const indexOfFirstWine = indexOfLastWine - winesPerPage;
  const currentWines = safeWines.slice(indexOfFirstWine, indexOfLastWine);

  const categoryTitle = activeCategory?.charAt(0).toUpperCase() + activeCategory?.slice(1) || 'Wines';

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-num-btn ${currentPage === i ? 'active-page' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Premium {categoryTitle} Wines</h1>
        <p>Discover our curated collection of finest {categoryTitle}</p>
        <SearchBar onSearch={searchWines} />
      </div>

      <div className="main-content">
        <FilterSidebar 
          onSort={sortByPrice} 
          onFilterRating={filterByRating} 
          onFilterPrice={filterByPrice}
          onClearFilters={clearFilters}
        />
        
        <div className="wines-section">
          <p className="results-count">{safeWines.length} wines found</p>
          
          <WineGrid wines={currentWines} loading={loading} error={error} />
          
          {/* Pagination Buttons */}
          {!loading && !error && totalPages > 1 && (
            <div className="pagination-container">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn prev-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {renderPageNumbers()}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn next-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;