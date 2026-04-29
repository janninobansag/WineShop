const API_URL = 'http://localhost:5000/api/wines';
const REVIEWS_URL = 'http://localhost:5000/api/reviews';

// Get wines by category
export const getWinesByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/${category}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch wines');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching wines:', error);
    throw error;
  }
};

// Get wine by ID
export const getWineById = async (id) => {
  if (!id) {
    throw new Error('Wine ID is required');
  }
  
  try {
    const response = await fetch(`${API_URL}/item/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch wine');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching wine by ID:', error);
    throw error;
  }
};

// Get reviews for a wine from MongoDB
export const getReviewsByWine = async (wineId) => {
  try {
    const response = await fetch(`${REVIEWS_URL}/wine/${wineId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return []; // Return empty array on error
  }
};

// Add a review to MongoDB
export const addReview = async (wineId, rating, comment, token) => {
  try {
    const response = await fetch(`${REVIEWS_URL}/${wineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add review');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export default {
  getWinesByCategory,
  getWineById,
  getReviewsByWine,
  addReview,
};