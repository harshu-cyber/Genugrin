import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Pill } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { enquiryService } from '../../services/api';

const EnquiryModal = () => {
  const { enquiryModalOpen, enquiryProductData, closeEnquiryModal } = useSettings();

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

  useEffect(() => {
    if (enquiryProductData) {
      setFormData((prev) => ({
        ...prev,
        enquiryType: 'Product Enquiry',
        subject: `Product Enquiry: ${enquiryProductData.name} (${enquiryProductData.composition || ''})`,
        productId: enquiryProductData._id,
        productName: enquiryProductData.name,
      }));
    } else {
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
    setStatus({ submitting: false, success: false, error: null, message: '' });
  }, [enquiryProductData, enquiryModalOpen]);

  if (!enquiryModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null, message: '' });

    try {
      const payload = {
        ...formData,
        ...(enquiryProductData && {
          productId: enquiryProductData._id,
          productName: enquiryProductData.name,
        }),
      };

      const res = await enquiryService.submit(payload);

      if (res.data?.success) {
        setStatus({
          submitting: false,
          success: true,
          error: null,
          message: res.data.message || 'Your enquiry has been successfully submitted.',
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Unable to send enquiry at this moment. Please check your details and try again.';
      setStatus({
        submitting: false,
        success: false,
        error: errorMsg,
        message: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full p-6 sm:p-8 text-[#252D35] border border-gray-200">
        {/* Close Button */}
        <button
          onClick={closeEnquiryModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#147D55] uppercase tracking-wider bg-primary-soft px-2.5 py-1 rounded">
            <span>Corporate Communications</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#17324D] mt-2">
            {enquiryProductData ? 'Product Information Enquiry' : 'Submit Business Enquiry'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Connect directly with GENUGRIN HEALTHCARE's corporate team for procurement, distribution,
            or regulatory inquiries.
          </p>

          {/* Product Pill if pre-filled */}
          {enquiryProductData && (
            <div className="mt-3 p-3 bg-[#F5F8F6] border border-accent/60 rounded-md flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-[#147D55] shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#17324D]">{enquiryProductData.name}</p>
                <p className="text-gray-600 truncate">{enquiryProductData.composition}</p>
              </div>
            </div>
          )}
        </div>

        {/* Success Feedback View */}
        {status.success ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#147D55]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">Enquiry Transmitted Successfully</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {status.message}
            </p>
            <div className="pt-2">
              <button
                onClick={closeEnquiryModal}
                className="px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Enquiry Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 flex items-center space-x-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. City Hospital / Medico Distributors"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Enquiry Type</label>
                <select
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Product Enquiry">Product Enquiry</option>
                  <option value="Business Partnership">Business Partnership</option>
                  <option value="Distribution Enquiry">Distribution Enquiry</option>
                  <option value="Other">Other</option>
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
                  placeholder="Enquiry topic"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Message / Technical Requirement <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Kindly outline your procurement requirements, volume, or technical questions..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeEnquiryModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status.submitting}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50 transition-colors"
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-accent" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
