// frontend/src/components/WineGrid.jsx
import React from 'react';
import FlipWineCard from './FlipWineCard';
import Loader from './Loader';

const WineGrid = ({ wines, loading, error }) => {
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="error-message">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!wines || wines.length === 0) {
    return (
      <div className="no-results">
        <p>🍷 No wines found</p>
      </div>
    );
  }

  return (
    <div className="wine-grid">
      {wines.map((wine) => (
        <FlipWineCard key={wine.id} wine={wine} />
      ))}
    </div>
  );
};

export default WineGrid;