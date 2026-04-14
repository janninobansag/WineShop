1. Install Backend Dependencies
cd WineShop/backend
npm install

2. Install Frontend Dependencies
cd ../frontend
npm install

File 1: backend/.env

 # API Configuration
WINE_API_BASE_URL=https://api.sampleapis.com/wines
WINE_API_REDS=${WINE_API_BASE_URL}/reds
WINE_API_WHITES=${WINE_API_BASE_URL}/whites
WINE_API_ROSE=${WINE_API_BASE_URL}/rose
WINE_API_SPARKLING=${WINE_API_BASE_URL}/sparkling

# Server Configuration
PORT=5000
NODE_ENV=development

File 2: frontend/.env
REACT_APP_API_URL=http://localhost:5000/api


AFTER INSTALLING AND STTING UP ALL OF THEN:

step 1: open new terminal and type this
cd backend
npm start

step 2: open new terminal and type this
cd frontend
npm start


TO OPEN AMIN ACCOUNT
http://localhost:3000/admin

-make sure to add /admin to the end of the url

admin username: admin@wineshop.com
admin password: admin123


andrie gwapoo