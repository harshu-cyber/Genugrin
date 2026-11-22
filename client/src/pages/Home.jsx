import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  FileCheck2,
  Pill,
  Activity,
  HeartPulse,
  Wind,
  Sparkles,
  ChevronRight,
  Send,
  Building2,
  Stethoscope,
  Phone,
  Mail,
  CheckCircle2,
  Microscope,
  Dna,
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Pharma3DVisualizer from '../components/common/Pharma3DVisualizer';

const Home = () => {
  const { content, settings, openEnquiryModal } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroData = content.hero?.content || {
    headline: 'Advancing Healthcare Through Quality Pharmaceutical Formulations',
    description:
      'GENUGRIN HEALTHCARE is dedicated to manufacturing, marketing, and delivering high-standard pharmaceutical formulations engineered to elevate clinical outcomes across multiple therapeutic specialties.',
    bannerImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
  };

  const aboutData = content.about?.content || {
    companyOverview:
      'GENUGRIN HEALTHCARE is an emerging pharmaceutical enterprise founded upon the principles of uncompromised therapeutic efficacy, stringent quality control, and ethical pharmaceutical distribution. Our dedicated focus lies in providing healthcare professionals with reliable, high-bioavailability formulation solutions.',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productService.getAll({ isFeatured: 'true', limit: 6 }),
          categoryService.getAll(),
        ]);
        if (prodRes.status === 'fulfilled' && prodRes.value.data?.products) {
          setFeaturedProducts(prodRes.value.data.products);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.categories) {
          setCategories(catRes.value.data.categories);
        }
      } catch (err) {
        console.warn('[Home Data Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Activity': return Activity;
      case 'Stethoscope': return Stethoscope;
      case 'HeartPulse': return HeartPulse;
      case 'Wind': return Wind;
      case 'Sparkles': return Sparkles;
      default: return Pill;
    }
  };

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION — Rich Colourful Corporate Pharmaceutical Theme
          Vibrant Navy & Emerald, 3D Molecular Diagram (Pure Diagram - NO text, NO buttons)
      ═══════════════════════════════════════════════════ */}
      <section className="relative bg-[#17324D] overflow-hidden py-14 sm:py-20 border-b border-navy-light/40">
        {/* Lab Coat Doctor Background Photo - clearly visible behind the 3D diagram */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 bg-cover bg-right lg:bg-center opacity-50 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${heroData.bannerImage})` }}
        />
        {/* Subtle dot pattern for rich depth */}
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#147D55_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
        {/* Directional gradient: solid dark navy on text side, fading into the doctor on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17324D] via-[#17324D]/85 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#147D55]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#184B96]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Bold Headline & Quality Indicators (Strictly NO description text, NO buttons) */}
            <div className="lg:col-span-6 space-y-6">

              {/* Corporate Identity Tagline */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 bg-[#147D55]/30 border border-[#147D55]/50 rounded-full backdrop-blur-sm">
                <Dna className="w-4 h-4 text-[#B7DCC9]" />
                <span className="text-[11px] font-bold text-[#B7DCC9] uppercase tracking-[0.2em]">
                  Pharmaceutical Science & Research
                </span>
              </div>

              {/* Authoritative Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-heading font-black text-white leading-[1.12] tracking-tight">
                {heroData.headline}
              </h1>

              {/* Green Distinction Line */}
              <div className="w-20 h-1.5 bg-[#147D55] rounded-full shadow-[0_0_12px_#147D55]" />

              {/* Live Quality & Formulation Telemetry (Strictly NO buttons, Clean & Professional) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white">IP / BP / USP</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-tight">Strict Pharmacopoeia Compliance</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white">cGMP Monograph</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-tight">Certified Quality Formulations</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs col-span-2 sm:col-span-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white">Pan-India</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-tight">Ethical Distribution Network</p>
                </div>
              </div>
            </div>

            {/* Right Column: Pure 3D Molecular Diagram (NO text, NO labels, Pure 3D Visualizer) */}
            <div className="lg:col-span-6 w-full flex items-center justify-center">
              <Pharma3DVisualizer />
            </div>

          </div>
        </div>

        {/* Corporate Trust Strip */}
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#102336]/90 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-white/10 last:border-none px-2">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Manufacturing Standard
              </p>
              <p className="text-sm font-bold text-white mt-1">cGMP Monograph Validated</p>
            </div>
            <div className="border-r border-white/10 last:border-none px-2">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Pharmacopoeia Rigor
              </p>
              <p className="text-sm font-bold text-white mt-1">IP / BP Standard Assays</p>
            </div>
            <div className="border-r border-white/10 last:border-none px-2">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Therapeutic Specialities
              </p>
              <p className="text-sm font-bold text-white mt-1">Multi-Specialty Coverage</p>
            </div>
            <div className="px-2">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Supply Integrity
              </p>
              <p className="text-sm font-bold text-white mt-1">Alu-Alu Sealed Packaging</p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          2. COMPANY INTRODUCTION — Clean Two-Column Corporate Layout
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image column */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80"
                alt="GENUGRIN Healthcare Laboratory"
                className="w-full h-[420px] object-cover rounded-xl border border-gray-200 shadow-sm"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 w-44 h-40 bg-[#F5F8F6] border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hidden lg:flex shadow-xs">
                <Microscope className="w-7 h-7 text-[#147D55] mb-2" />
                <p className="text-[#147D55] text-xs font-bold uppercase tracking-wider leading-snug">
                  Validated Chemical Purity
                </p>
              </div>
            </div>

            {/* Text column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-[#147D55]" />
                <span className="text-[#147D55] text-xs font-semibold tracking-[0.18em] uppercase">
                  About GENUGRIN HEALTHCARE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#17324D] leading-tight">
                A Culture of Therapeutic Excellence and Patient Care
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {aboutData.companyOverview}
              </p>

              <p className="text-gray-600 leading-relaxed text-sm border-l-2 border-[#147D55] pl-4">
                We strictly adhere to ethical pharmaceutical marketing protocols and regulatory transparency.
                Every product batch undergoes rigorous testing to guarantee dissolution consistency,
                purity, and active bioavailability across its entire shelf life.
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[#147D55] font-semibold text-sm hover:gap-3 transition-all duration-150"
                >
                  <span>Read Full Company Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          3. THERAPEUTIC SEGMENTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F8F6] border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-[#147D55]" />
                <span className="text-[#147D55] text-xs font-semibold tracking-[0.18em] uppercase">
                  Therapeutic Segments
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#17324D]">
                Diverse Therapeutic Coverage
              </h2>
              <p className="text-sm text-gray-600 max-w-xl">
                Addressing vital clinical requirements with specialized pharmaceutical portfolios manufactured to precision.
              </p>
            </div>
            <Link
              to="/therapeutic-segments"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#147D55] hover:text-[#0d6045] shrink-0"
            >
              <span>View All Segments</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.slice(0, 8).map((cat) => {
              const IconComp = getCategoryIcon(cat.iconName);
              return (
                <Link
                  key={cat._id || cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="group bg-white border border-gray-200/90 rounded-xl hover:border-[#147D55] p-5 transition-all duration-200 hover:shadow-sm flex flex-col gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F5F8F6] border border-gray-200 group-hover:bg-[#147D55] group-hover:border-[#147D55] flex items-center justify-center transition-colors duration-200">
                    <IconComp className="w-5 h-5 text-[#147D55] group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-[#17324D] text-sm leading-snug mb-1 group-hover:text-[#147D55] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {cat.description || 'Advanced pharmaceutical formulations for specific clinical indications.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-medium text-gray-500">
                      {cat.productCount !== undefined ? `${cat.productCount} Products` : 'View Products'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#147D55] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          4. FEATURED PRODUCTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-[#147D55]" />
                <span className="text-[#147D55] text-xs font-semibold tracking-[0.18em] uppercase">
                  Product Showcase
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#17324D]">
                Featured Formulations
              </h2>
              <p className="text-sm text-gray-600 max-w-xl">
                Authentic pharmaceutical molecules formulated with verified excipients and secure blister packaging.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#147D55] hover:text-[#0d6045] shrink-0"
            >
              <span>View Complete Catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod._id || prod.slug}
                className="bg-white rounded-xl border border-gray-200/90 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Product image */}
                <div className="relative bg-[#F5F8F6] border-b border-gray-100 h-52 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain p-4"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#17324D] text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider rounded-md">
                    {prod.dosageForm}
                  </span>
                </div>

                {/* Product info */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] text-[#147D55] font-semibold uppercase tracking-wider mb-1">
                      {prod.category?.name || 'Therapeutic Formulation'}
                    </p>
                    <h3 className="font-heading font-bold text-base text-[#17324D] leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="text-xs text-gray-600 border-l-2 border-gray-200 pl-3">
                    <span className="font-semibold text-gray-700 block mb-0.5">Composition</span>
                    <span className="line-clamp-2 leading-relaxed">{prod.composition}</span>
                  </div>

                  {prod.packSize && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">Pack:</span> {prod.packSize}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                    <Link
                      to={`/products/${prod.slug}`}
                      className="flex-1 text-center py-2 px-3 border border-gray-300 hover:border-[#17324D] text-[#17324D] text-xs font-semibold rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => openEnquiryModal(prod)}
                      className="flex-1 py-2 px-3 bg-[#147D55] hover:bg-[#0d6045] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          5. WHY CHOOSE GENUGRIN — Corporate Pillars
      ═══════════════════════════════════════════════════ */}
      <section className="bg-[#17324D] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — heading block */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-[#B7DCC9]" />
                <span className="text-[#B7DCC9] text-xs font-semibold tracking-[0.18em] uppercase">
                  Why GENUGRIN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                Why Healthcare Professionals Choose GENUGRIN
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Grounded in strict pharmaceutical compliance, transparent partnerships,
                and validated drug formulations that meet the highest standards of clinical use.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#B7DCC9] text-sm font-semibold hover:text-white transition-colors"
              >
                <span>Learn About Our Company</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — 4 pillars */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  Icon: ShieldCheck,
                  title: 'Quality-Focused Formulations',
                  desc: 'Strict adherence to pharmacopoeia specifications, validated active assays, and protective alu-alu packaging for every product batch.',
                },
                {
                  Icon: Layers,
                  title: 'Targeted Therapeutic Portfolio',
                  desc: 'Covering high-demand clinical domains including Anti-Infectives, Cardio-metabolic, Gastroenterology, and NSAIDs.',
                },
                {
                  Icon: Award,
                  title: 'Ethical Business Practices',
                  desc: 'Transparent distribution policies, dependable stock availability, and honest, customer-first communication at every step.',
                },
                {
                  Icon: FileCheck2,
                  title: 'Regulatory Compliance',
                  desc: 'All formulations comply with the Drugs and Cosmetics Act and applicable state drug licensing frameworks without exception.',
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#102336] rounded-xl border border-white/10 p-6 space-y-3 hover:border-[#147D55]/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg border border-[#147D55] bg-[#147D55]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#B7DCC9]" />
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-snug">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          6. QUALITY COMMITMENT
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text side */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-px bg-[#147D55]" />
                <span className="text-[#147D55] text-xs font-semibold tracking-[0.18em] uppercase">
                  Quality Assurance
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#17324D] leading-tight">
                Uncompromising Standards for Patient Well-being
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every formulation bearing the GENUGRIN brand name represents hours of formulation discipline,
                batch analytical assays, and strict packaging controls. We take pride in contributing to
                accessible, high-quality healthcare solutions across therapeutic areas.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/quality-assurance"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17324D] hover:bg-[#1a3d5c] text-white text-xs font-bold rounded-md transition-colors"
                >
                  Our Quality Protocols
                </Link>
                <button
                  onClick={() => openEnquiryModal()}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#17324D] text-[#17324D] hover:bg-[#17324D] hover:text-white text-xs font-bold rounded-md transition-colors"
                >
                  Partner With Us
                </button>
              </div>
            </div>

            {/* Visual side — 2×2 quality attributes */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Batch Testing', desc: 'Every batch analytically verified before dispatch' },
                { label: 'Raw Material QC', desc: 'Sourced from approved, audited API manufacturers' },
                { label: 'Packaging Integrity', desc: 'Alu-alu and blister packing with tamper seals' },
                { label: 'Shelf Life Monitoring', desc: 'Stability studies conducted under ICH conditions' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#F5F8F6] border border-gray-200/90 rounded-xl p-5 space-y-2"
                >
                  <div className="w-6 h-0.5 bg-[#147D55]" />
                  <h4 className="font-semibold text-[#17324D] text-xs uppercase tracking-wide">{item.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
