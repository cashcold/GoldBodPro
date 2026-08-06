import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import AuthModals from './components/AuthModals.js';

import HomePage from './pages/HomePage.js';
import AboutPage from './pages/AboutPage.js';
import PlansPage from './pages/PlansPage.js';
import AffiliatePage from './pages/AffiliatePage.js';
import FaqPage from './pages/FaqPage.js';
import BlogPage from './pages/BlogPage.js';
import ContactPage from './pages/ContactPage.js';
import UserDashboardLayout from './pages/dashboard/UserDashboardLayout.js';
import AdminPage from './pages/AdminPage.js';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#090E18] text-white flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/affiliate" element={<AffiliatePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<UserDashboardLayout />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin-portal" element={<AdminPage />} />
              <Route path="/administrator" element={<AdminPage />} />
              <Route path="/dashboard/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
          <AuthModals />
        </div>
      </Router>
    </AuthProvider>
  );
}
