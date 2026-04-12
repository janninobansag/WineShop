import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const getMockDB = () => {
  const users = localStorage.getItem('wineShopUsers');
  return users ? JSON.parse(users) : [];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wineShopUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Normal User Login
  const loginUser = (email, password) => {
    const db = getMockDB();
    const foundUser = db.find(u => u.email === email);
    
    if (!foundUser) return { success: false, message: "No account found with this email." };
    if (foundUser.password !== password) return { success: false, message: "Incorrect password." };
    
    // NEW: Block admins from using the normal login
    if (foundUser.role === 'admin') {
      return { success: false, message: "Admins must log in via the Admin Portal." };
    }

    const loggedInUser = { name: foundUser.name, email: foundUser.email };
    localStorage.setItem('wineShopUser', JSON.stringify(loggedInUser));
    localStorage.removeItem('isAdmin'); // Ensure they are not flagged as admin
    setUser(loggedInUser);
    return { success: true };
  };

  // Normal User Register
  const registerUser = (name, email, password) => {
    const db = getMockDB();
    if (db.find(u => u.email === email)) return { success: false, message: "An account with this email already exists." };

    const newUser = { name, email, password, role: 'user' };
    db.push(newUser);
    localStorage.setItem('wineShopUsers', JSON.stringify(db));

    const loggedInUser = { name, email };
    localStorage.setItem('wineShopUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return { success: true };
  };

  // Admin Login
  const loginAdmin = (email, password) => {
    const db = getMockDB();
    const foundUser = db.find(u => u.email === email);

    if (!foundUser) return { success: false, message: "Account not found." };
    if (foundUser.password !== password) return { success: false, message: "Incorrect password." };
    
    // NEW: Block normal users from using the admin login
    if (foundUser.role !== 'admin') {
      return { success: false, message: "Access Denied. This account does not have admin privileges." };
    }

    const loggedInUser = { name: foundUser.name, email: foundUser.email };
    localStorage.setItem('wineShopUser', JSON.stringify(loggedInUser));
    localStorage.setItem('isAdmin', 'true');
    setUser(loggedInUser);
    return { success: true };
  };

  const logoutUser = () => {
    localStorage.removeItem('wineShopUser');
    localStorage.removeItem('isAdmin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, loginAdmin, logoutUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};