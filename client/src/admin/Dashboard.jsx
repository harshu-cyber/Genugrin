import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Layers,
  Inbox,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Dashboard stats error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#147D55] mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Aggregating database statistics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  };

  const recentProducts = data?.recentProducts || [];
  const recentEnquiries = data?.recentEnquiries || [];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17324D]">
            Corporate Control Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time analytics and management for GENUGRIN HEALTHCARE official operations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Add Formulation</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded transition-colors"
          >
            <Inbox className="w-4 h-4 text-[#147D55]" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Formulations</span>
            <div className="w-8 h-8 rounded bg-primary-soft text-[#147D55] flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#17324D]">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              ({stats.activeProducts} Active)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">Database recorded formulations</p>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Therapeutic Segments</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#17324D]">
              {stats.totalCategories}
            </span>
          </div>
          <p className="text-[11px] text-gray-500">Specialized clinical categories</p>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#17324D]">
              {stats.totalEnquiries}
            </span>
          </div>
          <p className="text-[11px] text-gray-500">From clinicians & distribution partners</p>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-lg border border-amber-200 bg-amber-50/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold uppercase tracking-wider">New Enquiries</span>
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
              {stats.newEnquiries}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-amber-800">Pending review in registry</p>
        </div>
      </div>

      {/* Two Column Section: Recent Products & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#17324D]">Recently Added Formulations</h2>
              <p className="text-xs text-gray-500">Latest pharmaceutical molecules in catalogue</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#147D55] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F6] text-gray-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No products found. Click "Add Formulation" to start.
                    </td>
                  </tr>
                ) : (
                  recentProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-semibold text-[#17324D]">
                        {p.name}
                        {p.productCode && (
                          <span className="block text-[10px] text-gray-400 font-mono">
                            {p.productCode}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-600">{p.category?.name || 'Unassigned'}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                          {p.dosageForm}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.isActive ? (
                          <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-500 font-semibold text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="text-[#147D55] hover:underline font-semibold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#17324D]">Recent Corporate Enquiries</h2>
              <p className="text-xs text-gray-500">Incoming partner inquiries</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-[#147D55] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No inquiries logged yet.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="p-3 bg-[#F5F8F6] rounded border border-gray-200/80 space-y-1.5 hover:border-[#147D55]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17324D]">{enq.fullName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        enq.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : enq.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium truncate">{enq.subject}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>{enq.enquiryType}</span>
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
