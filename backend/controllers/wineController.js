const Wine = require('../models/Wine');

// Get wines by category from MongoDB
const getWinesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching wines for category: ${category} from MongoDB`);
    
    const wines = await Wine.find({ category: category });
    
    console.log(`Found ${wines.length} wines`);
    res.json({ data: wines });
  } catch (error) {
    console.error('Error fetching wines:', error.message);
    res.status(500).json({ message: 'Error fetching wines', error: error.message });
  }
};

// Get wine by ID from MongoDB
const getWineById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching wine with ID: ${id} from MongoDB`);
    
    const wine = await Wine.findById(id);
    
    if (wine) {
      console.log(`Found wine: ${wine.wine}`);
      res.json({ data: wine });
    } else {
      res.status(404).json({ message: 'Wine not found' });
    }
  } catch (error) {
    console.error('Error fetching wine:', error.message);
    res.status(500).json({ message: 'Error fetching wine', error: error.message });
  }
};

// Add new wine (admin only)
const addWine = async (req, res) => {
  try {
    const wine = await Wine.create(req.body);
    res.status(201).json({ data: wine });
  } catch (error) {
    console.error('Error adding wine:', error.message);
    res.status(500).json({ message: 'Error adding wine', error: error.message });
  }
};

// Update wine (admin only)
const updateWine = async (req, res) => {
  try {
    const wine = await Wine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (wine) {
      res.json({ data: wine });
    } else {
      res.status(404).json({ message: 'Wine not found' });
    }
  } catch (error) {
    console.error('Error updating wine:', error.message);
    res.status(500).json({ message: 'Error updating wine', error: error.message });
  }
};

// Delete wine (admin only)
const deleteWine = async (req, res) => {
  try {
    const wine = await Wine.findByIdAndDelete(req.params.id);
    if (wine) {
      res.json({ message: 'Wine deleted successfully' });
    } else {
      res.status(404).json({ message: 'Wine not found' });
    }
  } catch (error) {
    console.error('Error deleting wine:', error.message);
    res.status(500).json({ message: 'Error deleting wine', error: error.message });
  }
};

module.exports = { 
  getWinesByCategory, 
  getWineById, 
  addWine, 
  updateWine, 
  deleteWine 
};