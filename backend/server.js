const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Updated CORS to accept all frontend environments
app.use(cors({ 
  origin: [
    'http://localhost:3000',           // Standard React/Next.js port
    'http://localhost:5173',           // Vite default port
    'https://wineshopily.netlify.app', // Live production frontend
    'https://deploy-preview-25--wineshopily.netlify.app', // Specific preview
    'https://*.netlify.app'            // All Netlify preview URLs
  ], 
  credentials: true 
}));
app.use(express.json());

// TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'WineShop API is running!', status: 'online' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route works!', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wines', require('./routes/wineRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});