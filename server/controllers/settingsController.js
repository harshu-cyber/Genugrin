const CompanySettings = require('../models/CompanySettings');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../utils/cloudinaryUploader');

// @desc    Get company profile settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();

    if (!settings) {
      settings = await CompanySettings.create({
        companyName: 'GENUGRIN HEALTHCARE',
        tagline: 'Dedicated to Life, Committed to Quality',
        developerCredit: "Brajwasi's Coders",
        registeredAddress: 'Corporate Office: Plot No. 42, Pharma City, Industrial Area Phase II, India',
        email: 'info@genugrinhealthcare.com',
        phone: '+91 98765 43210',
        businessHours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST',
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile settings (Admin)
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }

    const {
      companyName,
      tagline,
      developerCredit,
      email,
      supportEmail,
      phone,
      alternatePhone,
      registeredAddress,
      businessHours,
      disclaimerText,
      linkedin,
      twitter,
      facebook,
      instagram,
    } = req.body;

    if (companyName) settings.companyName = companyName;
    if (tagline !== undefined) settings.tagline = tagline;
    if (developerCredit !== undefined) settings.developerCredit = developerCredit;
    if (email) settings.email = email;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (phone) settings.phone = phone;
    if (alternatePhone !== undefined) settings.alternatePhone = alternatePhone;
    if (registeredAddress !== undefined) settings.registeredAddress = registeredAddress;
    if (businessHours !== undefined) settings.businessHours = businessHours;
    if (disclaimerText !== undefined) settings.disclaimerText = disclaimerText;

    if (!settings.socialLinks) settings.socialLinks = {};
    if (linkedin !== undefined) settings.socialLinks.linkedin = linkedin;
    if (twitter !== undefined) settings.socialLinks.twitter = twitter;
    if (facebook !== undefined) settings.socialLinks.facebook = facebook;
    if (instagram !== undefined) settings.socialLinks.instagram = instagram;

    // Handle logo upload if provided
    if (req.file) {
      if (settings.logoPublicId) {
        await deleteFromCloudinary(settings.logoPublicId);
      }
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'genugrin/brand');
      settings.logoUrl = uploaded.url;
      settings.logoPublicId = uploaded.public_id;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Company profile settings updated successfully.',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
