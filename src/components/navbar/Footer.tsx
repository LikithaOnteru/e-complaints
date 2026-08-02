import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Phone, Mail, Shield, Heart, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, resetDemoData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">E-Rural Complaints</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering rural communities with a transparent, fast, and digital grievance management platform for civic resolution.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Smart Rural Governance Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('landing')} className="hover:text-blue-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('register_complaint')} className="hover:text-blue-400 transition-colors">
                  Register Grievance
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track_complaint')} className="hover:text-blue-400 transition-colors">
                  Track Complaint Status
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('village_map')} className="hover:text-blue-400 transition-colors">
                  Interactive Village Map
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('emergency_contacts')} className="hover:text-blue-400 transition-colors">
                  Emergency Helplines
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <p className="font-semibold text-slate-200 text-xs">Citizen Login</p>
                <p className="text-xs text-blue-400">citizen@test.com / 123456</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <p className="font-semibold text-slate-200 text-xs">Admin Login</p>
                <p className="text-xs text-emerald-400">admin@test.com / 123456</p>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Toll Free Helpline: 1800-180-2026</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@eruralcomplaints.gov.in</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetDemoData}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  Reset 30 Demo Complaints
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 E-Rural Complaints System. Designed for College Project Demonstration.</p>
          <p className="flex items-center gap-1">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
