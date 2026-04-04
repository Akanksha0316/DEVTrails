import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PoliciesPage from './pages/PoliciesPage';
import ClaimsPage from './pages/ClaimsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LedgerPage from './pages/LedgerPage';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/auth" element={!user ? <AuthPage login={login} /> : <Navigate to="/dashboard" />} />
        <Route path="/ledger" element={<LedgerPage user={user} />} />
        
        <Route element={<Layout user={user} logout={logout} />}>
            <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
            <Route path="/policies" element={<PoliciesPage user={user} token={token} />} />
            <Route path="/claims" element={<ClaimsPage user={user} token={token} />} />
            <Route path="/analytics" element={<AnalyticsPage user={user} token={token} />} />
            <Route path="/profile" element={<ProfilePage user={user} token={token} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
