 require('dotenv').config();
const express = require('express');
const cors = require('cors');
const wineRoutes = require('./routes/wineRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wines', wineRoutes);

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
