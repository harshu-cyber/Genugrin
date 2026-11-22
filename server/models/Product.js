const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    productCode: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    composition: {
      type: String,
      required: [true, 'Active chemical composition is required'],
      trim: true,
    },
    dosageForm: {
      type: String,
      required: [true, 'Dosage form is required'],
      trim: true,
      enum: [
        'Tablet',
        'Capsule',
        'Syrup',
        'Suspension',
        'Injection',
        'Ointment',
        'Cream',
        'Drops',
        'Gel',
        'Powder',
        'Sachet',
        'Other',
      ],
    },
    strength: {
      type: String,
      trim: true,
      default: '',
    },
    packSize: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    indications: {
      type: String,
      trim: true,
      default: 'As directed by a registered medical practitioner.',
    },
    storageInstructions: {
      type: String,
      trim: true,
      default: 'Store in a cool, dry place away from direct sunlight and moisture. Keep out of reach of children.',
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: '',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', composition: 'text', dosageForm: 'text' });

module.exports = mongoose.model('Product', productSchema);
