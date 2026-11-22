import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Loader2,
  Building,
  Mail,
  Phone,
  Pill,
} from 'lucide-react';
import { enquiryService } from '../services/api';

const statusColors = {
  New: 'bg-amber-100 text-amber-800 border-amber-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Closed: 'bg-gray-100 text-gray-700 border-gray-300',
};

const EnquiriesList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState('New');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (typeFilter !== 'All') params.enquiryType = typeFilter;

      const res = await enquiryService.getAll(params);
      if (res.data) {
        setEnquiries(res.data.enquiries || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn('Failed to load enquiries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const openDetailModal = (enq) => {
    setSelectedEnquiry(enq);
    setCurrentStatus(enq.status || 'New');
    setInternalNotes(enq.internalNotes || '');
    setModalOpen(true);
  };

  const handleSaveDetails = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      await enquiryService.update(selectedEnquiry._id, {
        status: currentStatus,
        internalNotes,
      });

      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === selectedEnquiry._id
            ? { ...e, status: currentStatus, internalNotes }
            : e
        )
      );

      setModalOpen(false);
    } catch (err) {
      alert('Failed to update enquiry status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry record permanently?')) {
      try {
        await enquiryService.delete(id);
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (selectedEnquiry?._id === id) {
          setModalOpen(false);
        }
      } catch (err) {
        alert('Failed to delete enquiry.');
      }
    }
  };

  const handleExportCSV = () => {
    const params = {};
    if (statusFilter !== 'All') params.status = statusFilter;
    if (typeFilter !== 'All') params.enquiryType = typeFilter;
    const url = enquiryService.exportCSVUrl(params);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17324D]">
            Corporate Enquiry Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Review incoming queries from hospitals, distributors, stockists, and clinicians.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-[#17324D] text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-[#147D55]" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] outline-none"
          >
            <option value="All">All Enquiry Types</option>
            <option value="General Enquiry">General Enquiry</option>
            <option value="Product Enquiry">Product Enquiry</option>
            <option value="Business Partnership">Business Partnership</option>
            <option value="Distribution Enquiry">Distribution Enquiry</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8F6] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Sender & Contact</th>
                <th className="py-3 px-4">Subject & Product</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#147D55] mx-auto mb-2" />
                    <span>Loading corporate enquiries...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    No enquiries match the current filters.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-sm text-[#17324D]">{enq.fullName}</p>
                      <p className="text-[11px] text-gray-500">{enq.email}</p>
                      <p className="text-[11px] text-gray-500">{enq.phone}</p>
                      {enq.organization && (
                        <p className="text-[10px] text-emerald-800 font-medium">{enq.organization}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-gray-800 line-clamp-1">{enq.subject}</p>
                      {enq.productName && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-[#147D55] bg-primary-soft px-1.5 py-0.5 rounded mt-1">
                          <Pill className="w-3 h-3" />
                          <span>{enq.productName}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{enq.enquiryType}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          statusColors[enq.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openDetailModal(enq)}
                        className="inline-block p-1 text-[#147D55] hover:text-[#0d5c3e]"
                        title="View & Process"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(enq._id)}
                        className="inline-block p-1 text-red-500 hover:text-red-700"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Enquiry Detail Modal */}
      {modalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 text-[#252D35] border border-gray-200 space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <span className="text-[10px] font-bold text-[#147D55] uppercase tracking-wider bg-primary-soft px-2 py-0.5 rounded">
                {selectedEnquiry.enquiryType}
              </span>
              <h2 className="text-xl font-bold font-heading text-[#17324D] mt-1.5">
                {selectedEnquiry.subject}
              </h2>
              <p className="text-xs text-gray-500">
                Logged on {new Date(selectedEnquiry.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Sender Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F8F6] p-3 rounded border border-gray-200">
              <div>
                <span className="text-gray-500 block">Full Name:</span>
                <span className="font-bold text-gray-800">{selectedEnquiry.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Organization:</span>
                <span className="font-bold text-gray-800">
                  {selectedEnquiry.organization || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Email Address:</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-medium text-[#147D55] hover:underline"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500 block">Phone Number:</span>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="font-medium text-gray-800"
                >
                  {selectedEnquiry.phone}
                </a>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-1">
                Communication Body:
              </span>
              <div className="bg-white p-3 rounded border border-gray-300 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status & Internal Notes */}
            <div className="space-y-3 pt-2 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Enquiry Status
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-[#147D55] outline-none"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows="3"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record follow-up actions, designated sales rep, quotation details..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#147D55] outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDelete(selectedEnquiry._id)}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <div className="space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-medium rounded text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={updating}
                  className="px-6 py-2 bg-[#147D55] hover:bg-[#0d5c3e] text-white text-xs font-semibold rounded shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesList;
