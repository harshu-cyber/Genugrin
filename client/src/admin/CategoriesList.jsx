import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
} from 'lucide-react';
import { categoryService } from '../services/api';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Pill',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({ includeInactive: 'true' });
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      iconName: 'Pill',
      order: categories.length + 1,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setStatus({ error: null, success: null });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      iconName: cat.iconName || 'Pill',
      order: cat.order || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setImageFile(null);
    setImagePreview(cat.image?.url || '');
    setStatus({ error: null, success: null });
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ error: null, success: null });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('iconName', formData.iconName);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingCategory) {
        await categoryService.update(editingCategory._id, data);
      } else {
        await categoryService.create(data);
      }

      setStatus({ error: null, success: 'Category saved successfully.' });
      fetchCategories();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving category.';
      setStatus({ error: msg, success: null });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.productCount > 0) {
      alert(`Cannot delete "${cat.name}" because it contains ${cat.productCount} formulation(s). Reassign or delete products first.`);
      return;
    }

    if (window.confirm(`Permanently delete "${cat.name}" therapeutic category?`)) {
      try {
        await categoryService.delete(cat._id);
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete category.';
        alert(msg);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17324D]">
            Therapeutic Segments Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Define and manage medical specialties, descriptions, and linked pharmaceutical formulations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add Therapeutic Segment</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8F6] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Segment Name & Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Linked Products</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#147D55] mx-auto mb-2" />
                    <span>Loading therapeutic segments...</span>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    No therapeutic categories configured yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-sm text-[#17324D]">{cat.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">/{cat.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-sm line-clamp-2">
                      {cat.description || 'No description provided.'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#147D55] font-semibold text-xs border border-emerald-200">
                        {cat.productCount !== undefined ? cat.productCount : 0} Products
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-700">
                      {cat.order || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="inline-block p-1 text-[#147D55] hover:text-[#0d5c3e]"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="inline-block p-1 text-red-500 hover:text-red-700"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-[#252D35] border border-gray-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-heading text-[#17324D] mb-4">
              {editingCategory ? `Edit: ${editingCategory.name}` : 'Add Therapeutic Segment'}
            </h3>

            {status.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            {status.success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{status.success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Segment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anti-Infective & Antibiotics"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clinical coverage, therapeutic scope, monograph compliance..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Display Icon</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] outline-none"
                  >
                    <option value="Pill">Pill</option>
                    <option value="Activity">Activity (Cardio)</option>
                    <option value="Stethoscope">Stethoscope (Gastro)</option>
                    <option value="HeartPulse">HeartPulse (Pain)</option>
                    <option value="Wind">Wind (Respiratory)</option>
                    <option value="Sparkles">Sparkles (Nutra)</option>
                    <option value="ShieldAlert">ShieldAlert (Antibiotic)</option>
                    <option value="Thermometer">Thermometer (Derma)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Image */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category Banner Image (Cloudinary)
                </label>
                <div className="flex items-center space-x-3">
                  {imagePreview && (
                    <div className="w-14 h-14 rounded border p-1 shrink-0 overflow-hidden bg-gray-50">
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-soft file:text-[#147D55] hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#147D55] rounded border-gray-300"
                  />
                  <span className="font-semibold text-gray-700">Active (Visible on Website)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
