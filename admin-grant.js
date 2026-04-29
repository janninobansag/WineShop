// Copy and paste this in the browser console (F12) to get admin access

// The secret code (change this to whatever you want)
const ADMIN_SECRET = "WineShopAdmin2024";

// Function to grant admin access
function grantAdminAccess(code) {
  if (code === ADMIN_SECRET) {
    sessionStorage.setItem('adminAccess', 'true');
    console.log('%c✅ Admin access granted! You can now login to admin dashboard.', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%c🔄 Refresh the page and go to /admin/login', 'color: blue; font-size: 14px;');
    return true;
  } else {
    console.log('%c❌ Invalid secret code! Access denied.', 'color: red; font-size: 16px; font-weight: bold;');
    return false;
  }
}

// Also expose it globally
window.grantAdminAccess = grantAdminAccess;

console.log('%c🔐 Admin Access System Ready!', 'color: purple; font-size: 14px; font-weight: bold;');
console.log('%cType: grantAdminAccess("WineShopAdmin2024") to get admin access', 'color: yellow; font-size: 12px;');