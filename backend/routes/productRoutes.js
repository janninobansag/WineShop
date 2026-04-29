const express = require('express');
const router = express.Router();

// Since you're using SampleAPI for wines, product routes can be simple
router.get('/', (req, res) => {
  res.json({ 
    message: 'Use /api/wines endpoint for wine products',
    wines_endpoint: '/api/wines/reds',
    whites_endpoint: '/api/wines/whites',
    rose_endpoint: '/api/wines/rose',
    sparkling_endpoint: '/api/wines/sparkling'
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    message: `Product ${req.params.id} - Use /api/wines/item/${req.params.id} for wine details`
  });
});

module.exports = router;