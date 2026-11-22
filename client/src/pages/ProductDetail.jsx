import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  ShieldCheck,
  Package,
  Layers,
  Thermometer,
  FileText,
  AlertTriangle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { productService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const { openEnquiryModal } = useSettings();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getBySlug(slug);
        if (res.data?.product) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          setSelectedImage(0);
        } else {
          setError('Product formulation not found.');
        }
      } catch (err) {
        setError('Unable to retrieve formulation details. Please verify the URL.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Loading pharmaceutical monograph...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#17324D]">{error || 'Product Not Found'}</h2>
        <p className="text-sm text-gray-600">
          The requested pharmaceutical formulation could not be located in our official database.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#147D55] text-white text-xs font-semibold rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          public_id: 'default',
        },
      ];

  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <Link to="/" className="hover:text-[#147D55]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/products" className="hover:text-[#147D55]">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {product.category && (
            <>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-[#147D55]"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </>
          )}
          <span className="text-[#17324D] font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Product Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & Images (Amazon-Style Hover & Click) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center h-96 sm:h-[440px] relative overflow-hidden shadow-xs group">
              <img
                src={images[selectedImage]?.url}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-[#17324D] text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                {product.dosageForm}
              </span>
              {product.productCode && (
                <span className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs font-mono px-2 py-0.5 rounded border border-gray-200">
                  {product.productCode}
                </span>
              )}
            </div>

            {/* Amazon-Style Thumbnail switcher (Hover & Click) */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    onMouseEnter={() => setSelectedImage(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-lg border-2 p-1 bg-white shrink-0 overflow-hidden transition-all cursor-pointer ${
                      selectedImage === idx
                        ? 'border-[#147D55] shadow-md ring-2 ring-[#147D55]/20 scale-102'
                        : 'border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Spec Card */}
            <div className="bg-[#F5F8F6] p-4 rounded-lg border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                <span className="text-gray-600 font-medium">Marketed By:</span>
                <span className="font-bold text-[#17324D]">GENUGRIN HEALTHCARE</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                <span className="text-gray-600 font-medium">Dosage Classification:</span>
                <span className="font-semibold text-gray-800">{product.dosageForm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Packaging Unit:</span>
                <span className="font-semibold text-gray-800">{product.packSize || 'Standard Hospital/Retail Strip'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specification & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#147D55] uppercase tracking-wider bg-primary-soft px-2.5 py-1 rounded inline-block">
                {product.category?.name || 'Therapeutic Formulation'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-heading text-[#17324D] leading-tight">
                {product.name}
              </h1>
              {product.strength && (
                <p className="text-sm font-semibold text-gray-500">
                  Strength / Potency: {product.strength}
                </p>
              )}
            </div>

            {/* Composition Box */}
            <div className="p-4 bg-emerald-50/60 border border-[#147D55]/30 rounded-lg">
              <span className="text-xs font-bold text-[#147D55] uppercase tracking-wider block mb-1">
                Active Chemical Composition
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#17324D] leading-relaxed">
                {product.composition}
              </p>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Specification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded border border-gray-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-500 font-semibold">
                  <Package className="w-4 h-4 text-[#147D55]" />
                  <span>Packaging Presentation</span>
                </div>
                <p className="text-gray-800 font-medium">{product.packSize || 'Refer to label'}</p>
              </div>

              <div className="p-4 bg-white rounded border border-gray-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-500 font-semibold">
                  <Thermometer className="w-4 h-4 text-[#147D55]" />
                  <span>Storage Protocol</span>
                </div>
                <p className="text-gray-800 font-medium leading-snug">
                  {product.storageInstructions || 'Store below 25°C in dry conditions.'}
                </p>
              </div>
            </div>

            {/* Indications & Technical Information */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#17324D] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#147D55]" />
                <span>Therapeutic Indications</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white p-4 rounded border border-gray-200">
                {product.indications || 'As directed by a registered medical practitioner.'}
              </p>
            </div>

            {/* Action Bar with WhatsApp Integration */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => openEnquiryModal(product)}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#147D55] hover:bg-[#0d5c3e] text-white font-semibold rounded-md shadow-sm text-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-accent" />
                <span>Enquire Now</span>
              </button>

              <a
                href={`https://wa.me/918115440794?text=${encodeURIComponent(
                  `Hello GENUGRIN HEALTHCARE, I would like to enquire about ${product.name} (${product.packSize || 'Standard Pack'}). Please share commercial terms and product availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-md shadow-sm text-sm transition-all transform hover:scale-102 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.153.568 4.174 1.56 5.922l-1.656 6.046 6.223-1.633c1.693.931 3.639 1.465 5.714 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.6c-1.849 0-3.567-.533-5.016-1.455l-.361-.229-3.727.978.995-3.633-.25-.398c-1.026-1.635-1.572-3.535-1.572-5.485 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10 0 5.514-4.486 10-10 10z"/>
                </svg>
                <span>WhatsApp Enquiry</span>
              </a>

              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-md text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Catalogue</span>
              </Link>
            </div>

            {/* Statutory Prescription / Nutraceutical Notice */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-[#147D55] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Quality Assurance & Statutory Compliance: </strong>
                All formulations are manufactured in compliance with cGMP / FSSAI monograph standards.
                Store as directed on the label. Keep out of reach of children.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Amazon-Style Product Monograph & Description Section */}
        {product.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#17324D]">
                Detailed Product Overview & Formulation Information
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Verified monograph, nutritional values, active compounds, and recommended usage.
              </p>
            </div>

            <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-line font-sans">
              {product.description}
            </div>
          </div>
        )}

        {/* Related Products in Same Category */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#17324D]">
                  Related Formulations in {product.category?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Complementary molecules within the same clinical segment.
                </p>
              </div>
              <Link
                to={`/products?category=${product.category?.slug}`}
                className="text-xs font-semibold text-[#147D55] hover:underline"
              >
                View All in Segment
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel._id}
                  className="card-corporate flex flex-col justify-between group p-4 space-y-3"
                >
                  <div className="h-32 flex items-center justify-center bg-white overflow-hidden">
                    <img
                      src={rel.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                      alt={rel.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#147D55] uppercase block">
                      {rel.dosageForm}
                    </span>
                    <h4 className="font-bold text-sm text-[#17324D] group-hover:text-[#147D55] truncate">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">{rel.composition}</p>
                  </div>
                  <Link
                    to={`/products/${rel.slug}`}
                    className="block text-center py-1.5 border border-gray-300 text-xs font-semibold rounded hover:border-[#147D55] hover:text-[#147D55] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
