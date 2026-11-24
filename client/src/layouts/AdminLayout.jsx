import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Layers,
  Inbox,
  Building,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#147D55] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 font-medium">Validating admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Product Catalogue', path: '/admin/products', icon: Pill },
    { name: 'Therapeutic Segments', path: '/admin/categories', icon: Layers },
    { name: 'Enquiry Management', path: '/admin/enquiries', icon: Inbox },
    { name: 'Company Profile', path: '/admin/settings', icon: Building },
    { name: 'Security & Profile', path: '/admin/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F6] flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#17324D] text-white flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-[#102336] border-b border-navy-light/40">
          <Link to="/admin/dashboard" className="flex items-center space-x-2.5">
            <img
              src="/logo-emblem.png"
              alt="GENUGRIN"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div>
              <span className="font-heading font-black text-base tracking-tight leading-none block">
                <span className="text-[#4fa2ea]">GENU</span>
                <span className="text-[#4CA536]">GRIN</span>
              </span>
              <span className="text-[8px] tracking-[0.2em] font-bold text-accent uppercase block mt-0.5 leading-none">
                ADMIN PORTAL
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#147D55] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-navy-light/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-accent" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Footer in Sidebar */}
        <div className="p-4 bg-[#102336] border-t border-navy-light/40">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-600 flex items-center justify-center font-bold text-xs">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{admin?.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 rounded text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-[#147D55]" />
              <span>Secure Session: {admin?.role?.toUpperCase() || 'ADMIN'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#147D55] hover:text-[#0d5c3e] bg-primary-soft hover:bg-accent/30 px-3 py-1.5 rounded transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-[#17324D]">{admin?.name}</p>
              <p className="text-[10px] text-gray-500">Administrator</p>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
