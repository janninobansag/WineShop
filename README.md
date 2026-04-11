1. Install Backend Dependencies
cd WineShop/backend
npm install

2. Install Frontend Dependencies
cd ../frontend
npm install

File 1: backend/.env

WINE_API_BASE_URL=https://api.sampleapis.com/wines
PORT=5000
NODE_ENV=development

File 2: frontend/.env
REACT_APP_API_URL=http://localhost:5000/api