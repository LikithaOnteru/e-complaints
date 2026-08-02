import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Building2, User, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, Languages, Users, MapPin } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { motion } from 'framer-motion';
import { Language } from '../data/translations';

export const LoginPage: React.FC = () => {
  const { login, showToast, language, setLanguage, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [email, setEmail] = useState<string>('krishna.rao@ap.gov.in');
  const [password, setPassword] = useState<string>('123456');
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setEmail('krishna.rao@ap.gov.in');
      setPassword('123456');
    } else if (role === 'volunteer') {
      setEmail('volunteer.ap@ap.gov.in');
      setPassword('123456');
    } else {
      setEmail('admin.ap@ap.gov.in');
      setPassword('123456');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your login email or mobile number', 'warning');
      return;
    }
    const success = login(email, selectedRole);
    if (!success) {
      showToast('Invalid login credentials.', 'error');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Password reset link sent to ${resetEmail || email} (Simulation)`, 'info');
    setForgotModalOpen(false);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Header Icon & Portal Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-emerald-600 to-green-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.loginHeading}
            </h2>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
              {t.portalSubtitle}
            </p>
          </div>

          {/* Language Selector Bar */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <Languages className="w-4 h-4 text-blue-600 ml-2 mr-1" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  language === 'te'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>

        {/* Clean Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 dark:border-slate-700 space-y-6">
          
          {/* 3 Role Selector Tabs: Citizen, Volunteer, Admin */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
              {t.selectRole}
            </label>

            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleRoleChange('citizen')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedRole === 'citizen'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{language === 'te' ? 'పౌరుడు' : language === 'hi' ? 'नागरिक' : 'Citizen'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('volunteer')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedRole === 'volunteer'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-purple-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>{language === 'te' ? 'వాలంటీర్' : language === 'hi' ? 'वॉलंटियर' : 'Volunteer'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{language === 'te' ? 'అడ్మిన్' : language === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </button>
            </div>
          </div>

          {/* Location & Account Badge for Default Citizen Krishna Rao */}
          {selectedRole === 'citizen' && (
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Default Citizen: Krishna Rao
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">Active</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Penumaka Village, Tadepalle Mandal, Guntur Dist, Andhra Pradesh
              </p>
            </div>
          )}

          {selectedRole === 'volunteer' && (
            <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-200">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  Grama Sachivalayam Volunteer: M. Venkateswarlu
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px]">Staff</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium pt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                Undavalli Village, Tadepalle Mandal, Guntur Dist, Andhra Pradesh
              </p>
            </div>
          )}

          {selectedRole === 'admin' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  District Officer: Panchayati Raj Admin
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">Officer</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                NTR & Guntur Districts Command Center, Andhra Pradesh
              </p>
            </div>
          )}

          {/* Quick Demo Pre-fill Notice Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t.demoNotice}</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="font-bold underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              {t.oneClickLogin}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 btn-ripple"
            >
              {t.signInBtn}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal isOpen={forgotModalOpen} onClose={() => setForgotModalOpen(false)} title="Reset Password (AP Grama Sachivalayam)">
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Enter your registered email address or mobile number to receive an OTP to reset your password.
          </p>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={resetEmail || email}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="krishna.rao@ap.gov.in"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              Send OTP Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
