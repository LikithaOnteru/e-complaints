export type Role = 'citizen' | 'volunteer' | 'admin' | 'guest';

export type CategoryType = 
  | 'Road Damage'
  | 'Drainage'
  | 'Water Supply'
  | 'Garbage'
  | 'Street Light'
  | 'Electricity'
  | 'Sanitation'
  | 'Others';

export type PriorityType = 'Low' | 'Medium' | 'High';

export type StatusType = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export interface TimelineEvent {
  id: string;
  stage: string;
  timestamp: string;
  description: string;
  updatedBy: string;
  updatedByRole?: Role;
  proofUrl?: string;
  progressPercent?: number;
}

export interface Remark {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string; // e.g. ERC-2026-001
  title: string;
  description: string;
  category: CategoryType;
  village: string;
  wardNumber: string;
  landmark?: string;
  imageUrl?: string;
  priority: PriorityType;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  citizenName: string;
  citizenEmail: string;
  assignedOfficer?: {
    name: string;
    department: string;
    contact?: string;
  };
  timeline: TimelineEvent[];
  remarks: Remark[];
  rating?: number;
  feedbackText?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  phone?: string;
  village?: string;
  ward?: string;
  badges?: string[];
  totalComplaintsSubmitted?: number;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'officer_assigned' | 'resolved' | 'system';
  complaintId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  category: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  availableHours: string;
  icon: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  activeComplaints: number;
  lat: number;
  lng: number;
}
