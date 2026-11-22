import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Pill,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const dosageForms = [
  'All',
  'Tablet',
  'Capsule',
  'Syrup',
  'Suspension',
  'Injection',
  'Ointment',
  'Cream',
  'Drops',
  'Gel',
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openEnquiryModal } = useSettings();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state initialized from query params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedDosageForm, setSelectedDosageForm] = useState(searchParams.get('dosageForm') || 'All');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'a-z');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Update query params and fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: selectedSort,
        };

        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedDosageForm && selectedDosageForm !== 'All') params.dosageForm = selectedDosageForm;

        const res = await productService.getAll(params);
        if (res.data) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.count || 0);
        }
      } catch (err) {
        console.warn('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedDosageForm, selectedSort, currentPage]);

  // Sync state to URL searchParams
  const updateFilters = (newParams) => {
    const current = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] && newParams[key] !== 'All') {
        current.set(key, newParams[key]);
      } else {
        current.delete(key);
      }
    });
    setSearchParams(current);
  };

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
    updateFilters({ category: catSlug, page: 1 });
  };

  const handleDosageChange = (form) => {
    setSelectedDosageForm(form);
    setCurrentPage(1);
    updateFilters({ dosageForm: form, page: 1 });
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    setSelectedSort(sortVal);
    setCurrentPage(1);
    updateFilters({ sort: sortVal, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateFilters({ search: searchQuery, page: 1 });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDosageForm('All');
    setSelectedSort('a-z');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || (selectedCategory && selectedCategory !== 'All') || (selectedDosageForm && selectedDosageForm !== 'All');

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="bg-[#17324D] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Pharmaceutical Formulations
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">Product Catalogue</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Explore our comprehensive range of quality-tested medications, formulated to meet
            rigorous pharmacopoeia monographs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand name, active composition, or code..."
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    updateFilters({ search: '', page: 1 });
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full py-2.5 px-3 text-sm border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              >
                <option value="All">All Therapeutic Segments</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosage Form Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedDosageForm}
                onChange={(e) => handleDosageChange(e.target.value)}
                className="w-full py-2.5 px-3 text-sm border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              >
                {dosageForms.map((form) => (
                  <option key={form} value={form}>
                    {form === 'All' ? 'All Dosage Forms' : form}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="w-full py-2.5 px-3 text-sm border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] focus:border-[#147D55] outline-none"
              >
                <option value="a-z">Sort: A to Z</option>
                <option value="z-a">Sort: Z to A</option>
                <option value="newest">Sort: Newest First</option>
              </select>
            </div>
          </div>

          {/* Active Filters Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-gray-100 gap-2">
            <div className="text-gray-600">
              Showing <strong className="text-[#17324D]">{products.length}</strong> of{' '}
              <strong className="text-[#17324D]">{totalCount}</strong> verified pharmaceutical formulations
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
            <p className="text-sm text-gray-500 font-medium">Fetching pharmaceutical catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">No Formulations Match Your Query</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We could not find any pharmaceutical product matching the selected filters. Please adjust
              your search keywords or reset filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-[#147D55] text-white text-xs font-semibold rounded shadow-sm hover:bg-[#0d5c3e]"
            >
              View Full Product List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {products.map((prod) => (
              <div
                key={prod._id || prod.slug}
                className="card-corporate flex flex-col justify-between group hover:border-[#147D55]/50 transition-all duration-200"
              >
                <div className="relative bg-white p-4 border-b border-gray-100 flex items-center justify-center h-44 overflow-hidden">
                  <img
                    src={
                      prod.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#17324D] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                    {prod.dosageForm}
                  </span>
                  {prod.productCode && (
                    <span className="absolute top-2.5 right-2.5 bg-gray-100 text-gray-600 text-[10px] font-mono px-1.5 py-0.5 rounded border border-gray-200">
                      {prod.productCode}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#147D55] font-semibold uppercase tracking-wider block">
                      {prod.category?.name || 'Formulation'}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#17324D] group-hover:text-[#147D55] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <div className="bg-[#F5F8F6] p-2 rounded border border-gray-200/60 text-xs">
                      <span className="font-semibold text-gray-700 block text-[11px]">
                        Active Composition:
                      </span>
                      <span className="text-gray-600 line-clamp-2 text-[11px]">
                        {prod.composition}
                      </span>
                    </div>
                    {prod.packSize && (
                      <p className="text-[11px] text-gray-500">
                        <span className="font-medium text-gray-700">Packaging:</span> {prod.packSize}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/products/${prod.slug}`}
                      className="flex-1 text-center py-1.5 px-2 border border-gray-300 hover:border-[#147D55] hover:text-[#147D55] text-xs font-semibold rounded transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => openEnquiryModal(prod)}
                      className="flex-1 py-1.5 px-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center justify-center space-x-1"
                    >
                      <Send className="w-3 h-3 text-accent" />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => {
                const prev = Math.max(1, currentPage - 1);
                setCurrentPage(prev);
                updateFilters({ page: prev });
              }}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-1.5 text-xs font-semibold text-[#17324D] bg-white border border-gray-300 rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                const next = Math.min(totalPages, currentPage + 1);
                setCurrentPage(next);
                updateFilters({ page: next });
              }}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
