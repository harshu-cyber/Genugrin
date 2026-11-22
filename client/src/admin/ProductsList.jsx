import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  X,
  Loader2,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { productService, categoryService } from '../services/api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll({ includeInactive: 'true' });
      if (res.data?.categories) setCategories(res.data.categories);
    } catch (err) {
      console.warn('Error fetching categories:', err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        includeInactive: 'true',
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCat !== 'All') params.category = selectedCat;

      const res = await productService.getAll(params);
      if (res.data) {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn('Error loading products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await productService.toggleStatus(id, { isActive: !currentStatus });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !currentStatus } : p))
      );
    } catch (err) {
      alert('Failed to update product active status.');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await productService.toggleStatus(id, { isFeatured: !currentFeatured });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: !currentFeatured } : p))
      );
    } catch (err) {
      alert('Failed to update product featured status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" and all associated Cloudinary images?`)) {
      setDeletingId(id);
      try {
        await productService.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete product.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17324D]">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage pharmaceutical molecules, compositions, Cloudinary images, and catalogue visibility.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add New Formulation</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, composition, code..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>

        <div className="w-full sm:w-auto flex items-center space-x-3">
          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-56 py-2 px-3 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
          >
            <option value="All">All Therapeutic Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8F6] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Visual</th>
                <th className="py-3 px-4">Product Name & Code</th>
                <th className="py-3 px-4">Therapeutic Category</th>
                <th className="py-3 px-4">Dosage / Strength</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#147D55] mx-auto mb-2" />
                    <span>Loading formulations...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-500">
                    No pharmaceutical products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded border border-gray-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-sm text-[#17324D]">{prod.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{prod.productCode || 'No Code'}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">
                        {prod.composition}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {prod.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800">{prod.dosageForm}</span>
                      {prod.strength && (
                        <span className="block text-[11px] text-gray-500">{prod.strength}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod._id, prod.isFeatured)}
                        className={`p-1 rounded transition-colors ${
                          prod.isFeatured
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                            : 'text-gray-300 hover:text-gray-500'
                        }`}
                        title={prod.isFeatured ? 'Featured on Home' : 'Not Featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(prod._id, prod.isActive)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          prod.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1 text-gray-400 hover:text-gray-700"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        to={`/admin/products/edit/${prod._id}`}
                        className="inline-block p-1 text-[#147D55] hover:text-[#0d5c3e]"
                        title="Edit Formulation"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod._id, prod.name)}
                        disabled={deletingId === prod._id}
                        className="inline-block p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete Formulation"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs">
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <div className="space-x-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 bg-white border border-gray-300 rounded disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 bg-white border border-gray-300 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
