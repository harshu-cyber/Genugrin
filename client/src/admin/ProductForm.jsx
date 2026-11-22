import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import { productService, categoryService } from '../services/api';

const dosageOptions = [
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
];

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    productCode: '',
    category: '',
    composition: '',
    dosageForm: 'Tablet',
    strength: '',
    packSize: '',
    shortDescription: '',
    description: '',
    indications: 'As directed by a registered medical practitioner.',
    storageInstructions:
      'Store in a cool, dry place away from direct sunlight. Protect from moisture. Keep out of reach of children.',
    isFeatured: false,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Load categories
        const catRes = await categoryService.getAll({ includeInactive: 'true' });
        if (catRes.data?.categories) {
          setCategories(catRes.data.categories);
        }

        // If edit mode, load product
        if (isEditMode) {
          const prodRes = await productService.getBySlug(id);
          if (prodRes.data?.product) {
            const p = prodRes.data.product;
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              productCode: p.productCode || '',
              category: p.category?._id || p.category || '',
              composition: p.composition || '',
              dosageForm: p.dosageForm || 'Tablet',
              strength: p.strength || '',
              packSize: p.packSize || '',
              shortDescription: p.shortDescription || '',
              description: p.description || '',
              indications: p.indications || '',
              storageInstructions: p.storageInstructions || '',
              isFeatured: !!p.isFeatured,
              isActive: !!p.isActive,
              seoTitle: p.seoTitle || '',
              seoDescription: p.seoDescription || '',
            });
            setExistingImages(p.images || []);
          }
        }
      } catch (err) {
        setStatus({ error: 'Failed to load initial data from server.', success: null });
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image Selection Handler
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate size (5MB each) and type
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [...prev, ...validPreviews]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (publicId) => {
    if (!publicId) return;
    if (window.confirm('Delete this image permanently from Cloudinary?')) {
      try {
        await productService.deleteImage(id, publicId);
        setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
      } catch (err) {
        alert('Failed to delete image from Cloudinary.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ error: null, success: null });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append new image files
      newImageFiles.forEach((file) => {
        data.append('images', file);
      });

      if (isEditMode) {
        await productService.update(id, data);
        setStatus({ error: null, success: 'Formulation updated successfully!' });
      } else {
        await productService.create(data);
        setStatus({ error: null, success: 'New formulation added to catalogue!' });
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving product formulation.';
      setStatus({ error: msg, success: null });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Loading formulation editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-[#17324D]">
              {isEditMode ? `Edit: ${formData.name}` : 'Add Pharmaceutical Formulation'}
            </h1>
            <p className="text-xs text-gray-500">
              Enter verified pharmacological composition, dosage form, and Cloudinary visuals.
            </p>
          </div>
        </div>
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

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* Section 1: Basic Formulation Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2">
            1. Basic Formulation Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Brand / Formulation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. CLAVUGRIN-625"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Therapeutic Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Dosage Form <span className="text-red-500">*</span>
              </label>
              <select
                name="dosageForm"
                required
                value={formData.dosageForm}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              >
                {dosageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Strength / Potency</label>
              <input
                type="text"
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                placeholder="e.g. 625 mg / 40 mg"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Product Code</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="e.g. GG-ANTI-001"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Active Chemical Composition <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="composition"
              required
              value={formData.composition}
              onChange={handleChange}
              placeholder="e.g. Amoxicillin Trihydrate IP 500mg + Potassium Clavulanate IP 125mg"
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Packaging Specification</label>
            <input
              type="text"
              name="packSize"
              value={formData.packSize}
              onChange={handleChange}
              placeholder="e.g. 10 x 1 x 10 Alu-Alu Blister Strip"
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
            />
          </div>
        </div>

        {/* Section 2: Clinical Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2">
            2. Pharmacological & Clinical Specifications
          </h2>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Short Summary</label>
            <textarea
              name="shortDescription"
              rows="2"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief summary for product catalogue card..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mechanism of action, pharmacokinetics, or therapeutic role..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Approved Clinical Indications
              </label>
              <textarea
                name="indications"
                rows="3"
                value={formData.indications}
                onChange={handleChange}
                placeholder="Only verified company-approved indications..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Storage & Handling Instructions
              </label>
              <textarea
                name="storageInstructions"
                rows="3"
                value={formData.storageInstructions}
                onChange={handleChange}
                placeholder="e.g. Store below 25°C in a dry place..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Cloudinary Image Management */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2 flex items-center justify-between">
            <span>3. Cloudinary Product Visuals</span>
            <span className="text-xs font-normal text-gray-500">
              Multiple image support (JPEG, PNG, WEBP, up to 5MB)
            </span>
          </h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Active Cloudinary Images ({existingImages.length}):
              </p>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 border border-gray-200 rounded p-1 bg-gray-50 flex items-center justify-center group"
                  >
                    <img src={img.url} alt="" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img.public_id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 shadow transition-opacity"
                      title="Delete image from Cloudinary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {img.isPrimary && (
                      <span className="absolute bottom-1 left-1 bg-[#147D55] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#147D55] mb-2">
                Selected Images To Upload ({newImagePreviews.length}):
              </p>
              <div className="flex flex-wrap gap-4">
                {newImagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 border-2 border-dashed border-[#147D55] rounded p-1 bg-emerald-50/40 flex items-center justify-center"
                  >
                    <img src={src} alt="" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-gray-700 text-white rounded-full hover:bg-red-600 shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Drop Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#147D55] transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-sm font-semibold text-[#147D55] hover:underline">
                Click to upload product visuals
              </span>
              <span className="text-gray-500 text-xs block mt-1">
                Select one or multiple images to store on Cloudinary
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Visibility & SEO */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17324D] border-b pb-2">
            4. Visibility & SEO Meta
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-[#147D55] rounded border-gray-300 focus:ring-[#147D55]"
              />
              <span className="font-semibold text-gray-800">Active (Visible in Catalogue)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-[#147D55] rounded border-gray-300 focus:ring-[#147D55]"
              />
              <span className="font-semibold text-gray-800">Feature on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-medium text-gray-700 mb-1">SEO Title Tag</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Product Name - GENUGRIN HEALTHCARE"
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">SEO Meta Description</label>
              <input
                type="text"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="Meta description for search engines..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 px-8 py-2.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Uploading & Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-accent" />
                <span>{isEditMode ? 'Update Formulation' : 'Publish to Catalogue'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
