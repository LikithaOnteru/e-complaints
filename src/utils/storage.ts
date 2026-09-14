import { Complaint, User, NotificationItem } from '../types';
import { INITIAL_COMPLAINTS } from '../data/mockComplaints';

const STORAGE_KEYS = {
  COMPLAINTS: 'erural_complaints_v2_ap',
  USER: 'erural_user_v2_ap',
  THEME: 'erural_theme_v1',
  NOTIFICATIONS: 'erural_notifications_v2_ap',
  DRAFT: 'erural_draft_v1',
  REGISTERED_USERS: 'erural_registered_users_v2_ap',
};

export function getStoredComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored complaints', e);
  }
  // Default to initial mock dataset
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
}

export function saveStoredComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints', e);
  }
}

export function resetStoredComplaints(): Complaint[] {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  } catch (e) {
    console.error('Failed to reset complaints', e);
  }
  return INITIAL_COMPLAINTS;
}

export function getStoredUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.id !== 'usr_krishna_rao') {
        return parsed;
      }
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Failed to parse user', e);
  }
  return null;
}

export function saveStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function getStoredDraft(): any | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse draft', e);
  }
  return null;
}

export function saveStoredDraft(draft: any): void {
  if (draft) {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } else {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  }
}

export function getStoredRegisteredUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse registered users', e);
  }
  return [];
}

export function saveStoredRegisteredUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users', e);
  }
}

export function addStoredUser(user: User): User[] {
  const users = getStoredRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  let updated: User[];
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user };
    updated = [...users];
  } else {
    updated = [user, ...users];
  }
  saveStoredRegisteredUsers(updated);
  return updated;
}
