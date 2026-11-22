# GENUGRIN HEALTHCARE – OFFICIAL CORPORATE PHARMACEUTICAL PORTAL & CMS

> **Dedicated to Life, Committed to Quality**  
> Developed with precision by **Brajwasi's Coders**

---

## 1. Project Overview

**GENUGRIN HEALTHCARE** is a complete, production-ready corporate pharmaceutical portal and content management system (CMS) tailored to the standards of leading pharmaceutical institutions (such as Cadila Pharmaceuticals and Zydus Lifesciences). 

The platform features:
- **Corporate Pharmaceutical Identity**: Deep Healthcare Green (`#147D55`) and Dark Navy (`#17324D`) branding, clean typography, and verified monograph presentation.
- **Dynamic Product Catalogue**: Search by brand name/active chemical composition, filter by therapeutic segment, filter by dosage form (Tablets, Capsules, Syrups, Injections, etc.), and sort alphabetically.
- **Detailed Formulation Pages**: Active ingredients (IP/BP/USP), strengths, packaging units, storage protocols, approved indications, and statutory prescription warnings.
- **Cloudinary Image Asset Pipeline**: Multiple image upload, live thumbnail switcher, image deletion/replacement, and automatic safe deletion of obsolete cloud assets.
- **Comprehensive Admin Panel**: Role-based authentication, interactive dashboard metrics, product management, therapeutic category manager, corporate enquiry CRM with CSV export, and dynamic website content CMS.
- **Strict Compliance & Integrity**: Transparent regulatory declarations and Schedule H / Prescription Only notices without fabricated badges.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v18+) with Vite
- **Styling**: Tailwind CSS with custom healthcare palette
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Bearer interceptor
- **Icons**: Lucide React Icons
- **Animations**: Framer Motion (subtle, non-distracting corporate transitions)

### Backend
- **Runtime**: Node.js & Express.js
- **Architecture**: RESTful API with structured controllers, routes, and middleware
- **Authentication**: JSON Web Tokens (JWT) & bcrypt password hashing
- **Uploads**: Multer memory storage integrated with Cloudinary API
- **Security**: Helmet security headers, CORS origin validation, Rate Limiting, Input Sanitization

### Database & Storage
- **Database**: MongoDB Atlas using Mongoose ODM
- **Media Hosting**: Cloudinary SDK (storing secure URLs and public IDs)

---

## 3. Project Architecture

```
Genugrin/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── admin/
│   │   │   ├── CategoriesList.jsx
│   │   │   ├── CompanySettings.jsx
│   │   │   ├── ContentManagement.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EnquiriesList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductsList.jsx
│   │   │   └── ProfileSettings.jsx
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── EnquiryModal.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SettingsContext.jsx
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── QualityAssurance.jsx
│   │   │   └── TherapeuticSegments.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── contentController.js
│   │   ├── dashboardController.js
│   │   ├── enquiryController.js
│   │   ├── productController.js
│   │   └── settingsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Category.js
│   │   ├── CompanySettings.js
│   │   ├── Enquiry.js
│   │   ├── Product.js
│   │   └── WebsiteContent.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── contentRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── productRoutes.js
│   │   └── settingsRoutes.js
│   ├── utils/
│   │   ├── cloudinaryUploader.js
│   │   └── seeder.js
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
```

---

## 4. Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas URI)
- Cloudinary Account (Cloud Name, API Key, API Secret)

### Step 1: Clone and Configure Environment Variables

#### Server Environment (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/genugrin_db?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_pharmaceutical_2025
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Client Environment (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 3: Run Database Seeder
To initialize default therapeutic segments, authentic formulations (e.g., CLAVUGRIN-625, GENUPAN-DSR, PARAGRIN-650, TELMIGRIN-40), website CMS content, and the initial Super Admin:
```bash
cd server
npm run seed
```

> **Default Seeded Admin Credentials:**
> - **Email**: `admin@genugrinhealthcare.com`
> - **Password**: `Genugrin@Admin2025`
> *(Note: Password can and should be updated immediately via `/admin/profile`)*

### Step 4: Start Development Servers

```bash
# Terminal 1: Start Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend Application (Port 5173)
cd client
npm run dev
```

---

## 5. Production Deployment Guide

### A. Frontend Deployment (Vercel)
1. Push repository to GitHub/GitLab.
2. In Vercel, click **New Project** and select the repository.
3. Set **Root Directory** to `client`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
6. Deploy! (`client/vercel.json` already contains the SPA rewrite rules).

### B. Backend Deployment (Render)
1. In Render dashboard, create a **New Web Service**.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets this automatically)
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `MONGODB_URI`: `mongodb+srv://...`
   - `JWT_SECRET`: `your_random_secure_secret_hash`
   - `CLOUDINARY_CLOUD_NAME`: `...`
   - `CLOUDINARY_API_KEY`: `...`
   - `CLOUDINARY_API_SECRET`: `...`
6. Click **Deploy Web Service**.

### C. Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Under **Network Access**, allow IP `0.0.0.0/0` (or Render's outbound IPs).
3. Under **Database Access**, create a user with Read and Write permissions.
4. Copy the connection string into `MONGODB_URI`.
5. Run `npm run seed` once to populate initial pharmaceutical datasets.

### D. Cloudinary Asset Management
1. In Cloudinary Console, copy **Cloud name**, **API Key**, and **API Secret**.
2. Visuals uploaded through Admin Panel are organized in `genugrin/products/` and `genugrin/categories/`.
3. When formulations are deleted or replaced, obsolete assets are cleaned up automatically.

---

## 6. Key Features & Endpoints

### Public Endpoints
- `GET /api/products`: Paginated catalogue with query filters (`search`, `category`, `dosageForm`, `sort`).
- `GET /api/products/:slug`: Monograph details and related formulations.
- `GET /api/categories`: Active therapeutic segments with real-time product counts.
- `POST /api/enquiries`: Rate-limited contact/inquiry submission.
- `GET /api/content`: Dynamic website content CMS data.
- `GET /api/settings`: Corporate profile, address, and social coordinates.
- `GET /sitemap.xml`: Dynamic XML sitemap indexing all active formulations for search engines.

### Protected Admin Endpoints (Requires `Bearer <JWT_TOKEN>`)
- `POST /api/auth/login`: Administrative sign-in.
- `GET /api/dashboard/stats`: Database metric aggregations.
- `POST /api/products`: Multi-image Cloudinary upload and formulation creation.
- `PUT /api/products/:id`: Edit formulation, append or replace imagery.
- `DELETE /api/products/:id`: Delete formulation and purge Cloudinary files.
- `GET /api/enquiries/export/csv`: Export filtered enquiries to CSV.
- `PUT /api/content/:sectionKey`: Update website copy in real time.

---

## 7. Developer Credit

Built with clean architecture, enterprise security, and verified pharmaceutical monograph compliance by **Brajwasi's Coders**.
