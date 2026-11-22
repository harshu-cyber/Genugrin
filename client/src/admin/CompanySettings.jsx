import React, { useState, useEffect } from 'react';
import {
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Globe,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { settingsService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const CompanySettings = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  const [formData, setFormData] = useState({
    companyName: 'GENUGRIN HEALTHCARE',
    tagline: 'Dedicated to Life, Committed to Quality',
    developerCredit: "Brajwasi's Coders",
    email: '',
    supportEmail: '',
    phone: '',
    alternatePhone: '',
    registeredAddress: '',
    businessHours: '',
    disclaimerText: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await settingsService.get();
        if (res.data?.settings) {
          const s = res.data.settings;
          setFormData({
            companyName: s.companyName || 'GENUGRIN HEALTHCARE',
            tagline: s.tagline || 'Dedicated to Life, Committed to Quality',
            developerCredit: s.developerCredit || "Brajwasi's Coders",
            email: s.email || '',
            supportEmail: s.supportEmail || '',
            phone: s.phone || '',
            alternatePhone: s.alternatePhone || '',
            registeredAddress: s.registeredAddress || '',
            businessHours: s.businessHours || '',
            disclaimerText: s.disclaimerText || '',
            linkedin: s.socialLinks?.linkedin || '',
            twitter: s.socialLinks?.twitter || '',
            facebook: s.socialLinks?.facebook || '',
            instagram: s.socialLinks?.instagram || '',
          });
          if (s.logoUrl) setLogoPreview(s.logoUrl);
        }
      } catch (err) {
        console.warn('Failed to load company profile settings:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ error: null, success: null });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((k) => {
        data.append(k, formData[k]);
      });

      if (logoFile) {
        data.append('logo', logoFile);
      }

      const res = await settingsService.update(data);
      if (res.data?.success) {
        setStatus({ error: null, success: 'Company profile settings updated successfully!' });
        refreshSettings();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update company settings.';
      setStatus({ error: msg, success: null });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Loading corporate profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#17324D]">
          Company Profile & Identity Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Corporate brand identity, registered headquarters, official contact information, and social coordinates.
        </p>
      </div>

      {status.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {status.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{status.success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* Brand Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2 flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#147D55]" />
            <span>Corporate Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none font-bold text-[#17324D]"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Corporate Tagline / Motto</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Technical Developer Credit</label>
              <input
                type="text"
                name="developerCredit"
                value={formData.developerCredit}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            {/* Logo Upload to Cloudinary */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Company Logo (Cloudinary)</label>
              <div className="flex items-center space-x-3">
                {logoPreview && (
                  <div className="w-12 h-12 rounded border p-1 shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoChange}
                  className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-soft file:text-[#147D55]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Address & Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#147D55]" />
            <span>Corporate Communications & Address</span>
          </h2>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Registered Corporate Address</label>
            <textarea
              rows="2"
              name="registeredAddress"
              value={formData.registeredAddress}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Official General Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Support / Regulatory Email</label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Primary Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Alternate Phone Number</label>
              <input
                type="text"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Operating Business Hours</label>
              <input
                type="text"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Coordinates */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#147D55]" />
            <span>Official Social Media Coordinates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/genugrinhealthcare"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Twitter (X) Profile URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/genugrinhealth"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Facebook Page URL</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/genugrinhealthcare"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Instagram Page URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/genugrinhealthcare"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Statutory Disclaimer */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#147D55]" />
            <span>Statutory Legal & Prescription Notice</span>
          </h2>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Disclaimer Text</label>
            <textarea
              rows="3"
              name="disclaimerText"
              value={formData.disclaimerText}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-accent" />
            <span>{saving ? 'Updating Profile...' : 'Save Corporate Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
