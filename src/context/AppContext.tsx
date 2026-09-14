import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, User, NotificationItem, Role, StatusType, TimelineEvent } from '../types';
import { 
  getStoredComplaints, 
  saveStoredComplaints, 
  resetStoredComplaints, 
  getStoredUser, 
  saveStoredUser,
  getStoredRegisteredUsers,
  addStoredUser
} from '../utils/storage';
import { api } from '../utils/api';
import { Language, TRANSLATIONS, TranslationStrings } from '../data/translations';

export type ActiveView = 
  | 'landing'
  | 'login'
  | 'citizen_dashboard'
  | 'register_complaint'
  | 'track_complaint'
  | 'complaint_details'
  | 'my_complaints'
  | 'notifications'
  | 'profile'
  | 'emergency_contacts'
  | 'admin_dashboard'
  | 'admin_complaints'
  | 'admin_analytics'
  | 'admin_reports'
  | 'village_map';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  complaints: Complaint[];
  activeView: ActiveView;
  selectedComplaintId: string | null;
  darkMode: boolean;
  notifications: NotificationItem[];
  toast: ToastState | null;
  language: Language;
  t: TranslationStrings;
  
  // Navigation & view state
  navigateTo: (view: ActiveView, complaintId?: string | null) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  
  // Auth
  login: (email: string, role: Role, password?: string) => Promise<boolean>;
  registerUser: (userData: { name: string; email: string; role: Role; password?: string; phone?: string; village?: string; ward?: string }) => Promise<boolean>;
  logout: () => void;
  
  // Complaints CRUD
  addComplaint: (newComplaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'remarks' | 'status'>) => string;
  updateComplaintStatus: (id: string, newStatus: StatusType, remarkText?: string) => void;
  addProgressUpdate: (id: string, update: { stage: string; description: string; status?: StatusType; proofUrl?: string; progressPercent?: number }) => void;
  assignOfficer: (id: string, officer: { name: string; department: string; contact?: string }) => void;
  addRemark: (id: string, text: string) => void;
  addRating: (id: string, rating: number, feedback?: string) => void;
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Work Started on ERC-2026-001',
    message: 'Er. K. Srinivasa Rao (AP R&B) deployed asphalt patch work team at Penumaka Main Road.',
    timestamp: '2026-07-30 02:15 PM',
    read: false,
    type: 'status_change',
    complaintId: 'ERC-2026-001',
  },
  {
    id: 'n2',
    title: 'Grievance Resolved: ERC-2026-003',
    message: 'Drainage blockage at Kankipadu ZP High School has been successfully cleared by AP Panchayati Raj!',
    timestamp: '2026-07-22 04:30 PM',
    read: false,
    type: 'resolved',
    complaintId: 'ERC-2026-003',
  },
  {
    id: 'n3',
    title: 'Officer Assigned to ERC-2026-004',
    message: 'Er. V. Ramanjaneyulu (APSPDCL) assigned to Tullur streetlight battery repair.',
    timestamp: '2026-08-01 08:00 AM',
    read: true,
    type: 'officer_assigned',
    complaintId: 'ERC-2026-004',
  },
];

export const DEFAULT_CITIZEN_USER: User = {
  id: 'usr_krishna_rao',
  name: 'Krishna Rao',
  email: 'krishna.rao@ap.gov.in',
  role: 'citizen',
  phone: '+91 98480 12345',
  village: 'Penumaka',
  ward: 'Ward 4 (Tadepalle Mandal, Guntur Dist, AP)',
  badges: ['b1', 'b2', 'b3', 'b4'],
  totalComplaintsSubmitted: 4,
};

export const DEFAULT_VOLUNTEER_USER: User = {
  id: 'usr_volunteer_ap',
  name: 'M. Venkateswarlu',
  email: 'volunteer.ap@ap.gov.in',
  role: 'volunteer',
  phone: '+91 98490 54321',
  village: 'Undavalli Village, AP',
  ward: 'Gram Sachivalayam Ward 2',
  badges: ['b1', 'b2'],
  totalComplaintsSubmitted: 2,
};

export const DEFAULT_ADMIN_USER: User = {
  id: 'usr_admin_ap',
  name: 'District Officer (Panchayati Raj AP)',
  email: 'admin.ap@ap.gov.in',
  role: 'admin',
  phone: '+91 94400 99887',
  village: 'Guntur & NTR District HQ, AP',
};

