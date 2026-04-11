import { useState, useCallback } from 'react';
import wineApi from '../services/wineApi';

const useWines = () => {
  const [wines, setWines] = useState([]);       // What user sees (filtered/sorted)
  const [allWines, setAllWines] = useState([]); // Original full list from API
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

  // Instant frontend search
  const searchWines = (query) => {
    if (!query) { setWines(allWines); return; }
    const filtered = allWines.filter(wine => 
      wine.wine.toLowerCase().includes(query.toLowerCase()) ||
      wine.winery.toLowerCase().includes(query.toLowerCase())
    );
    setWines(filtered);
  };

  // Instant frontend sort
  const sortByPrice = (order) => {
    const sorted = [...allWines].sort((a, b) => {
      return order === 'asc' 
        ? parseFloat(a.price) - parseFloat(b.price) 
        : parseFloat(b.price) - parseFloat(a.price);
    });
    setWines(sorted);
  };

  // Instant frontend filter
  const filterByRating = (minRating) => {
    const filtered = allWines.filter(wine => {
      return parseFloat(wine.rating?.average) >= parseFloat(minRating);
    });
    setWines(filtered);
  };

  return { wines, loading, error, fetchByCategory, searchWines, sortByPrice, filterByRating };
};

export default useWines;