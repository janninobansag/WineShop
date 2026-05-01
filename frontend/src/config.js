// frontend/src/config.js
const isLocal = window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';

export const API_URL = isLocal 
  ? 'http://localhost:5000/api'
  : 'https://wineshop-api.onrender.com/api';

export default { API_URL };