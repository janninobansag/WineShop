const axios = require('axios');
const WINE_API_BASE = process.env.WINE_API_BASE_URL;

// Seeded random generator so numbers stay consistent on refresh
const generateSeed = (id, offset) => {
  return ((id * 9301 + 49297 + offset) % 233280) / 233280;
};

const generateUniformPrice = (id) => {
  const min = 1500; const max = 6000; 
  const random = generateSeed(id, 100);
  return (Math.round(min + random * (max - min)) / 100).toFixed(2);
};

const generateRandomRating = (id) => {
  // Generates a rating between 4.2 and 4.9
  const min = 42; const max = 49; 
  const random = generateSeed(id, 200);
  return (Math.round(min + random * (max - min)) / 10).toFixed(1);
};

const generateRandomReviews = (id) => {
  // Generates reviews between 50 and 1200
  const min = 50; const max = 1200; 
  const random = generateSeed(id, 300);
  return Math.floor(min + random * (max - min));
};

class WineService {
  static async getWinesByCategory(category) {
    try {
      const validCategories = ['reds', 'whites', 'rose', 'sparkling'];
      if (!validCategories.includes(category)) throw new Error('Invalid category');

      const response = await axios.get(`${WINE_API_BASE}/${category}`);
      
      return response.data.map(wine => ({
        ...wine,
        price: generateUniformPrice(wine.id),
        rating: {
          average: generateRandomRating(wine.id),
          reviews: generateRandomReviews(wine.id)
        }
      }));
    } catch (error) {
      throw new Error(`Failed to fetch ${category}: ${error.message}`);
    }
  }

  static async getWineById(id) {
    const categories = ['reds', 'whites', 'rose', 'sparkling'];
    for (const cat of categories) {
      const wines = await this.getWinesByCategory(cat);
      const wine = wines.find(w => w.id === parseInt(id));
      if (wine) return wine;
    }
    throw new Error('Wine not found');
  }
}

module.exports = WineService;