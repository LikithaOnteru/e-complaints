import { Complaint, User, NotificationItem, Role, StatusType } from '../types';

const API_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[Backend API Offline] Call to ${url} failed. Falling back to client local storage state.`);
    return null;
  }
}

export const api = {
  async healthCheck(): Promise<boolean> {
    const res = await fetchJson<{ status: string }>('/health');
    return res?.status === 'ok';
  },

  async getUsers(): Promise<User[] | null> {
    return fetchJson<User[]>('/auth/users');
  },

  async login(email: string, role: Role, password?: string): Promise<{ success: boolean; user?: User; error?: string } | null> {
    return fetchJson<{ success: boolean; user?: User; error?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role, password }),
    });
  },

  async register(userData: { name: string; email: string; role: Role; password?: string; phone?: string; village?: string; ward?: string }): Promise<{ success: boolean; user?: User } | null> {
    return fetchJson<{ success: boolean; user?: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getComplaints(): Promise<Complaint[] | null> {
    return fetchJson<Complaint[]>('/complaints');
  },

  async createComplaint(complaintData: any): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },

  async updateStatus(id: string, status: StatusType, remarkText?: string, updatedBy?: string, updatedByRole?: Role): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarkText, updatedBy, updatedByRole }),
    });
  },

  async postProgressUpdate(id: string, update: { stage: string; description: string; status?: StatusType; proofUrl?: string; progressPercent?: number; updatedBy?: string; updatedByRole?: Role }): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>(`/complaints/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify(update),
    });
  },

  async addRemark(id: string, author: string, role: Role, text: string): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>(`/complaints/${id}/remarks`, {
      method: 'POST',
      body: JSON.stringify({ author, role, text }),
    });
  },

  async addRating(id: string, rating: number, feedbackText?: string): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>(`/complaints/${id}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedbackText }),
    });
  },

  async assignOfficer(id: string, officer: { name: string; department: string; contact?: string }, updatedBy?: string): Promise<{ success: boolean; complaint?: Complaint } | null> {
    return fetchJson<{ success: boolean; complaint?: Complaint }>(`/complaints/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ officer, updatedBy }),
    });
  },

  async getNotifications(): Promise<NotificationItem[] | null> {
    return fetchJson<NotificationItem[]>('/notifications');
  },
};
