import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Added useLocation
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 
import { NotificationProvider } from './context/NotificationContext';

// Customer Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Admin Components
import AdminNavbar from './components/AdminNavbar';
import AdminFooter from './components/AdminFooter';

// Pages
import Home from './pages/Home';
import WineDetail from './pages/WineDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';       
import Register from './pages/Register'; 
import Checkout from './pages/Checkout';
import About from './pages/About';      
import Orders from './pages/Orders';    
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import './App.css';

// We wrap the routing logic in a new component so we can use useLocation
const AppLayout = () => {
  const [activeCategory, setActiveCategory] = useState('reds');
  const location = useLocation();

  // Check if user is currently on an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {/* CONDITIONAL NAVBAR */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}

      <main className="main">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home activeCategory={activeCategory} />} />
          <Route path="/wine/:id" element={<WineDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders" element={<Orders />} />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* CONDITIONAL FOOTER */}
      {isAdminRoute ? <AdminFooter /> : <Footer />}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider> 
      <NotificationProvider> 
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;