function parseLocationHash(): { view: ActiveView; complaintId: string | null } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { view: 'landing', complaintId: null };
  const [viewPart, queryPart] = hash.split('?');
  const view = (viewPart as ActiveView) || 'landing';
  const params = new URLSearchParams(queryPart || '');
  const complaintId = params.get('id');
  return { view, complaintId };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLoc = parseLocationHash();
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints);
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [activeView, setActiveView] = useState<ActiveView>(initialLoc.view);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(initialLoc.complaintId);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('erural_lang') as Language) || 'en';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('erural_theme') === 'dark';
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<ToastState | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Sync with Express Backend API on Mount
  useEffect(() => {
    async function loadBackendData() {
      const remoteComplaints = await api.getComplaints();
      if (remoteComplaints && remoteComplaints.length > 0) {
        setComplaints(remoteComplaints);
      }
      const remoteNotifications = await api.getNotifications();
      if (remoteNotifications && remoteNotifications.length > 0) {
        setNotifications(remoteNotifications);
      }
      const remoteUsers = await api.getUsers();
      if (remoteUsers && remoteUsers.length > 0) {
        remoteUsers.forEach(u => addStoredUser(u));
      }
    }
    loadBackendData();
  }, []);

  // Listen to Browser Back and Forward Button Events (Chrome history navigation)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setActiveView(event.state.view);
        setSelectedComplaintId(event.state.complaintId || null);
      } else {
        const { view, complaintId } = parseLocationHash();
        setActiveView(view);
        setSelectedComplaintId(complaintId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('erural_lang', lang);
    showToast(lang === 'te' ? 'భాష తెలుగుకి మార్చబడింది' : lang === 'hi' ? 'भाषा हिंदी में बदली गई' : 'Language changed to English', 'info');
  };

  // Sync theme with HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('erural_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('erural_theme', 'light');
    }
  }, [darkMode]);

  // Sync complaints with localStorage
  useEffect(() => {
    saveStoredComplaints(complaints);
  }, [complaints]);

  // Sync user with localStorage
  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const navigateTo = (view: ActiveView, complaintId: string | null = null, replace = false) => {
    setActiveView(view);
    if (complaintId !== undefined) {
      setSelectedComplaintId(complaintId);
    }

    const hash = complaintId ? `#/${view}?id=${complaintId}` : `#/${view}`;
    const stateObj = { view, complaintId };

    if (replace) {
      window.history.replaceState(stateObj, '', hash);
    } else {
      window.history.pushState(stateObj, '', hash);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email: string, role: Role, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Backend Auth API
    const apiRes = await api.login(email, role, password);
    if (apiRes && apiRes.success && apiRes.user) {
      setCurrentUser(apiRes.user);
      addStoredUser(apiRes.user);
      showToast(`Welcome back, ${apiRes.user.name}! Logged in successfully.`, 'success');
      navigateTo(apiRes.user.role === 'admin' ? 'admin_dashboard' : 'citizen_dashboard');
      return true;
    } else if (apiRes && apiRes.error) {
      showToast(apiRes.error, 'error');
      return false;
    }

    // 2. Fallback to registered accounts in localStorage if API offline
    const registered = getStoredRegisteredUsers();
    const foundUser = registered.find(
      u => u.email.toLowerCase() === cleanEmail || (u.phone && u.phone.includes(cleanEmail))
    );

    if (foundUser) {
      if (foundUser.password && password && foundUser.password !== password) {
        showToast('Incorrect password. Please check your credentials.', 'error');
        return false;
      }
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}! Logged in successfully.`, 'success');
      navigateTo(foundUser.role === 'admin' ? 'admin_dashboard' : 'citizen_dashboard');
      return true;
    }

    showToast('Account not found. Please create an account first.', 'error');
    return false;
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    role: Role;
    password?: string;
    phone?: string;
    village?: string;
    ward?: string;
  }): Promise<boolean> => {
    // 1. Send registration to Express Backend
    const apiRes = await api.register(userData);
    
    const newUser: User = apiRes?.user || {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: userData.password,
      phone: userData.phone || '',
      village: userData.village || 'Penumaka',
      ward: userData.ward || 'Ward 1',
      totalComplaintsSubmitted: 0,
      createdAt: new Date().toLocaleDateString(),
    };

    addStoredUser(newUser);
    setCurrentUser(newUser);
    showToast(`Account created successfully for ${newUser.name}!`, 'success');
    navigateTo(newUser.role === 'admin' ? 'admin_dashboard' : 'citizen_dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    navigateTo('landing');
  };

  const addComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'remarks' | 'status'>): string => {
    const count = complaints.length + 1;
    const year = new Date().getFullYear();
    const formattedId = `ERC-${year}-${count.toString().padStart(3, '0')}`;
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    const newComplaint: Complaint = {
      ...data,
      id: formattedId,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `t_${Date.now()}`,
          stage: 'Complaint Registered',
          timestamp: now,
          description: `Grievance submitted by ${data.citizenName}`,
          updatedBy: data.citizenName,
        },
      ],
      remarks: [],
    };

    setComplaints(prev => [newComplaint, ...prev]);
    api.createComplaint(data);

    const newNotif: NotificationItem = {
      id: `n_${Date.now()}`,
      title: `Complaint ${formattedId} Registered`,
      message: `Your grievance "${data.title}" in ${data.village} has been registered successfully.`,
      timestamp: now,
      read: false,
      type: 'status_change',
      complaintId: formattedId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return formattedId;
  };

  const updateComplaintStatus = (id: string, newStatus: StatusType, remarkText?: string) => {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newTimelineItem = {
            id: `t_${Date.now()}`,
            stage: newStatus,
            timestamp: now,
            description: remarkText || `Status updated to ${newStatus}`,
            updatedBy: currentUser?.name || 'AP Authority Officer',
          };

          const newRemarks = [...c.remarks];
          if (remarkText) {
            newRemarks.push({
              id: `r_${Date.now()}`,
              author: currentUser?.name || 'AP Authority Official',
              role: currentUser?.role || 'admin',
              text: remarkText,
              timestamp: now,
            });
          }

          return {
            ...c,
            status: newStatus,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
            remarks: newRemarks,
          };
        }
        return c;
      })
    );

    api.updateStatus(id, newStatus, remarkText, currentUser?.name, currentUser?.role);

    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        title: `Complaint ${id} Status Updated`,
        message: `Status changed to ${newStatus}${remarkText ? ': ' + remarkText : ''}`,
        timestamp: now,
        read: false,
        type: newStatus === 'Resolved' ? 'resolved' : 'status_change',
        complaintId: id,
      },
      ...prev,
    ]);

    showToast(`Complaint ${id} status updated to ${newStatus}`, 'success');
  };

  const addProgressUpdate = (
    id: string,
    update: { stage: string; description: string; status?: StatusType; proofUrl?: string; progressPercent?: number }
  ) => {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = update.status || c.status;
          const newTimelineItem: TimelineEvent = {
            id: `t_${Date.now()}`,
            stage: update.stage,
            timestamp: now,
            description: update.description,
            updatedBy: currentUser?.name || 'Gram Volunteer',
            updatedByRole: currentUser?.role || 'volunteer',
            proofUrl: update.proofUrl,
            progressPercent: update.progressPercent,
          };

          const newRemarks = [...c.remarks];
          if (update.description) {
            newRemarks.push({
              id: `r_${Date.now()}`,
              author: currentUser?.name || 'Gram Volunteer',
              role: currentUser?.role || 'volunteer',
              text: `[${update.stage}] ${update.description}${update.proofUrl ? ' (Proof photo attached)' : ''}`,
              timestamp: now,
            });
          }

          return {
            ...c,
            status: nextStatus,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
            remarks: newRemarks,
          };
        }
        return c;
      })
    );

    api.postProgressUpdate(id, {
      ...update,
      updatedBy: currentUser?.name || 'Gram Volunteer',
      updatedByRole: currentUser?.role || 'volunteer',
    });

    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        title: `Progress Update on ${id}`,
        message: `${update.stage}: ${update.description}`,
        timestamp: now,
        read: false,
        type: update.status === 'Resolved' ? 'resolved' : 'status_change',
        complaintId: id,
      },
      ...prev,
    ]);

    showToast(`Progress update & proof photo posted for ${id}!`, 'success');
  };

  const assignOfficer = (id: string, officer: { name: string; department: string; contact?: string }) => {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            assignedOfficer: officer,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                id: `t_${Date.now()}`,
                stage: 'Assigned',
                timestamp: now,
                description: `Assigned to ${officer.name} (${officer.department})`,
                updatedBy: currentUser?.name || 'Admin',
              },
            ],
          };
        }
        return c;
      })
    );

    api.assignOfficer(id, officer, currentUser?.name || 'Admin');

    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        title: `Officer Assigned to ${id}`,
        message: `${officer.name} (${officer.department}) has been assigned to your grievance.`,
        timestamp: now,
        read: false,
        type: 'officer_assigned',
        complaintId: id,
      },
      ...prev,
    ]);

    showToast(`Assigned ${officer.name} to complaint ${id}`, 'success');
  };

  const addRemark = (id: string, text: string) => {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            remarks: [
              ...c.remarks,
              {
                id: `r_${Date.now()}`,
                author: currentUser?.name || 'Krishna Rao',
                role: currentUser?.role || 'citizen',
                text,
                timestamp: now,
              },
            ],
          };
        }
        return c;
      })
    );

    showToast('Remark added successfully', 'info');
  };

  const addRating = (id: string, rating: number, feedback?: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            rating,
            feedbackText: feedback,
          };
        }
        return c;
      })
    );

    showToast('Thank you for rating our resolution service!', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const resetDemoData = () => {
    const defaultComplaints = resetStoredComplaints();
    setComplaints(defaultComplaints);
    showToast('Demo data reset to default AP grievances!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        complaints,
        activeView,
        selectedComplaintId,
        darkMode,
        notifications,
        toast,
        language,
        t,
        navigateTo,
        toggleDarkMode,
        setLanguage,
        showToast,
        login,
        registerUser,
        logout,
        addComplaint,
        updateComplaintStatus,
        addProgressUpdate,
        assignOfficer,
        addRemark,
        addRating,
        markNotificationRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
