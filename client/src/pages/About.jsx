import React from 'react';
import {
  ShieldCheck,
  Target,
  Compass,
  HeartHandshake,
  CheckCircle,
  Building,
  Microscope,
  FileCheck,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { content } = useSettings();

  const aboutContent = content.about?.content || {
    companyOverview:
      'GENUGRIN HEALTHCARE is a dedicated pharmaceutical formulation enterprise founded upon the unyielding pillars of therapeutic efficacy, analytical precision, and statutory compliance. We bridge clinical needs with high-stability drug formulations engineered to meet standard pharmacopoeia monographs (IP/BP/USP).',
    journey:
      'Established by a passionate team of pharmaceutical professionals and healthcare visionaries, GENUGRIN HEALTHCARE was built to fulfill an essential requirement: delivering high-grade formulations that medical practitioners can prescribe with complete confidence and peace of mind.',
    commitment:
      'Our ongoing mission centers on building an ethically managed supply chain, working closely with registered distributors, hospital pharmacies, and clinical institutions across the nation.',
  };

  const missionVision = content.mission_vision?.content || {
    vision:
      'To emerge as a trusted, household pharmaceutical brand synonymous with pharmaceutical rigor, patient-centric formulation design, and ethical transparency.',
    mission:
      'To formulate and distribute therapeutic solutions that adhere strictly to current Good Manufacturing Practices (cGMP), continuous analytical validation, and empathetic customer partnership.',
    values: [
      {
        title: 'Integrity & Ethics',
        description:
          'Upholding full compliance with the Drugs and Cosmetics Act, ethical marketing standards, and transparent commercial policies.',
      },
      {
        title: 'Scientific Rigor',
        description:
          'Rigorous testing for uniformity of dosage units, dissolution velocity, and active substance assay specifications.',
      },
      {
        title: 'Practitioner Partnership',
        description:
          'Furnishing clinicians with accurate, evidence-backed formulation data and continuous stock stability.',
      },
      {
        title: 'Patient-Centricity',
        description:
          'Every capsule, tablet, and suspension is produced with the end patient’s recovery and well-being as the focal target.',
      },
    ],
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="bg-[#17324D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Corporate Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">About GENUGRIN HEALTHCARE</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Committed to advancing human health through verified pharmaceutical excellence,
            stringent monograph compliance, and unwavering corporate integrity.
          </p>
        </div>
      </div>

      {/* Corporate Overview & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="section-subtitle">Our Heritage & Ethos</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#17324D]">
              Dedicated to Life, Committed to Quality
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {aboutContent.companyOverview}
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">{aboutContent.journey}</p>
            <div className="pt-3 border-l-4 border-[#147D55] pl-4 bg-emerald-50/50 py-3 rounded-r">
              <p className="text-xs sm:text-sm text-emerald-950 font-medium italic">
                "{aboutContent.commitment}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
                alt="GENUGRIN Research & Quality Center"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded bg-primary-soft text-[#147D55] flex items-center justify-center shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#17324D]">Analytical Validation</p>
                <p className="text-gray-600">
                  Monograph compliance under Indian, British and United States Pharmacopoeia
                  guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="bg-white py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-[#F5F8F6] p-8 rounded-lg border border-gray-200 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-[#147D55] text-white flex items-center justify-center">
                <Compass className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#17324D]">Our Corporate Vision</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {missionVision.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-[#F5F8F6] p-8 rounded-lg border border-gray-200 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-[#17324D] text-white flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#17324D]">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {missionVision.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="section-subtitle">Guiding Tenets</span>
          <h2 className="section-title">Our Foundational Values</h2>
          <p className="text-sm text-gray-600">
            Principles that steer our manufacturing, partner interactions, and corporate decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(missionVision.values || []).map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded bg-primary-soft text-[#147D55] flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <h4 className="font-bold text-[#17324D] text-base">{val.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statutory Healthcare Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-xs sm:text-sm flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Medical Practice & Prescription Compliance Notice:</p>
            <p className="text-amber-800 leading-relaxed text-xs">
              All medicinal formulations showcased by GENUGRIN HEALTHCARE are Schedule H or
              Prescription Only drugs. We do not promote direct-to-consumer self-medication.
              Administration should strictly be executed under the prescription and clinical
              supervision of registered medical professionals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
