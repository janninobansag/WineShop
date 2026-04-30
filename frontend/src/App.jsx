import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 
import { NotificationProvider } from './context/NotificationContext';
import AdminRoute from './components/AdminRoute';
import './utils/adminSecret';
import OrderDetail from './pages/OrderDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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

const AppLayout = () => {
  const [activeCategory, setActiveCategory] = useState('reds');
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
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
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isAdminRoute ? <AdminFooter /> : <Footer />}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

// Main App component - Add future flags to fix warnings
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;