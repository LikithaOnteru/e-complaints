import React, { useState } from 'react';
import { MOCK_EMERGENCY_CONTACTS } from '../data/mockEmergencyContacts';
import { useApp } from '../context/AppContext';
import { PhoneCall, Building2, Droplets, Zap, HeartPulse, ShieldAlert, Trash2, AlertTriangle, Search, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmergencyContactsPage: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Droplets': return Droplets;
      case 'Zap': return Zap;
      case 'HeartPulse': return HeartPulse;
      case 'ShieldAlert': return ShieldAlert;
      case 'Trash2': return Trash2;
      default: return AlertTriangle;
    }
  };

  const filtered = MOCK_EMERGENCY_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (phone: string, name: string) => {
    showToast(`Initiating call to ${name} (${phone})`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-7 h-7 text-white animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-black">Rural Emergency Directory</h2>
          </div>
          <p className="text-red-100 text-sm mt-1">
            24/7 direct helplines for Gram Panchayat, Water Supply, Power Grid, Ambulance & Police.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
          <p className="text-[10px] uppercase font-bold text-red-200">National Emergency</p>
          <p className="text-2xl font-black text-white">112</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search emergency services, police, hospital..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none shadow-xs"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(contact => {
          const Icon = getIcon(contact.icon);
          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                    {contact.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {contact.availableHours}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contact.address}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                <a
                  href={`tel:${contact.phone}`}
                  onClick={(e) => {
                    handleCall(contact.phone, contact.name);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all btn-ripple"
                >
                  <Phone className="w-4 h-4" />
                  Call {contact.phone}
                </a>

                {contact.alternatePhone && (
                  <p className="text-[11px] text-center text-slate-400">
                    Alt Line: {contact.alternatePhone}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
