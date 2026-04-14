import { useState, useCallback } from 'react';
import wineApi from '../services/wineApi';

// Helper to get rating from LocalStorage for filtering
const getCalculatedRating = (id) => {
  const reviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]');
  if (reviews.length === 0) return 0;
  return Math.min(5, reviews.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / reviews.length);
};

const useWines = () => {
  const [wines, setWines] = useState([]);       
  const [allWines, setAllWines] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await wineApi.getWinesByCategory(category);
      setAllWines(data.data);
      setWines(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWines = (query) => {
    if (!query) { setWines(allWines); return; }
    const filtered = allWines.filter(wine => 
      wine.wine.toLowerCase().includes(query.toLowerCase()) ||
      wine.winery.toLowerCase().includes(query.toLowerCase())
    );
    setWines(filtered);
  };

  // FIXED: Sort by price - now sorts the current filtered wines (wines) instead of allWines
  const sortByPrice = (order) => {
    const sorted = [...wines].sort((a, b) => {
      return order === 'asc' 
        ? parseFloat(a.price) - parseFloat(b.price) 
        : parseFloat(b.price) - parseFloat(a.price);
    });
    setWines(sorted);
  };

  // Filter by real user rating
  const filterByRating = (minStars) => {
    const filtered = allWines.filter(wine => getCalculatedRating(wine.id) >= minStars);
    setWines(filtered);
  };

  // Filter by price range
  const filterByPrice = (range) => {
    let filtered = [...allWines];
    if (range === 'under25') filtered = filtered.filter(w => parseFloat(w.price) < 25);
    else if (range === '25to40') filtered = filtered.filter(w => parseFloat(w.price) >= 25 && parseFloat(w.price) <= 40);
    else if (range === 'over40') filtered = filtered.filter(w => parseFloat(w.price) > 40);
    setWines(filtered);
  };

  // Reset all filters
  const clearFilters = () => {
    setWines(allWines);
  };

  return { wines, loading, error, fetchByCategory, searchWines, sortByPrice, filterByRating, filterByPrice, clearFilters };
};

export default useWines;