const WebsiteContent = require('../models/WebsiteContent');

// Default initial content dictionary if database is newly initiated
const defaultSections = {
  hero: {
    sectionKey: 'hero',
    title: 'Advancing Healthcare Through Quality Pharmaceutical Formulations',
    subtitle: 'Committed to Medical Excellence & Integrity',
    content: {
      headline: 'Advancing Healthcare Through Quality Pharmaceutical Formulations',
      description:
        'GENUGRIN HEALTHCARE is dedicated to manufacturing, marketing, and delivering high-standard pharmaceutical products engineered to elevate patient care and clinical outcomes across multiple therapeutic specialties.',
      bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
      badgeText: 'Official Corporate Portal',
      primaryBtnText: 'Explore Product Portfolio',
      secondaryBtnText: 'Business Enquiries',
    },
  },
  about: {
    sectionKey: 'about',
    title: 'About GENUGRIN HEALTHCARE',
    subtitle: 'Corporate Heritage & Dedication to Healthcare',
    content: {
      companyOverview:
        'GENUGRIN HEALTHCARE is an emerging pharmaceutical enterprise founded upon the principles of uncompromised therapeutic efficacy, stringent quality control, and ethical pharmaceutical distribution. Our dedicated focus lies in providing healthcare professionals and institutions with reliable, high-bioavailability formulation solutions.',
      journey:
        'From our corporate inception, GENUGRIN HEALTHCARE has prioritized compliance with standard pharmacopoeia monographs (IP/BP/USP), ensuring consistent stability, safety, and therapeutic value in every batch manufactured.',
      commitment:
        'Our persistent commitment is to expand accessible, evidence-based medicines while fostering long-term relationships with distributors, practitioners, and clinical partners.',
    },
  },
  mission_vision: {
    sectionKey: 'mission_vision',
    title: 'Vision, Mission & Core Values',
    subtitle: 'Our Guiding Philosophy',
    content: {
      vision:
        'To establish GENUGRIN HEALTHCARE as a trusted and recognized benchmark of excellence in pharmaceutical manufacturing and ethical marketing, delivering affordable and high-potency formulations that healthcare practitioners prescribe with confidence.',
      mission:
        'To manufacture and distribute pharmaceutical formulations complying strictly with current Good Manufacturing Practices (cGMP), continuous quality validation, and transparent customer service.',
      values: [
        {
          title: 'Integrity & Ethics',
          description: 'Maintaining absolute transparency, ethical marketing, and compliance with statutory drug regulations.',
        },
        {
          title: 'Scientific Rigor',
          description: 'Adhering to strict pharmaceutical testing, batch consistency, and active ingredient stability standards.',
        },
        {
          title: 'Practitioner Partnership',
          description: 'Supporting doctors, pharmacists, and medical institutions with timely supplies and authentic technical data.',
        },
        {
          title: 'Patient-Centricity',
          description: 'Every tablet, capsule, and formulation is engineered with the safety and well-being of the end patient in mind.',
        },
      ],
    },
  },
  why_choose_us: {
    sectionKey: 'why_choose_us',
    title: 'Why Choose GENUGRIN HEALTHCARE',
    subtitle: 'Our Key Differentiators',
    content: {
      items: [
        {
          title: 'Quality-Focused Formulations',
          description:
            'Strict adherence to validated manufacturing protocols, assay specifications, and packaging integrity.',
          icon: 'ShieldCheck',
        },
        {
          title: 'Comprehensive Portfolio',
          description:
            'Broad coverage across high-demand therapeutic areas including Antibiotics, Gastro, Pain Management, and Nutraceuticals.',
          icon: 'Layers',
        },
        {
          title: 'Transparent Business Policies',
          description:
            'Direct, honest communication with distribution partners, clear commercial terms, and prompt fulfillment.',
          icon: 'Award',
        },
        {
          title: 'Dedicated Regulatory Compliance',
          description:
            'All products are verified against statutory regulatory licenses with verified monograph compliance.',
          icon: 'FileCheck2',
        },
      ],
    },
  },
  quality_assurance: {
    sectionKey: 'quality_assurance',
    title: 'Quality Assurance & Regulatory Compliance',
    subtitle: 'Zero Compromise on Pharmaceutical Standards',
    content: {
      philosophy:
        'At GENUGRIN HEALTHCARE, quality is not a secondary inspection checkpoint; it is designed into every stage of our formulation lifecycle, from raw material procurement to finished dosage packaging.',
      manufacturingStandards:
        'Our products are manufactured in compliance with cGMP norms, utilizing validated machinery, climate-controlled storage, and advanced blister/alu-alu packaging to prevent environmental degradation.',
      qualityControlProcess:
        'Every batch undergoes systematic physical, chemical, and microbiological testing including Dissolution Rate, Disintegration Time, Assay of Active Ingredients, Uniformity of Content, and Heavy Metal screening.',
      complianceStatement:
        'GENUGRIN HEALTHCARE operates with complete statutory licensing and regulatory documentation. We disclose only verified, company-authenticated certifications and ensure all labeling satisfies the Drugs and Cosmetics Act.',
    },
  },
  footer: {
    sectionKey: 'footer',
    title: 'Footer Content',
    subtitle: 'Corporate Footer Information',
    content: {
      aboutSummary:
        'GENUGRIN HEALTHCARE is a dedicated pharmaceutical formulation company committed to manufacturing high-efficacy medications with unyielding focus on quality, ethical distribution, and patient safety.',
      disclaimer:
        'Prescription Medicines Notice: Products featured on this website are Schedule H / Prescription Only drugs. Information provided here is solely for educational and medical professionals reference and does not substitute professional medical advice.',
    },
  },
};

// @desc    Get all website content sections
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res, next) => {
  try {
    const contents = await WebsiteContent.find().lean();
    
    // Map to key-value object
    const contentMap = {};
    contents.forEach((item) => {
      contentMap[item.sectionKey] = item;
    });

    // Merge with defaults for any missing section
    Object.keys(defaultSections).forEach((key) => {
      if (!contentMap[key]) {
        contentMap[key] = defaultSections[key];
      }
    });

    return res.status(200).json({
      success: true,
      content: contentMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single section content
// @route   GET /api/content/:sectionKey
// @access  Public
const getContentSection = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    let section = await WebsiteContent.findOne({ sectionKey });

    if (!section) {
      if (defaultSections[sectionKey]) {
        return res.status(200).json({
          success: true,
          section: defaultSections[sectionKey],
        });
      }
      return res.status(404).json({
        success: false,
        message: `Section ${sectionKey} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update or create section content (Admin)
// @route   PUT /api/content/:sectionKey
// @access  Private (Admin)
const updateContentSection = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const { title, subtitle, content } = req.body;

    const updated = await WebsiteContent.findOneAndUpdate(
      { sectionKey },
      {
        sectionKey,
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(content !== undefined && { content }),
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Website content for ${sectionKey} updated successfully.`,
      section: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContent,
  getContentSection,
  updateContentSection,
  defaultSections,
};
