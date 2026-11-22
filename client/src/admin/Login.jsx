import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    error: null,
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: null });

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setStatus({
        submitting: false,
        error: result.message || 'Authentication failed. Please verify credentials.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        {/* Official Brand Logo */}
        <div className="inline-block bg-white p-3.5 rounded-xl shadow-sm border border-gray-200">
          <img
            src="/logo.png"
            alt="GENUGRIN HEALTHCARE"
            className="h-24 sm:h-28 w-auto object-contain mx-auto"
          />
        </div>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#147D55] font-bold">
          Central Administration Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-md rounded-lg border border-gray-200/90 sm:px-10 space-y-6">
          <div className="flex items-center space-x-2 text-xs text-gray-500 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-[#147D55]" />
            <span>Authorized Corporate Staff & Management Access Only</span>
          </div>

          {status.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@genugrinhealthcare.com"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status.submitting}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm text-sm transition-colors disabled:opacity-50"
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-100">
            <p>Developed with precision by Brajwasi's Coders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
