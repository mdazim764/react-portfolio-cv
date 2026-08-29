import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// We will build these files in the next step!
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if we already have the VIP Wristband (Token)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    // BrowserRouter wraps the app to enable URL routing
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTE: The main portfolio page */}
        <Route path="/" element={<Portfolio />} />
        
        {/* LOGIN ROUTE: The Admin lock screen */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AdminLogin setAuth={setIsAuthenticated} />} 
        />
        
        {/* PROTECTED ROUTE: The Admin Workspace (CRUD + Resume Builder) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <AdminDashboard setAuth={setIsAuthenticated} /> : <Navigate to="/admin" />} 
        />

        {/* 404 ROUTE: Catch anyone going to a weird URL */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;