// frontend/src/utils/adminSecret.js

// This is the secret code that needs to be entered in the browser console
// Change this to any code you want
const ADMIN_SECRET_CODE = "WineShopAdmin2024";

// Store admin access in session (not localStorage - clears when browser closes)
let adminAccessGranted = false;

// Check if admin access is granted
export const isAdminAccessGranted = () => {
  return adminAccessGranted;
};

// Grant admin access (called from browser console)
export const grantAdminAccess = (code) => {
  if (code === ADMIN_SECRET_CODE) {
    adminAccessGranted = true;
    // Store in sessionStorage so it persists during the session
    sessionStorage.setItem('adminAccess', 'true');
    console.log('%c✅ Admin access granted! You can now login to admin dashboard.', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%c🔄 Go to /admin-login page and login with admin credentials', 'color: blue; font-size: 14px;');
    return true;
  } else {
    console.log('%c❌ Invalid secret code! Access denied.', 'color: red; font-size: 16px; font-weight: bold;');
    return false;
  }
};

// Check session storage on load
export const checkSessionAccess = () => {
  const stored = sessionStorage.getItem('adminAccess');
  if (stored === 'true') {
    adminAccessGranted = true;
  }
  return adminAccessGranted;
};

// Revoke admin access
export const revokeAdminAccess = () => {
  adminAccessGranted = false;
  sessionStorage.removeItem('adminAccess');
  console.log('Admin access revoked');
};

// Make grantAdminAccess available globally for console access
if (typeof window !== 'undefined') {
  window.grantAdminAccess = grantAdminAccess;
  console.log('%c🔐 Admin Access System Ready!', 'color: purple; font-size: 14px; font-weight: bold;');
  console.log('%cType: grantAdminAccess("WineShopAdmin2024") to get admin access', 'color: yellow; font-size: 12px;');
}