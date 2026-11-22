const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'GENUGRIN HEALTHCARE',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Trusted Quality, Healthier Tomorrow.',
      trim: true,
    },
    developerCredit: {
      type: String,
      default: "Brajwasi's Coders",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '/logo.png',
    },
    logoPublicId: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'info@genugrinhealthcare.com',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'support@genugrinhealthcare.com',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    alternatePhone: {
      type: String,
      default: '+91 98765 43211',
      trim: true,
    },
    registeredAddress: {
      type: String,
      default: 'Corporate Office: Plot No. 42, Pharma City, Industrial Area Phase II, India',
      trim: true,
    },
    businessHours: {
      type: String,
      default: 'Monday – Saturday: 9:00 AM – 6:30 PM IST (Sunday Closed)',
      trim: true,
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/genugrinhealthcare' },
      twitter: { type: String, default: 'https://twitter.com/genugrinhealth' },
      facebook: { type: String, default: 'https://facebook.com/genugrinhealthcare' },
      instagram: { type: String, default: 'https://instagram.com/genugrinhealthcare' },
    },
    disclaimerText: {
      type: String,
      default:
        'Legal & Medical Disclaimer: The information provided on this portal is for corporate and educational purposes only. It does not constitute medical advice or clinical diagnosis. Pharmaceutical formulations displayed are Schedule H / Prescription Only drugs and must be administered strictly under the supervision of a Registered Medical Practitioner.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
