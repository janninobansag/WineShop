import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../App.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search wines, wineries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button type="button" className="clear-btn" onClick={handleClear}>
          ✕
        </button>
      )}
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;