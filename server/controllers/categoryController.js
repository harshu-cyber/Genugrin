const Category = require('../models/Category');
const Product = require('../models/Product');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../utils/cloudinaryUploader');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    const categories = await Category.find(query).sort({ order: 1, name: 1 }).lean();

    // Fetch product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: cat._id,
          isActive: true,
        });
        return {
          ...cat,
          productCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      categories: categoriesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug with its products
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Therapeutic category not found.',
      });
    }

    const products = await Product.find({
      category: category._id,
      isActive: true,
    })
      .select('name slug composition dosageForm strength packSize images shortDescription')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      category,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, iconName, order, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Category.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let image = { url: '', public_id: '' };
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'genugrin/categories');
      image = {
        url: uploaded.url,
        public_id: uploaded.public_id,
      };
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      iconName: iconName || 'Pill',
      order: order ? parseInt(order, 10) : 0,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
      image,
    });

    return res.status(201).json({
      success: true,
      message: 'Therapeutic category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, iconName, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (name && name !== category.name) {
      let baseSlug = generateSlug(name);
      let newSlug = baseSlug;
      let counter = 1;
      while (await Category.findOne({ slug: newSlug, _id: { $ne: category._id } })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      category.name = name;
      category.slug = newSlug;
    }

    if (description !== undefined) category.description = description;
    if (iconName !== undefined) category.iconName = iconName;
    if (order !== undefined) category.order = parseInt(order, 10);
    if (isActive !== undefined) {
      category.isActive = isActive === 'true' || isActive === true;
    }

    if (req.file) {
      if (category.image && category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'genugrin/categories');
      category.image = {
        url: uploaded.url,
        public_id: uploaded.public_id,
      };
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Therapeutic category updated successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Check if products exist in category
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it contains ${productCount} active product(s). Reassign or delete products first.`,
      });
    }

    if (category.image && category.image.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
