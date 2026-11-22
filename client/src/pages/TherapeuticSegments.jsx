import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Pill,
  Activity,
  HeartPulse,
  Wind,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  Thermometer,
  Loader2,
} from 'lucide-react';
import { categoryService } from '../services/api';

const TherapeuticSegments = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.warn('Failed to load therapeutic segments:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getIcon = (name) => {
    switch (name) {
      case 'Activity':
        return Activity;
      case 'HeartPulse':
        return HeartPulse;
      case 'Wind':
        return Wind;
      case 'Sparkles':
        return Sparkles;
      case 'Stethoscope':
        return Stethoscope;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Thermometer':
        return Thermometer;
      default:
        return Pill;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-[#17324D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Clinical Focus Areas
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">
            Therapeutic Segments
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            GENUGRIN HEALTHCARE delivers therapeutic solutions spanning critical clinical areas,
            formulated for consistent pharmacokinetic efficacy and bio-equivalence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
            <p className="text-sm text-gray-500 font-medium">Loading therapeutic categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, idx) => {
              const IconComp = getIcon(cat.iconName);
              return (
                <div
                  key={cat._id || cat.slug}
                  className="bg-white rounded-lg border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-lg bg-primary-soft text-[#147D55] group-hover:bg-[#147D55] group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-[#F5F8F6] text-[#17324D] rounded border border-gray-200">
                        {cat.productCount !== undefined ? `${cat.productCount} Formulations` : 'Portfolio'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-heading text-[#17324D] group-hover:text-[#147D55] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {cat.description ||
                          'Advanced pharmaceutical molecules designed to target pathology with verified dosage release profiles.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="inline-flex items-center space-x-2 text-sm font-semibold text-[#147D55] hover:text-[#0d5c3e] group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore {cat.name} Formulations</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapeuticSegments;
