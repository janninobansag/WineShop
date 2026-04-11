import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WineDetail from './pages/WineDetail';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  // Track active category
  const [activeCategory, setActiveCategory] = useState('reds');

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home activeCategory={activeCategory} />} />
              <Route path="/wine/:id" element={<WineDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;