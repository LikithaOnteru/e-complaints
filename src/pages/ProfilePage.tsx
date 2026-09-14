import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_BADGES } from '../data/mockBadges';
import { User, Phone, MapPin, Mail, Award, Edit3, ShieldCheck, Star, Users, Leaf, Crown, LogOut } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { currentUser, complaints, showToast, logout } = useApp();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Krishna Rao');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98480 12345');
  const [village, setVillage] = useState(currentUser?.village || 'Penumaka');
  const [ward, setWard] = useState(currentUser?.ward || 'Ward 4 (Tadepalle Mandal, Guntur Dist, AP)');

  const citizenComplaints = complaints.filter(
    c => c.citizenEmail === currentUser?.email || c.citizenName === currentUser?.name
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile details updated successfully', 'success');
    setEditModalOpen(false);
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return Award;
      case 'ShieldCheck': return ShieldCheck;
      case 'Users': return Users;
      case 'Leaf': return Leaf;
      case 'Star': return Star;
      case 'Crown': return Crown;
      default: return Award;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20 shrink-0">
            {currentUser?.name.charAt(0) || 'R'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser?.name || 'Ramesh Singh'}
                </h2>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                  Role: {currentUser?.role || 'Citizen (Villager)'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-center sm:self-auto">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  Edit Profile
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors border border-rose-200 dark:border-rose-900/60 shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                {currentUser?.phone || '+91 98765 43210'}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {currentUser?.village || 'Rampur'} ({currentUser?.ward || 'Ward 3'})
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-purple-600" />
                {currentUser?.email || 'citizen@test.com'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
          <p className="text-2xl font-black text-blue-600">{citizenComplaints.length}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Total Submitted</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
          <p className="text-2xl font-black text-emerald-600">
            {citizenComplaints.filter(c => c.status === 'Resolved').length}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Resolved</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
          <p className="text-2xl font-black text-amber-600">
            {citizenComplaints.filter(c => c.status === 'Pending').length}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Pending</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
          <p className="text-2xl font-black text-purple-600">4 / 6</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Badges Unlocked</p>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Community Achievement Badges</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Earn rewards by actively participating in rural civic improvements.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
            Level 2 Resident
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_BADGES.map(badge => {
            const Icon = getBadgeIcon(badge.iconName);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/80 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{badge.title}</h4>
                    <span className={`text-[10px] font-bold ${badge.unlocked ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Citizen Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Ward Number</label>
              <input
                type="text"
                value={ward}
                onChange={e => setWard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
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
    </div>
  );
};
