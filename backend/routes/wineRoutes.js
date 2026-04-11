const express = require('express');
const router = express.Router();
const { getWinesByCategory, getWineById } = require('../controllers/wineController');

// Changed ID route to /item/:id so it doesn't conflict with /:category
router.get('/:category', getWinesByCategory);
router.get('/item/:id', getWineById);

module.exports = router;