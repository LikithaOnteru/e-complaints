import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToCSV, exportToExcel } from '../utils/exportHelper';
import { FileText, Download, Printer, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const AdminReportsPage: React.FC = () => {
  const { complaints, showToast } = useApp();

  const [repCategory, setRepCategory] = useState<string>('All');
  const [repStatus, setRepStatus] = useState<string>('All');
  const [repVillage, setRepVillage] = useState<string>('All');
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);

  const filtered = complaints.filter(c => {
    const matchCat = repCategory === 'All' || c.category === repCategory;
    const matchStatus = repStatus === 'All' || c.status === repStatus;
    const matchVillage = repVillage === 'All' || c.village === repVillage;
    return matchCat && matchStatus && matchVillage;
  });

  const handleDownloadCSV = () => {
    exportToCSV(filtered, `rural_grievance_report_${repCategory}_${repVillage}.csv`);
    showToast('Downloaded CSV report file', 'success');
  };

  const handleDownloadExcel = () => {
    exportToExcel(filtered, `rural_grievance_export_${repCategory}_${repVillage}.xls`);
    showToast('Downloaded Excel report file', 'success');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Custom Report Generator</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate and export official municipal grievance reports in PDF, Excel, or CSV formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export Excel
          </button>
          <button
            onClick={() => setPdfModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md btn-ripple"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Preview
          </button>
        </div>
      </div>

      {/* Filter Parameters Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Report Criteria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select
              value={repCategory}
              onChange={e => setRepCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Resolution Status</label>
            <select
              value={repStatus}
              onChange={e => setRepStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Village Sector</label>
            <select
              value={repVillage}
              onChange={e => setRepVillage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
            >
              <option value="All">All Villages</option>
              <option value="Rampur">Rampur</option>
              <option value="Sundarpur">Sundarpur</option>
              <option value="Gopalpur">Gopalpur</option>
              <option value="Haripur">Haripur</option>
              <option value="Belpur">Belpur</option>
              <option value="Krishnanagar">Krishnanagar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Summary Preview Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Generated Records ({filtered.length})</h3>
          <span className="text-xs font-semibold text-slate-500">Ready for Download</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Village</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="py-3 px-3 font-bold text-blue-600">{c.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{c.title}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{c.category}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{c.village}</td>
                  <td className="py-3 px-3 font-semibold">{c.priority}</td>
                  <td className="py-3 px-3 font-semibold">{c.status}</td>
                  <td className="py-3 px-3 text-slate-500">{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Printable Modal */}
      <Modal isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} title="Printable PDF Document Preview" maxWidth="2xl">
        <div className="space-y-6 p-2 text-slate-900 dark:text-white">
          <div className="text-center border-b pb-4 space-y-1">
            <h2 className="text-2xl font-black">OFFICIAL GRAM PANCHAYAT GRIEVANCE REPORT</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">E-Rural Complaints Portal • Varanasi Division</p>
            <p className="text-xs text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border">
            <div><strong>Category:</strong> {repCategory}</div>
            <div><strong>Village:</strong> {repVillage}</div>
            <div><strong>Total Records:</strong> {filtered.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Village</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Officer</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2 border font-bold">{c.id}</td>
                    <td className="p-2 border">{c.title}</td>
                    <td className="p-2 border">{c.village}</td>
                    <td className="p-2 border font-semibold">{c.status}</td>
                    <td className="p-2 border">{c.assignedOfficer?.name || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t no-print">
            <button
              type="button"
              onClick={() => setPdfModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Document
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
