import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { enquiryService } from '../services/api';

const Contact = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    phone: '',
    subject: '',
    enquiryType: 'General Enquiry',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null, message: '' });

    try {
      const res = await enquiryService.submit(formData);
      if (res.data?.success) {
        setStatus({
          submitting: false,
          success: true,
          error: null,
          message:
            res.data.message ||
            'Your enquiry has been successfully logged. Our corporate representative will get in touch shortly.',
        });
        setFormData({
          fullName: '',
          organization: '',
          email: '',
          phone: '',
          subject: '',
          enquiryType: 'General Enquiry',
          message: '',
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Unable to process enquiry at this time. Please check your inputs or contact us directly by telephone.';
      setStatus({
        submitting: false,
        success: false,
        error: msg,
        message: '',
      });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="bg-[#17324D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Corporate Communications
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">Contact Us</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Connect with GENUGRIN HEALTHCARE for trade distribution, institutional procurement,
            regulatory enquiries, or clinical partnerships.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="section-subtitle">Headquarters</span>
              <h2 className="text-2xl font-bold font-heading text-[#17324D]">
                Registered Office & Support
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Our central corporate administration is available during standard business hours to
                assist institutional partners, stockists, and medical professionals.
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                <div className="w-10 h-10 rounded-md bg-primary-soft text-[#147D55] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-[#17324D]">Registered Address</h4>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {settings.registeredAddress}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                <div className="w-10 h-10 rounded-md bg-primary-soft text-[#147D55] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-[#17324D]">Direct Phone Lines</h4>
                  <p className="text-gray-600 mt-0.5">
                    Primary: <a href={`tel:${settings.phone}`} className="text-[#147D55] font-semibold">{settings.phone}</a>
                  </p>
                  {settings.alternatePhone && (
                    <p className="text-gray-600">
                      Alternate: <a href={`tel:${settings.alternatePhone}`} className="text-gray-800">{settings.alternatePhone}</a>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                <div className="w-10 h-10 rounded-md bg-primary-soft text-[#147D55] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-[#17324D]">Official Email Addresses</h4>
                  <p className="text-gray-600 mt-0.5">
                    General Enquiries: <a href={`mailto:${settings.email}`} className="text-[#147D55] font-semibold">{settings.email}</a>
                  </p>
                  {settings.supportEmail && (
                    <p className="text-gray-600">
                      Technical / Support: <a href={`mailto:${settings.supportEmail}`} className="text-gray-800">{settings.supportEmail}</a>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                <div className="w-10 h-10 rounded-md bg-primary-soft text-[#147D55] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-[#17324D]">Operating Hours</h4>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {settings.businessHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Statutory Notice */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-[#147D55] shrink-0 mt-0.5" />
              <p>
                Distribution partnerships are offered strictly to verified pharmaceutical stockists,
                carrying valid State Drug Licenses (Form 20B/21B) and GSTIN registrations.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#17324D]">
                  Transmit Business Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Complete the official communication form below. All queries are recorded in our
                  central registry and allocated to the designated representative.
                </p>
              </div>

              {status.success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-start space-x-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Transmission Successful</p>
                    <p className="text-xs mt-0.5">{status.message}</p>
                  </div>
                </div>
              )}

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start space-x-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Submission Error</p>
                    <p className="text-xs mt-0.5">{status.error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Company / Medical Center
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Organization or Pharmacy Name"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="official@domain.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Phone / Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Enquiry Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    >
                      <option value="General Enquiry">General Corporate Enquiry</option>
                      <option value="Product Enquiry">Product Specification Enquiry</option>
                      <option value="Business Partnership">Hospital / Institutional Tie-up</option>
                      <option value="Distribution Enquiry">Distributorship / Stockist Franchise</option>
                      <option value="Other">Other Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Distribution inquiry for District"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide detailed information regarding your inquiry, drug requirements, or trade territory..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm text-sm transition-colors disabled:opacity-50"
                  >
                    {status.submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        <span>Transmitting Record...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-accent" />
                        <span>Submit Corporate Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
