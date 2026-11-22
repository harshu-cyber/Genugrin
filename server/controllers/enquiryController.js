const Enquiry = require('../models/Enquiry');

// @desc    Submit new enquiry from public contact form / product page
// @route   POST /api/enquiries
// @access  Public (Rate limited)
const submitEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      organization,
      email,
      phone,
      subject,
      enquiryType,
      productId,
      productName,
      message,
    } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields: Name, Email, Phone, Subject, and Message.',
      });
    }

    const enquiry = await Enquiry.create({
      fullName: fullName.trim(),
      organization: organization ? organization.trim() : '',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      enquiryType: enquiryType || 'General Enquiry',
      productId: productId || null,
      productName: productName || '',
      message: message.trim(),
      status: 'New',
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to GENUGRIN HEALTHCARE. Your enquiry has been registered, and our medical/business representative will connect with you promptly.',
      enquiryId: enquiry._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries with filters & pagination (Admin)
// @route   GET /api/enquiries
// @access  Private (Admin)
const getEnquiries = async (req, res, next) => {
  try {
    const {
      status,
      enquiryType,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 15,
    } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (enquiryType && enquiryType !== 'All') {
      query.enquiryType = enquiryType;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { organization: searchRegex },
        { subject: searchRegex },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalEnquiries, enquiries] = await Promise.all([
      Enquiry.countDocuments(query),
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalEnquiries / limitNum);

    return res.status(200).json({
      success: true,
      count: totalEnquiries,
      totalPages,
      currentPage: pageNum,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry details (Admin)
// @route   GET /api/enquiries/:id
// @access  Private (Admin)
const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id).populate('productId', 'name slug code composition');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and internal notes (Admin)
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry record not found.',
      });
    }

    if (status) enquiry.status = status;
    if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;

    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: 'Enquiry status and notes updated.',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry record deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export enquiries to CSV (Admin)
// @route   GET /api/enquiries/export/csv
// @access  Private (Admin)
const exportEnquiriesCSV = async (req, res, next) => {
  try {
    const { status, enquiryType } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (enquiryType && enquiryType !== 'All') query.enquiryType = enquiryType;

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).lean();

    // Format CSV
    const headers = [
      'Date',
      'Full Name',
      'Organization',
      'Email',
      'Phone',
      'Enquiry Type',
      'Subject',
      'Product Name',
      'Status',
      'Message',
      'Internal Notes',
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
      return `"${str}"`;
    };

    let csvContent = headers.join(',') + '\n';
    enquiries.forEach((item) => {
      const row = [
        escapeCSV(new Date(item.createdAt).toISOString().split('T')[0]),
        escapeCSV(item.fullName),
        escapeCSV(item.organization),
        escapeCSV(item.email),
        escapeCSV(item.phone),
        escapeCSV(item.enquiryType),
        escapeCSV(item.subject),
        escapeCSV(item.productName),
        escapeCSV(item.status),
        escapeCSV(item.message),
        escapeCSV(item.internalNotes),
      ];
      csvContent += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=genugrin_enquiries_${Date.now()}.csv`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  exportEnquiriesCSV,
};
