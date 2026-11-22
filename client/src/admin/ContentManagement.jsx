import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layout,
  Compass,
  Award,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { contentService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const ContentManagement = () => {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  // Structured content state
  const [contentMap, setContentMap] = useState({
    hero: {
      headline: '',
      description: '',
      bannerImage: '',
      primaryBtnText: '',
      secondaryBtnText: '',
    },
    about: {
      companyOverview: '',
      journey: '',
      commitment: '',
    },
    mission_vision: {
      vision: '',
      mission: '',
    },
    quality_assurance: {
      philosophy: '',
      manufacturingStandards: '',
      qualityControlProcess: '',
      complianceStatement: '',
    },
    footer: {
      aboutSummary: '',
      disclaimer: '',
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await contentService.getAll();
        if (res.data?.content) {
          const raw = res.data.content;
          setContentMap({
            hero: raw.hero?.content || {},
            about: raw.about?.content || {},
            mission_vision: raw.mission_vision?.content || {},
            quality_assurance: raw.quality_assurance?.content || {},
            footer: raw.footer?.content || {},
          });
        }
      } catch (err) {
        console.warn('Failed to load website content:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleFieldChange = (section, field, value) => {
    setContentMap((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    setStatus({ error: null, success: null });
    try {
      await contentService.updateSection(sectionKey, {
        content: contentMap[sectionKey],
      });
      setStatus({ error: null, success: `Section "${sectionKey.toUpperCase()}" updated successfully!` });
      refreshSettings(); // update frontend context
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating content.';
      setStatus({ error: msg, success: null });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', name: 'Homepage Hero Banner', icon: Layout },
    { id: 'about', name: 'About Us Overview', icon: FileText },
    { id: 'mission_vision', name: 'Mission & Vision', icon: Compass },
    { id: 'quality_assurance', name: 'Quality Assurance', icon: ShieldCheck },
    { id: 'footer', name: 'Footer Text & Notices', icon: FileEdit },
  ];

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Loading website content editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#17324D]">
          Website Content Management (CMS)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Update public copy, corporate statements, and descriptions across the official website.
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatus({ error: null, success: null });
              }}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#147D55] text-[#147D55]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm">
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#17324D] border-b pb-2">
              Homepage Hero Section
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={contentMap.hero.headline || ''}
                onChange={(e) => handleFieldChange('hero', 'headline', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none font-semibold text-[#17324D]"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Hero Description</label>
              <textarea
                rows="3"
                value={contentMap.hero.description || ''}
                onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Banner Background Image URL</label>
              <input
                type="text"
                value={contentMap.hero.bannerImage || ''}
                onChange={(e) => handleFieldChange('hero', 'bannerImage', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={contentMap.hero.primaryBtnText || ''}
                  onChange={(e) => handleFieldChange('hero', 'primaryBtnText', e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Secondary Button Label</label>
                <input
                  type="text"
                  value={contentMap.hero.secondaryBtnText || ''}
                  onChange={(e) => handleFieldChange('hero', 'secondaryBtnText', e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSection('hero')}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Saving...' : 'Save Hero Section'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ABOUT US TAB */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#17324D] border-b pb-2">
              About Us Page Content
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Company Overview</label>
              <textarea
                rows="4"
                value={contentMap.about.companyOverview || ''}
                onChange={(e) => handleFieldChange('about', 'companyOverview', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Company Journey & Heritage</label>
              <textarea
                rows="3"
                value={contentMap.about.journey || ''}
                onChange={(e) => handleFieldChange('about', 'journey', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Commitment to Healthcare</label>
              <textarea
                rows="3"
                value={contentMap.about.commitment || ''}
                onChange={(e) => handleFieldChange('about', 'commitment', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSection('about')}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Saving...' : 'Save About Us Content'}</span>
              </button>
            </div>
          </div>
        )}

        {/* MISSION & VISION TAB */}
        {activeTab === 'mission_vision' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#17324D] border-b pb-2">
              Vision & Mission Statements
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Corporate Vision</label>
              <textarea
                rows="3"
                value={contentMap.mission_vision.vision || ''}
                onChange={(e) => handleFieldChange('mission_vision', 'vision', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Corporate Mission</label>
              <textarea
                rows="3"
                value={contentMap.mission_vision.mission || ''}
                onChange={(e) => handleFieldChange('mission_vision', 'mission', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSection('mission_vision')}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Saving...' : 'Save Mission & Vision'}</span>
              </button>
            </div>
          </div>
        )}

        {/* QUALITY ASSURANCE TAB */}
        {activeTab === 'quality_assurance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#17324D] border-b pb-2">
              Quality Assurance Page Specifications
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Quality Philosophy</label>
              <textarea
                rows="3"
                value={contentMap.quality_assurance.philosophy || ''}
                onChange={(e) => handleFieldChange('quality_assurance', 'philosophy', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Manufacturing Quality Standards</label>
              <textarea
                rows="3"
                value={contentMap.quality_assurance.manufacturingStandards || ''}
                onChange={(e) => handleFieldChange('quality_assurance', 'manufacturingStandards', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Quality Control Testing Process</label>
              <textarea
                rows="3"
                value={contentMap.quality_assurance.qualityControlProcess || ''}
                onChange={(e) => handleFieldChange('quality_assurance', 'qualityControlProcess', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Regulatory Compliance Statement</label>
              <textarea
                rows="3"
                value={contentMap.quality_assurance.complianceStatement || ''}
                onChange={(e) => handleFieldChange('quality_assurance', 'complianceStatement', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSection('quality_assurance')}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Saving...' : 'Save Quality Content'}</span>
              </button>
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#17324D] border-b pb-2">
              Corporate Footer Information
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Footer About Summary</label>
              <textarea
                rows="3"
                value={contentMap.footer.aboutSummary || ''}
                onChange={(e) => handleFieldChange('footer', 'aboutSummary', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Prescription Disclaimer Note</label>
              <textarea
                rows="3"
                value={contentMap.footer.disclaimer || ''}
                onChange={(e) => handleFieldChange('footer', 'disclaimer', e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSection('footer')}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Saving...' : 'Save Footer Content'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
