import Contact from './components/Contact';
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { authAPI } from './utils/api';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import FarmerDashboard from './components/FarmerDashboard';
import GovernmentDashboard from './components/GovernmentDashboard';
import LandManagement from './components/LandManagement';
import LandDetail from './components/LandDetail';
import Analytics from './components/Analytics';
import DetailedAnalytics from './components/DetailedAnalytics';
import SubsidyApplication from './components/SubsidyApplication';
import EquipmentManagement from './components/EquipmentManagement';

// Feature pages
import LandMonitoring from './components/features/LandMonitoring';
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import CollaborativePlatform from './components/features/CollaborativePlatform';
import RemoteSensingIoT from './components/features/RemoteSensingIoT';
import AIInsights from './components/features/AIInsights';
import Marketplace from './components/Marketplace';
import Footer from './components/Footer';

// Context for authentication
export const AuthContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    // Check localStorage for theme preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  // Apply theme class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // Fetch updated user profile from server
      authAPI.getProfile()
        .then(data => {
          // Update user data in state and localStorage
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          setLoading(false);
        })
        .catch(err => {
          // If there's an error, remove the token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Router>
          <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white dark' : 'bg-white text-black'}`}>
            <Navbar />
            <main className="px-0 py-8 bg-transparent" style={{ minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Protected routes for farmers */}
                {user && user.role === 'farmer' && (
                  <>
                    <Route path="/dashboard" element={<FarmerDashboard />} />
                    <Route path="/land" element={<LandManagement />} />
                    <Route path="/land/:id" element={<LandDetail />} />
                    <Route path="/subsidies/apply" element={<SubsidyApplication />} />
                    <Route path="/equipment" element={<EquipmentManagement />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                  </>
                )}
                {/* Protected routes for government users */}
                {user && user.role === 'government' && (
                  <>
                    <Route path="/dashboard" element={<GovernmentDashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/detailed-analytics" element={<DetailedAnalytics />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                  </>
                )}
                {/* Redirect for unauthorized access to dashboard */}
                {!user && (
                  <>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/land/*" element={<Home />} />
                    <Route path="/subsidies/*" element={<Home />} />
                    <Route path="/equipment/*" element={<Home />} />
                    <Route path="/analytics/*" element={<Home />} />
                    <Route path="/detailed-analytics/*" element={<Home />} />
                  </>
                )}
                {/* Feature detail routes */}
                <Route path="/features/land-monitoring" element={<LandMonitoring />} />
                <Route path="/features/analytics-dashboard" element={<AnalyticsDashboard />} />
                <Route path="/features/collaborative-platform" element={<CollaborativePlatform />} />
                <Route path="/features/remote-sensing-iot" element={<RemoteSensingIoT />} />
                <Route path="/features/ai-insights" element={<AIInsights />} />
                {/* Marketplace public route for unauthenticated users */}
                <Route path="/features/marketplace" element={<Marketplace />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
