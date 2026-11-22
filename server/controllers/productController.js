const Product = require('../models/Product');
const Category = require('../models/Category');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../utils/cloudinaryUploader');

// Helper to generate slug from name
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get all active products for catalogue (Public) / All products (Admin)
// @route   GET /api/products
// @access  Public (filtered by active) / Admin (all)
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      dosageForm,
      isFeatured,
      sort,
      page = 1,
      limit = 12,
      includeInactive,
    } = req.query;

    const query = {};

    // For public website, only active products
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    // Search by name, composition, or productCode
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { composition: searchRegex },
        { productCode: searchRegex },
        { shortDescription: searchRegex },
      ];
    }

    // Filter by category slug or ObjectId
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // Category not found, return empty results
          return res.status(200).json({
            success: true,
            count: 0,
            totalPages: 0,
            currentPage: Number(page),
            products: [],
          });
        }
      }
    }

    // Filter by dosage form
    if (dosageForm && dosageForm !== 'All') {
      query.dosageForm = dosageForm;
    }

    // Filter by featured
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'a-z' || sort === 'name_asc') {
      sortOption = { name: 1 };
    } else if (sort === 'z-a' || sort === 'name_desc') {
      sortOption = { name: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug iconName')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    return res.status(200).json({
      success: true,
      count: totalProducts,
      totalPages,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug description');
    } else {
      product = await Product.findOne({ slug }).populate('category', 'name slug description');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Pharmaceutical product not found in catalogue.',
      });
    }

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select('name slug composition dosageForm strength packSize images')
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      productCode,
      category,
      composition,
      dosageForm,
      strength,
      packSize,
      shortDescription,
      description,
      indications,
      storageInstructions,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!name || !category || !composition || !dosageForm) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, Composition, and Dosage Form are required fields.',
      });
    }

    // Auto generate unique slug
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Handle uploaded image files
    const images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const uploaded = await uploadBufferToCloudinary(file.buffer, 'genugrin/products');
        images.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          isPrimary: i === 0,
        });
      }
    } else {
      // Default clean pharmaceutical placeholder image
      images.push({
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        public_id: '',
        isPrimary: true,
      });
    }

    const product = await Product.create({
      name,
      slug,
      productCode: productCode || `GG-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      composition,
      dosageForm,
      strength: strength || '',
      packSize: packSize || '',
      shortDescription: shortDescription || '',
      description: description || '',
      indications: indications || 'As directed by a registered medical practitioner.',
      storageInstructions:
        storageInstructions ||
        'Store in a cool, dry place away from direct sunlight. Protect from moisture.',
      images,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
      seoTitle: seoTitle || `${name} - GENUGRIN HEALTHCARE`,
      seoDescription:
        seoDescription ||
        `Learn about ${name} (${composition}) by GENUGRIN HEALTHCARE. Pharmaceutical specifications, dosage form, and packaging.`,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'category',
      'name slug'
    );

    return res.status(201).json({
      success: true,
      message: 'Product added successfully to catalogue.',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      slug,
      productCode,
      category,
      composition,
      dosageForm,
      strength,
      packSize,
      shortDescription,
      description,
      indications,
      storageInstructions,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription,
    } = req.body;

    // If name changed and slug not manually passed, generate new slug
    if (name && name !== product.name && !slug) {
      let baseSlug = generateSlug(name);
      let newSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: newSlug, _id: { $ne: product._id } })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      product.slug = newSlug;
    } else if (slug && slug !== product.slug) {
      product.slug = generateSlug(slug);
    }

    if (name) product.name = name;
    if (productCode !== undefined) product.productCode = productCode;
    if (category) product.category = category;
    if (composition) product.composition = composition;
    if (dosageForm) product.dosageForm = dosageForm;
    if (strength !== undefined) product.strength = strength;
    if (packSize !== undefined) product.packSize = packSize;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description !== undefined) product.description = description;
    if (indications !== undefined) product.indications = indications;
    if (storageInstructions !== undefined) product.storageInstructions = storageInstructions;
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (isActive !== undefined) {
      product.isActive = isActive === 'true' || isActive === true;
    }
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadBufferToCloudinary(file.buffer, 'genugrin/products');
        product.images.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          isPrimary: product.images.length === 0,
        });
      }
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      'category',
      'name slug'
    );

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single image from product
// @route   DELETE /api/products/:id/images/:publicId
// @access  Private (Admin)
const deleteProductImage = async (req, res, next) => {
  try {
    const { id, publicId } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Find image in product
    const imageIndex = product.images.findIndex((img) => img.public_id === publicId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found on product.',
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // Remove from array
    product.images.splice(imageIndex, 1);

    // Ensure at least one primary image remains if array not empty
    if (product.images.length > 0 && !product.images.some((img) => img.isPrimary)) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product image deleted successfully.',
      images: product.images,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Safely delete all images from Cloudinary
    for (const image of product.images) {
      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Product and associated Cloudinary assets deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product active or featured status
// @route   PATCH /api/products/:id/status
// @access  Private (Admin)
const toggleProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, isFeatured } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product status updated.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  toggleProductStatus,
};
