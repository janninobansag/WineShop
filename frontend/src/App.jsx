import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // <-- Added Auth
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WineDetail from './pages/WineDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';       // <-- Added
import Register from './pages/Register'; // <-- Added
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('reds');

  return (
    <AuthProvider> {/* <-- Wrapped everything in Auth */}
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <main className="main">
              <Routes>
                <Route path="/" element={<Home activeCategory={activeCategory} />} />
                <Route path="/wine/:id" element={<WineDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;