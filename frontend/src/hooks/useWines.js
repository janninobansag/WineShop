import { useState, useCallback } from 'react';
import wineApi from '../services/wineApi';

// Helper to get rating from localStorage for filtering
const getCalculatedRating = (id) => {
  const reviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]');
  if (reviews.length === 0) return 0;
  const avg = reviews.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / reviews.length;
  return parseFloat(avg.toFixed(1));
};

// Helper to get rating from wine object (handles string or number)
const getWineRatingValue = (wine) => {
  // If wine has rating from MongoDB
  if (wine.rating && wine.rating.average) {
    return parseFloat(wine.rating.average);
  }
  // If wine has rating object with average as string
  if (wine.rating && wine.rating.average) {
    return parseFloat(wine.rating.average);
  }
  // Fallback to localStorage reviews
  const reviews = JSON.parse(localStorage.getItem(`reviews_${wine.id}`) || '[]');
  if (reviews.length === 0) return 0;
  const avg = reviews.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / reviews.length;
  return parseFloat(avg.toFixed(1));
};

const useWines = () => {
  const [wines, setWines] = useState([]);       
  const [allWines, setAllWines] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track active filters
  const [activeRating, setActiveRating] = useState(null);
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [activeSort, setActiveSort] = useState(null);
  const [activeSearch, setActiveSearch] = useState('');

  // Apply all filters together
  const applyAllFilters = useCallback((baseWines, rating, priceRange, sort, search) => {
    let result = [...baseWines];
    
    console.log('Applying filters:', { rating, priceRange, sort, search });
    
    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(wine => 
        wine.wine?.toLowerCase().includes(query) ||
        wine.winery?.toLowerCase().includes(query)
      );
    }
    
    // Apply rating filter - FIXED: Compare numbers correctly
    if (rating) {
      result = result.filter(wine => {
        const wineRating = getWineRatingValue(wine);
        console.log(`Wine: ${wine.wine}, Rating: ${wineRating}, Filter: >= ${rating}`);
        return wineRating >= rating;
      });
    }
    
    // Apply price range filter - FIXED: Convert prices to numbers
    if (priceRange) {
      result = result.filter(wine => {
        const price = parseFloat(wine.price) || 0;
        if (priceRange === 'under25') return price < 25;
        if (priceRange === '25to40') return price >= 25 && price <= 40;
        if (priceRange === 'over40') return price > 40;
        return true;
      });
    }
    
    // Apply sort - FIXED: Ensure numeric comparison
    if (sort === 'asc') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    } else if (sort === 'desc') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    }
    
    console.log(`Filtered to ${result.length} wines`);
    return result;
  }, []);

  const fetchByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await wineApi.getWinesByCategory(category);
      setAllWines(data.data);
      
      // Reset filters when changing category
      setActiveRating(null);
      setActivePriceRange(null);
      setActiveSort(null);
      setActiveSearch('');
      
      setWines(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWines = (query) => {
    setActiveSearch(query || '');
    const filtered = applyAllFilters(allWines, activeRating, activePriceRange, activeSort, query || '');
    setWines(filtered);
  };

  const sortByPrice = (order) => {
    setActiveSort(order);
    const filtered = applyAllFilters(allWines, activeRating, activePriceRange, order, activeSearch);
    setWines(filtered);
  };

  const filterByRating = (minStars) => {
    setActiveRating(minStars);
    const filtered = applyAllFilters(allWines, minStars, activePriceRange, activeSort, activeSearch);
    setWines(filtered);
  };

  const filterByPrice = (range) => {
    setActivePriceRange(range);
    const filtered = applyAllFilters(allWines, activeRating, range, activeSort, activeSearch);
    setWines(filtered);
  };

  const clearFilters = () => {
    setActiveRating(null);
    setActivePriceRange(null);
    setActiveSort(null);
    setActiveSearch('');
    setWines(allWines);
  };

  return { 
    wines, 
    loading, 
    error, 
    fetchByCategory, 
    searchWines, 
    sortByPrice, 
    filterByRating, 
    filterByPrice, 
    clearFilters 
  };
};

export default useWines;