const axios = require('axios');
const WINE_API_BASE = process.env.WINE_API_BASE_URL;

// --- Random Generation Helpers (Prices Only) ---
const generateSeed = (id, offset) => ((id * 9301 + 49297 + offset) % 233280) / 233280;

const generateUniformPrice = (id) => {
  const min = 1500; const max = 6000; 
  return (Math.round(min + generateSeed(id, 100) * (max - min)) / 100).toFixed(2);
};

// --- Main Service ---
class WineService {
  static async getWinesByCategory(category) {
    try {
      const validCategories = ['reds', 'whites', 'rose', 'sparkling'];
      if (!validCategories.includes(category)) throw new Error('Invalid category');
      const response = await axios.get(`${WINE_API_BASE}/${category}`);
      
      return response.data.map(wine => ({
        wine: wine.wine,
        winery: wine.winery,
        id: wine.id,
        image: wine.image,
        location: wine.location,
        price: generateUniformPrice(wine.id),
        // Force rating to be 0 so ONLY real user reviews show up
        rating: { average: 0, reviews: 0 } 
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