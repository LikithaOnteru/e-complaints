import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, StatusType, PriorityType } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { Modal } from '../components/ui/Modal';
import { 
  FileText, 
  Search, 
  Filter, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminComplaintsPage: React.FC = () => {
  const { complaints, updateComplaintStatus, assignOfficer, navigateTo, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterVillage, setFilterVillage] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  // Status Modal form states
  const [newStatus, setNewStatus] = useState<StatusType>('In Progress');
  const [remarkText, setRemarkText] = useState<string>('');

  // Assign Modal form states
  const [officerName, setOfficerName] = useState<string>('Er. Suresh Verma');
  const [department, setDepartment] = useState<string>('Public Works Dept (PWD)');
  const [contact, setContact] = useState<string>('+91 94150 88210');

  // Filter complaints
  const filtered = complaints.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchVillage = filterVillage === 'All' || c.village === filterVillage;
    const matchPrio = filterPriority === 'All' || c.priority === filterPriority;
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchCat && matchVillage && matchPrio && matchStatus;
  });

  const openStatusModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setRemarkText('');
    setStatusModalOpen(true);
  };

  const openAssignModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setOfficerName(c.assignedOfficer?.name || 'Er. Suresh Verma');
    setDepartment(c.assignedOfficer?.department || 'Public Works Dept (PWD)');
    setContact(c.assignedOfficer?.contact || '+91 94150 88210');
    setAssignModalOpen(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, newStatus, remarkText);
    setStatusModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    assignOfficer(selectedComplaint.id, { name: officerName, department, contact });
    setAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Admin Grievance Management</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Filter, inspect photo evidence, assign departmental officers, and update resolution statuses.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-xs font-bold text-blue-700 dark:text-blue-300">
          Total Grievances: {complaints.length}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search ID, title, citizen..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Drainage">Drainage</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Garbage">Garbage</option>
          <option value="Street Light">Street Light</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={filterVillage}
          onChange={e => setFilterVillage(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Villages</option>
          <option value="Rampur">Rampur</option>
          <option value="Sundarpur">Sundarpur</option>
          <option value="Gopalpur">Gopalpur</option>
          <option value="Haripur">Haripur</option>
          <option value="Belpur">Belpur</option>
          <option value="Krishnanagar">Krishnanagar</option>
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Complaints Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-4 px-4">Complaint ID</th>
                <th className="py-4 px-4">Citizen & Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Village</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Assigned Officer</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
              {filtered.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  <td className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{c.title}</p>
                    <p className="text-[11px] text-slate-400">By: {c.citizenName}</p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                    {c.category}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                    {c.village} ({c.wardNumber})
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <PriorityBadge priority={c.priority} size="sm" />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                    {c.assignedOfficer ? c.assignedOfficer.name : <span className="text-amber-500 italic">Unassigned</span>}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigateTo('complaint_details', c.id)}
                        title="View Full Case Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openAssignModal(c)}
                        title="Assign Departmental Officer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openStatusModal(c)}
                        title="Update Resolution Status"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Status Modal */}
      {selectedComplaint && (
        <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Update Status: ${selectedComplaint.id}`}>
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Select New Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Pending', 'In Progress', 'Resolved', 'Rejected'] as StatusType[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      newStatus === s
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Official Authority Remarks
              </label>
              <textarea
                rows={3}
                value={remarkText}
                onChange={e => setRemarkText(e.target.value)}
                placeholder="Enter field update or reason for resolution/rejection..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Officer Modal */}
      {selectedComplaint && (
        <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title={`Assign Officer: ${selectedComplaint.id}`}>
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Officer Name</label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
              >
                Assign Officer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
