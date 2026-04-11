
const WineService = require('../services/wineService');

const getWinesByCategory = async (req, res, next) => {
  try {
    const wines = await WineService.getWinesByCategory(req.params.category);
    res.json({ success: true, count: wines.length, data: wines });
  } catch (error) {
    next(error);
  }
};

const getWineById = async (req, res, next) => {
  try {
    const wine = await WineService.getWineById(req.params.id);
    res.json({ success: true, data: wine });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWinesByCategory, getWineById };