import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Global Components
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Preloader from './components/common/Preloader';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import TherapeuticSegments from './pages/TherapeuticSegments';
import QualityAssurance from './pages/QualityAssurance';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProductsList from './admin/ProductsList';
import ProductForm from './admin/ProductForm';
import CategoriesList from './admin/CategoriesList';
import EnquiriesList from './admin/EnquiriesList';
import ContentManagement from './admin/ContentManagement';
import CompanySettings from './admin/CompanySettings';
import ProfileSettings from './admin/ProfileSettings';

function App() {
  return (
    <>
      <Preloader />
      <Routes>
      {/* Public Corporate Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="therapeutic-segments" element={<TherapeuticSegments />} />
        <Route path="quality-assurance" element={<QualityAssurance />} />
        <Route path="contact" element={<Contact />} />
        <Route path="404" element={<NotFound />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Protected Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="enquiries" element={<EnquiriesList />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="settings" element={<CompanySettings />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>

      {/* Catch-all Wildcard Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  );
}

export default App;
