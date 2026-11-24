import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Send,
  Building2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings, openEnquiryModal } = useSettings();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Therapeutic Segments', path: '/therapeutic-segments' },
    { name: 'Quality Assurance', path: '/quality-assurance' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-white transition-shadow duration-200">
      {/* Top Corporate Contact Bar */}
      <div className="bg-[#17324D] text-white text-xs py-2 px-4 border-b border-navy-light/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href={`tel:${settings.phone || '+91 98765 43210'}`}
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>{settings.phone || '+91 98765 43210'}</span>
            </a>
            <a
              href={`mailto:${settings.email || 'info@genugrinhealthcare.com'}`}
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>{settings.email || 'info@genugrinhealthcare.com'}</span>
            </a>
            <div className="flex items-center space-x-1.5 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>{settings.businessHours || 'Mon – Sat: 9:00 AM – 6:30 PM'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality Assured Formulations</span>
            </span>
            <span className="text-gray-400">|</span>
            <Link
              to="/admin/login"
              className="text-gray-300 hover:text-white transition-colors text-[11px] underline underline-offset-2"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`bg-white border-b border-gray-200/80 transition-all duration-200 ${
          scrolled ? 'shadow-md py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group py-1">
            <img
              src="/logo-emblem.png"
              alt="GENUGRIN HEALTHCARE Emblem"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight leading-none">
                <span className="text-[#184B96]">GENU</span>
                <span className="text-[#4CA536]">GRIN</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.24em] font-bold text-gray-700 uppercase mt-0.5 leading-none">
                HEALTHCARE
              </span>
              <span className="text-[8px] text-gray-500 font-medium tracking-tight mt-0.5 hidden sm:block">
                Trusted Quality, Healthier Tomorrow.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'text-[#147D55] bg-primary-soft font-semibold'
                      : 'text-[#252D35] hover:text-[#147D55] hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => openEnquiryModal()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-sm font-semibold rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#147D55] focus:ring-offset-2"
            >
              <Send className="w-4 h-4 text-accent" />
              <span>Make Enquiry</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => openEnquiryModal()}
              className="p-2 text-[#147D55] bg-primary-soft rounded-md sm:hidden"
              title="Enquire"
            >
              <Send className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#17324D] hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-base font-medium rounded-md ${
                  isActive
                    ? 'text-[#147D55] bg-primary-soft font-semibold'
                    : 'text-[#252D35] hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#147D55] text-white font-semibold rounded-md shadow-sm"
            >
              <Send className="w-4 h-4 text-accent" />
              <span>Make Business Enquiry</span>
            </button>
            <div className="text-xs text-gray-500 pt-2 px-1 space-y-1">
              <p>Email: {settings.email}</p>
              <p>Phone: {settings.phone}</p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-[#17324D] text-sm font-semibold rounded-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Staff Portal / Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
