import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Pill, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary-soft text-[#147D55] flex items-center justify-center mx-auto">
          <span className="font-heading font-bold text-2xl">404</span>
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#17324D]">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          The requested pharmaceutical page or directory could not be located on the GENUGRIN
          HEALTHCARE portal.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#147D55] text-white text-xs font-semibold rounded hover:bg-[#0d5c3e] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-gray-50 transition-colors"
          >
            <Pill className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
