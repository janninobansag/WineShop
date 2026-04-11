import React from 'react';
import WineCard from './WineCard';
import Loader from './Loader';
import '../App.css';

const WineGrid = ({ wines, loading, error }) => {
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="error-message">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (wines.length === 0) {
    return (
      <div className="no-results">
        <p>🍷 No wines found</p>
      </div>
    );
  }

  return (
    <div className="wine-grid">
      {wines.map((wine) => (
        <WineCard key={wine.id} wine={wine} />
      ))}
    </div>
  );
};

export default WineGrid;