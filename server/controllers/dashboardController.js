const Product = require('../models/Product');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');

// @desc    Get dashboard metrics & recent activities
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      recentProducts,
      recentEnquiries,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isFeatured: true }),
      Category.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'In Progress' }),
      Product.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        totalCategories,
        totalEnquiries,
        newEnquiries,
        inProgressEnquiries,
      },
      recentProducts,
      recentEnquiries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
