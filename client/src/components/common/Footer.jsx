import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Heart,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products Catalogue', path: '/products' },
    { name: 'Therapeutic Segments', path: '/therapeutic-segments' },
    { name: 'Quality Assurance', path: '/quality-assurance' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Staff Portal', path: '/admin/login' },
  ];

  const segments = [
    { name: 'Anti-Infective & Antibiotics', slug: 'anti-infective-antibiotics' },
    { name: 'Cardiovascular Formulations', slug: 'cardiovascular-anti-hypertensive' },
    { name: 'Gastrointestinal Range', slug: 'gastrointestinal-hepato-protective' },
    { name: 'Pain Management & NSAIDs', slug: 'pain-management-analgesics' },
    { name: 'Respiratory & Anti-Allergic', slug: 'respiratory-anti-allergic' },
    { name: 'Nutraceutical Formulations', slug: 'nutraceuticals-antioxidants' },
  ];

  return (
    <footer className="bg-[#17324D] text-gray-300 border-t border-navy-light/60">
      {/* Upper Footer: Brand and Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Introduction */}
          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white p-2.5 rounded-lg shadow-sm border border-white/20 hover:opacity-95 transition-opacity">
              <img
                src="/logo.png"
                alt="GENUGRIN HEALTHCARE"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              GENUGRIN HEALTHCARE is a dedicated pharmaceutical formulation enterprise committed to
              delivering quality-assured therapeutic solutions. Trusted Quality, Healthier Tomorrow.
            </p>
            <div className="pt-2">
              <div className="flex items-center space-x-3">
                {settings.socialLinks?.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-navy-light/60 hover:bg-[#147D55] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.twitter && (
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-navy-light/60 hover:bg-[#147D55] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-navy-light/60 hover:bg-[#147D55] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-navy-light/60 hover:bg-[#147D55] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 pb-1 border-b border-navy-light inline-block">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-accent transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#147D55]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Therapeutic Segments */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 pb-1 border-b border-navy-light inline-block">
              Therapeutic Portfolios
            </h3>
            <ul className="space-y-2.5 text-sm">
              {segments.map((seg) => (
                <li key={seg.slug}>
                  <Link
                    to={`/products?category=${seg.slug}`}
                    className="hover:text-accent transition-colors flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#147D55]"></span>
                    <span>{seg.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Office & Contact */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base mb-4 pb-1 border-b border-navy-light inline-block">
              Corporate Office
            </h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
              <p className="leading-snug">{settings.registeredAddress}</p>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                {settings.email}
              </a>
            </div>
            <div className="flex items-start space-x-3 text-sm pt-1">
              <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">{settings.businessHours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Prescription & Medical Disclaimer */}
      <div className="bg-[#102336] py-4 px-4 border-t border-navy-light/40">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs text-gray-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-300">Statutory Notice: </strong>
            {settings.disclaimerText}
          </p>
        </div>
      </div>

      {/* Copyright & Developer Credits */}
      <div className="bg-[#0b1724] py-5 px-4 text-xs text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>
            © {new Date().getFullYear()} <strong className="text-gray-200">GENUGRIN HEALTHCARE</strong>. All
            Rights Reserved.
          </p>
          <div className="flex items-center space-x-2 text-gray-300">
            <span>Crafted with precision by</span>
            <span className="font-semibold text-emerald-400 tracking-wide">
              Brajwasi's Coders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
