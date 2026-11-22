import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService, contentService } from '../services/api';

const SettingsContext = createContext(null);

const fallbackSettings = {
  companyName: 'GENUGRIN HEALTHCARE',
  tagline: 'Trusted Quality, Healthier Tomorrow.',
  developerCredit: "Brajwasi's Coders",
  logoUrl: '/logo.png',
  email: 'info@genugrinhealthcare.com',
  supportEmail: 'support@genugrinhealthcare.com',
  phone: '+91 98765 43210',
  alternatePhone: '+91 98765 43211',
  registeredAddress: 'Corporate Office: Plot No. 42, Pharma City, Industrial Area Phase II, India',
  businessHours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/genugrinhealthcare',
    twitter: 'https://twitter.com/genugrinhealth',
    facebook: 'https://facebook.com/genugrinhealthcare',
    instagram: 'https://instagram.com/genugrinhealthcare',
  },
  disclaimerText:
    'Legal & Medical Disclaimer: The information provided on this corporate website is intended solely for educational and informative reference by healthcare practitioners and business partners. It does not constitute self-medication guidance or clinical diagnosis. All products are Schedule H / Prescription Only drugs to be dispensed exclusively against a valid prescription by a Registered Medical Practitioner.',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [content, setContent] = useState({});
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProductData, setEnquiryProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [settingsRes, contentRes] = await Promise.allSettled([
        settingsService.get(),
        contentService.getAll(),
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.settings) {
        setSettings(settingsRes.value.data.settings);
      }
      if (contentRes.status === 'fulfilled' && contentRes.value.data?.content) {
        setContent(contentRes.value.data.content);
      }
    } catch (err) {
      console.warn('[SettingsContext]: Using corporate fallback values.', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const openEnquiryModal = (product = null) => {
    setEnquiryProductData(product);
    setEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setEnquiryModalOpen(false);
    setEnquiryProductData(null);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        content,
        setContent,
        loading,
        refreshSettings: fetchGlobalData,
        enquiryModalOpen,
        enquiryProductData,
        openEnquiryModal,
        closeEnquiryModal,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
