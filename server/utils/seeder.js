require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const WebsiteContent = require('../models/WebsiteContent');
const CompanySettings = require('../models/CompanySettings');
const { defaultSections } = require('../controllers/contentController');

const categoriesData = [
  {
    name: 'Anti-Infective & Antibiotics',
    slug: 'anti-infective-antibiotics',
    description: 'High-efficacy broad spectrum beta-lactams, macrolides, and cephalosporin formulations manufactured under stringent microbial controls.',
    iconName: 'ShieldAlert',
    order: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_antibiotics',
    },
  },
  {
    name: 'Cardiovascular & Anti-Hypertensive',
    slug: 'cardiovascular-anti-hypertensive',
    description: 'Targeted cardiometabolic and anti-hypertensive therapeutics formulated for consistent bioavailability and sustained vascular control.',
    iconName: 'Activity',
    order: 2,
    image: {
      url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_cardio',
    },
  },
  {
    name: 'Gastrointestinal & Hepato-Protective',
    slug: 'gastrointestinal-hepato-protective',
    description: 'Advanced proton-pump inhibitors, antacids, and prokinetic enteric-coated formulations engineered for acid-peptic management.',
    iconName: 'Stethoscope',
    order: 3,
    image: {
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_gastro',
    },
  },
  {
    name: 'Pain Management & Analgesics',
    slug: 'pain-management-analgesics',
    description: 'Potent non-steroidal anti-inflammatory drugs (NSAIDs), muscle relaxants, and enzyme combinations for acute and orthopedic indications.',
    iconName: 'HeartPulse',
    order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_pain',
    },
  },
  {
    name: 'Respiratory & Anti-Allergic',
    slug: 'respiratory-anti-allergic',
    description: 'Second-generation antihistamines, leukotriene receptor antagonists, and broncho-dilatory formulations designed for respiratory ease.',
    iconName: 'Wind',
    order: 5,
    image: {
      url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_respiratory',
    },
  },
  {
    name: 'Nutraceuticals & Antioxidants',
    slug: 'nutraceuticals-antioxidants',
    description: 'Essential micronutrient combinations, bioactive neuro-vitamins, and potent antioxidants supporting metabolic cellular vitality.',
    iconName: 'Sparkles',
    order: 6,
    image: {
      url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_nutra',
    },
  },
  {
    name: 'Dermatology & Topical Formulations',
    slug: 'dermatology-topical-formulations',
    description: 'Dermatological creams, lotions, and anti-fungal topicals formulated with high cutaneous absorption and patient tolerance.',
    iconName: 'Thermometer',
    order: 7,
    image: {
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      public_id: 'seed_cat_derma',
    },
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genugrin_healthcare';
    console.log(`[Connecting to MongoDB for Seeding]: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seeding]: Checking Super Admin...');
    const existingAdmin = await Admin.findOne({ email: 'admin@genugrinhealthcare.com' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'GENUGRIN Super Administrator',
        email: 'admin@genugrinhealthcare.com',
        password: 'Genugrin@Admin2025',
        role: 'superadmin',
        isActive: true,
      });
      console.log('[Admin Seeded]: admin@genugrinhealthcare.com / Genugrin@Admin2025');
    } else {
      console.log('[Admin Exists]: admin@genugrinhealthcare.com already registered.');
    }

    console.log('[Seeding]: Therapeutic Categories...');
    const categoryDocs = {};
    for (const catData of categoriesData) {
      let cat = await Category.findOne({ slug: catData.slug });
      if (!cat) {
        cat = await Category.create(catData);
      }
      categoryDocs[cat.slug] = cat._id;
    }
    console.log(`[Categories Verified]: ${Object.keys(categoryDocs).length} categories ready.`);

    console.log('[Seeding]: Authentic Pharmaceutical Products...');
    const productsData = [
      {
        name: 'CLAVUGRIN-625',
        slug: 'clavugrin-625',
        productCode: 'GG-ANTI-001',
        category: categoryDocs['anti-infective-antibiotics'],
        composition: 'Amoxicillin Trihydrate IP eq. to Amoxicillin 500 mg + Potassium Clavulanate Diluted IP eq. to Clavulanic Acid 125 mg',
        dosageForm: 'Tablet',
        strength: '625 mg',
        packSize: '10 x 1 x 10 Alu-Alu Blister Strip with Desiccant',
        shortDescription: 'Potent beta-lactamase resistant bactericidal antibiotic combination for upper/lower respiratory, dermatological, and urinary tract infections.',
        description: 'CLAVUGRIN-625 combines the broad-spectrum bactericidal activity of Amoxicillin with Potassium Clavulanate, a powerful irreversible inhibitor of beta-lactamase enzymes produced by penicillin-resistant organisms. Manufactured strictly in moisture-controlled cleanrooms.',
        indications: 'Lower and upper respiratory tract infections, acute bacterial sinusitis, otitis media, skin and soft tissue infections, and uncomplicated urinary tract infections caused by susceptible beta-lactamase producing pathogens.',
        storageInstructions: 'Store below 25°C in a dry place. Protect from moisture and excessive heat. Keep all medicines out of reach of children.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_clavugrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'GENUPAN-DSR',
        slug: 'genupan-dsr',
        productCode: 'GG-GAST-002',
        category: categoryDocs['gastrointestinal-hepato-protective'],
        composition: 'Pantoprazole Sodium IP (as Enteric Coated pellets) eq. to Pantoprazole 40 mg + Domperidone IP (as Sustained Release pellets) 30 mg',
        dosageForm: 'Capsule',
        strength: '40 mg / 30 mg SR',
        packSize: '10 x 10 Alu-Alu Strips',
        shortDescription: 'Dual-action enteric-coated proton-pump inhibitor with sustained-release prokinetic for persistent GERD, dyspepsia, and reflux esophagitis.',
        description: 'GENUPAN-DSR features advanced dual-pellet micro-encapsulation: enteric-coated Pantoprazole inhibits gastric acid secretion by blocking H+/K+-ATPase, while Domperidone SR accelerates gastric emptying and increases lower esophageal sphincter tone.',
        indications: 'Gastroesophageal Reflux Disease (GERD) unresponsive to single-agent therapy, non-ulcer dyspepsia, gastric and duodenal ulcers associated with motility disturbances.',
        storageInstructions: 'Store in a cool and dry place. Protect from direct sunlight and moisture.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_genupan',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'PARAGRIN-650',
        slug: 'paragrin-650',
        productCode: 'GG-PAIN-003',
        category: categoryDocs['pain-management-analgesics'],
        composition: 'Paracetamol IP 650 mg',
        dosageForm: 'Tablet',
        strength: '650 mg',
        packSize: '10 x 15 Tablets Blister Pack',
        shortDescription: 'High-purity therapeutic antipyretic and analgesic tablet formulated for rapid disintegration and reliable fever and pain control.',
        description: 'PARAGRIN-650 is a precision-compressed analgesic and antipyretic designed to achieve prompt therapeutic plasma concentration. Effective in managing pyrexia of varied etiologies, post-immunization febrile conditions, and mild to moderate somatic pain.',
        indications: 'Symptomatic relief of fever, headache, musculoskeletal aches, toothache, and mild-to-moderate arthritic discomfort.',
        storageInstructions: 'Store protected from light and moisture at temperatures not exceeding 30°C.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_paragrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'TELMIGRIN-40',
        slug: 'telmigrin-40',
        productCode: 'GG-CARD-004',
        category: categoryDocs['cardiovascular-anti-hypertensive'],
        composition: 'Telmisartan IP 40 mg',
        dosageForm: 'Tablet',
        strength: '40 mg',
        packSize: '10 x 10 Alu-Alu Pack',
        shortDescription: 'Long-acting non-peptide angiotensin II receptor blocker (ARB) providing smooth 24-hour hemodynamic control.',
        description: 'TELMIGRIN-40 provides sustained blockade of the AT1 receptor subtype, reducing systemic peripheral vascular resistance and lowering both systolic and diastolic blood pressure with negligible risk of dry cough.',
        indications: 'Essential hypertension in adult patients; reduction of cardiovascular morbidity in patients with manifest atherothrombotic cardiovascular disease.',
        storageInstructions: 'Store in moisture-proof packaging below 25°C. Do not remove tablets from blister until immediately before administration.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_telmigrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'MONTIGRIN-LC',
        slug: 'montigrin-lc',
        productCode: 'GG-RESP-005',
        category: categoryDocs['respiratory-anti-allergic'],
        composition: 'Montelukast Sodium IP eq. to Montelukast 10 mg + Levocetirizine Dihydrochloride IP 5 mg',
        dosageForm: 'Tablet',
        strength: '10 mg / 5 mg',
        packSize: '10 x 10 Alu-Alu Blister',
        shortDescription: 'Synergistic dual-action combination of a cysteinyl leukotriene receptor antagonist and non-sedating H1-receptor antihistamine.',
        description: 'MONTIGRIN-LC provides comprehensive dual-pathway management of allergic airway inflammation by simultaneously neutralizing histamine-mediated early phase symptoms and leukotriene-driven late phase airway hyperreactivity.',
        indications: 'Relief of symptoms associated with seasonal and perennial allergic rhinitis, allergic rhinoconjunctivitis, and co-morbid allergic bronchial conditions.',
        storageInstructions: 'Store protected from light and moisture, at a temperature not exceeding 25°C.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_montigrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'NEUROGRIN-OD',
        slug: 'neurogrin-od',
        productCode: 'GG-NUTR-006',
        category: categoryDocs['nutraceuticals-antioxidants'],
        composition: 'Methylcobalamin IP 1500 mcg + Alpha Lipoic Acid USP 100 mg + Folic Acid IP 1.5 mg + Pyridoxine HCl IP 3 mg',
        dosageForm: 'Capsule',
        strength: '1500 mcg Forte Complex',
        packSize: '10 x 10 Soft gelatin / Hard gelatin Blister',
        shortDescription: 'Comprehensive neuro-regenerative formula with active bioactive co-enzymatic vitamin B12 and universal intracellular antioxidant.',
        description: 'NEUROGRIN-OD supplies active Methylcobalamin, which directly participates in myelin sheath synthesis and transmethylation pathways. Combined with universal lipophilic and hydrophilic antioxidant Alpha Lipoic Acid to scavenge free radicals in neuronal tissues.',
        indications: 'Adjunct therapy in peripheral diabetic neuropathy, drug-induced neuropathies, megaloblastic anemia, and hyperhomocysteinemia.',
        storageInstructions: 'Store in a cool, dark and dry place below 25°C. Keep out of reach of children.',
        isFeatured: false,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_neurogrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'ACECLOGRIN-SP',
        slug: 'aceclogrin-sp',
        productCode: 'GG-PAIN-007',
        category: categoryDocs['pain-management-analgesics'],
        composition: 'Aceclofenac IP 100 mg + Paracetamol IP 325 mg + Serratiopeptidase IP 15 mg (eq. to 30,000 Serratiopeptidase Units)',
        dosageForm: 'Tablet',
        strength: '100 mg / 325 mg / 15 mg',
        packSize: '10 x 10 Alu-Alu Pack',
        shortDescription: 'Triple-action anti-inflammatory, analgesic and proteolytic enzyme formulation for acute musculoskeletal and post-operative trauma.',
        description: 'ACECLOGRIN-SP pairs preferential COX-2 inhibitor Aceclofenac with the established central analgesic action of Paracetamol, potentiated by Serratiopeptidase which breaks down inflammatory exudates and enhances antibiotic penetration into damaged tissues.',
        indications: 'Post-operative pain and edema, osteoarthritic acute flares, ankylosing spondylitis, sports injuries, and severe dental inflammation.',
        storageInstructions: 'Store in a dry place at temperature not exceeding 25°C. Protect from moisture and light.',
        isFeatured: false,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_aceclogrin',
            isPrimary: true,
          },
        ],
      },
      {
        name: 'AZIGRIN-500',
        slug: 'azigrin-500',
        productCode: 'GG-ANTI-008',
        category: categoryDocs['anti-infective-antibiotics'],
        composition: 'Azithromycin Dihydrate IP eq. to Azithromycin (Anhydrous) 500 mg',
        dosageForm: 'Tablet',
        strength: '500 mg',
        packSize: '1 x 3 Film-coated Tablets Blister Strip',
        shortDescription: 'Extended half-life azalide antibiotic with high intracellular tissue penetration for bacterial respiratory and urogenital infections.',
        description: 'AZIGRIN-500 binds selectively to the 50S ribosomal subunit of susceptible microorganisms, inhibiting bacterial protein synthesis. Features prolonged tissue half-life permitting convenient once-daily short course dosing.',
        indications: 'Community-acquired pneumonia, acute exacerbations of chronic bronchitis, pharyngitis/tonsillitis, uncomplicated skin infections, and non-gonococcal urethritis.',
        storageInstructions: 'Store protected from heat and moisture below 30°C.',
        isFeatured: true,
        isActive: true,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
            public_id: 'seed_prod_azigrin',
            isPrimary: true,
          },
        ],
      },
    ];

    for (const p of productsData) {
      const exists = await Product.findOne({ slug: p.slug });
      if (!exists) {
        await Product.create(p);
      }
    }
    console.log(`[Products Seeded / Verified]: Completed.`);

    console.log('[Seeding]: Website Content Sections...');
    for (const sectionKey of Object.keys(defaultSections)) {
      const exists = await WebsiteContent.findOne({ sectionKey });
      if (!exists) {
        await WebsiteContent.create(defaultSections[sectionKey]);
      }
    }
    console.log('[Website Content]: Initialized successfully.');

    console.log('[Seeding]: Company Profile Settings...');
    let settings = await CompanySettings.findOne();
    if (!settings) {
      await CompanySettings.create({
        companyName: 'GENUGRIN HEALTHCARE',
        tagline: 'Dedicated to Life, Committed to Quality',
        developerCredit: "Brajwasi's Coders",
        registeredAddress: 'Corporate Office: Plot No. 42, Pharma City, Industrial Area Phase II, India',
        email: 'info@genugrinhealthcare.com',
        phone: '+91 98765 43210',
        businessHours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST',
      });
      console.log('[Settings]: Seeded company settings.');
    }

    console.log('========================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!              ');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Database Seeding Failed]:', error);
    process.exit(1);
  }
};

seedDatabase();
