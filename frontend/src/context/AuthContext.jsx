import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper to get our "Mock Database" from LocalStorage
const getMockDB = () => {
  const users = localStorage.getItem('wineShopUsers');
  return users ? JSON.parse(users) : [];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wineShopUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (email, password) => {
    const db = getMockDB();
    
    // 1. Check if email exists
    const foundUser = db.find(u => u.email === email);
    if (!foundUser) {
      return { success: false, message: "No account found with this email. Please register first." };
    }

    // 2. Check if password matches
    if (foundUser.password !== password) {
      return { success: false, message: "Incorrect password." };
    }

    // 3. Success! Log them in
    const loggedInUser = { name: foundUser.name, email: foundUser.email };
    localStorage.setItem('wineShopUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return { success: true };
  };

  const registerUser = (name, email, password) => {
    const db = getMockDB();
    
    // 1. Check if email is already taken
    if (db.find(u => u.email === email)) {
      return { success: false, message: "An account with this email already exists." };
    }

    // 2. Save new user to "Mock Database"
    const newUser = { name, email, password };
    db.push(newUser);
    localStorage.setItem('wineShopUsers', JSON.stringify(db));

    // 3. Log them in automatically
    const loggedInUser = { name, email };
    localStorage.setItem('wineShopUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return { success: true };
  };

  const logoutUser = () => {
    localStorage.removeItem('wineShopUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;