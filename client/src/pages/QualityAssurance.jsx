import React from 'react';
import {
  ShieldCheck,
  Microscope,
  FileCheck2,
  CheckCircle,
  FlaskConical,
  Award,
  AlertCircle,
  Scale,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const QualityAssurance = () => {
  const { content } = useSettings();

  const qaContent = content.quality_assurance?.content || {
    philosophy:
      'At GENUGRIN HEALTHCARE, quality assurance is an integral discipline woven into every phase of pharmaceutical operations. We ensure that every batch released into circulation conforms strictly to statutory pharmacopoeia standards regarding identity, purity, potency, and safety.',
    manufacturingStandards:
      'All manufacturing partner facilities adhere strictly to current Good Manufacturing Practices (cGMP) as stipulated under Schedule M of the Drugs and Cosmetics Rules. Facilities feature HEPA-filtered cleanrooms, classified HVAC zones, validated reverse-osmosis purifications, and automated blister packing lines.',
    qualityControlProcess:
      'Our comprehensive analytical parameters encompass Active Ingredient Assay testing via HPLC, Dissolution Rate analysis, Disintegration Time verification, Uniformity of Content, and Microbial Limit Testing (MLT).',
    complianceStatement:
      'GENUGRIN HEALTHCARE operates with complete regulatory transparency. We display and claim only authenticated, legally granted manufacturing licenses and verified monograph specifications. No unsubstantiated badges or unverified certifications are claimed.',
  };

  const qcSteps = [
    {
      title: 'Raw Material Quarantine & Assay',
      description:
        'Active Pharmaceutical Ingredients (APIs) and pharmaceutical-grade excipients undergo vendor pre-qualification and analytical assay verification before batch dispensing.',
      icon: FlaskConical,
    },
    {
      title: 'In-Process Quality Checks (IPQC)',
      description:
        'Continuous monitoring during granulation, compression, and filling. Parameters include tablet hardness, friability, weight variation, and disintegration timelines.',
      icon: Scale,
    },
    {
      title: 'Finished Product Analytical Release',
      description:
        'Quantitative analysis using validated chromatography and spectrometry to verify chemical potency against official monograph limits (IP/BP/USP).',
      icon: Microscope,
    },
    {
      title: 'Protective Barrier Packaging',
      description:
        'Alu-Alu and specialized PVDC blister packaging providing high barrier resistance against ambient humidity, photolytic degradation, and thermal stress.',
      icon: FileCheck2,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="bg-[#17324D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Compliance & Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">
            Quality Assurance & Regulatory Rigor
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Every tablet, capsule, and formulation is manufactured under validated protocols to ensure
            unyielding safety, bioavailability, and clinical efficacy.
          </p>
        </div>
      </div>

      {/* Quality Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="section-subtitle">Our Quality Mandate</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#17324D]">
              Precision Engineering in Pharmaceutical Formulations
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {qaContent.philosophy}
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              {qaContent.manufacturingStandards}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#17324D] text-white p-8 rounded-lg shadow-md space-y-4 border border-navy-light/60">
              <div className="w-12 h-12 rounded-lg bg-[#147D55] flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Quality Guiding Principles</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Monograph compliance: Strict adherence to IP / BP standards.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Analytical testing of finished lots prior to commercial release.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Climate-controlled storage and humidity-resistant packaging.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Batch documentation retention and traceability protocols.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QC Steps */}
      <section className="bg-white py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="section-subtitle">Systematic Verification</span>
            <h2 className="section-title">Multi-Tier Quality Control Protocols</h2>
            <p className="text-sm text-gray-600">
              A comprehensive analytical pipeline safeguarding each drug formulation from API
              sampling to finished dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qcSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F5F8F6] p-6 rounded-lg border border-gray-200 space-y-3 relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded bg-white text-[#147D55] border border-gray-200 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#17324D] text-base leading-snug">{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verified Compliance & Ethics Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-emerald-50/50 border border-[#147D55]/30 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-[#147D55]">
            <Award className="w-5 h-5" />
            <h3 className="font-bold text-base text-[#17324D]">
              Verified Regulatory Policy & Statutory Authenticity
            </h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {qaContent.complianceStatement}
          </p>
          <p className="text-xs text-gray-500 pt-2 border-t border-emerald-100">
            For technical dossier requests or Certificate of Analysis (COA) inquiries from registered
            healthcare institutions, please direct correspondence to{' '}
            <strong className="text-gray-700">regulatory@genugrinhealthcare.com</strong>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default QualityAssurance;
