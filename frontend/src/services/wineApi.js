const API_URL = process.env.REACT_APP_API_URL;

const wineApi = {
  getWinesByCategory: async (category) => {
    const response = await fetch(`${API_URL}/wines/${category}`);
    if (!response.ok) throw new Error('Failed to fetch wines');
    return response.json();
  },

  getWineById: async (id) => {
    const response = await fetch(`${API_URL}/wines/item/${id}`);
    if (!response.ok) throw new Error('Wine not found');
    return response.json();
  },
};

export default wineApi;