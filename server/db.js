import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_URL;

let pool = null;

if (DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    console.log('✅ PostgreSQL / Supabase Database Pool Initialized');
  } catch (err) {
    console.warn('⚠️ Could not initialize PostgreSQL pool, using local db fallback:', err.message);
  }
}

const INITIAL_COMPLAINTS = [
  {
    id: 'ERC-2026-001',
    title: 'Severe Potholes & Asphalt Damage on Main Panchayat Road',
    description: 'Multiple deep potholes near Penumaka Center bus stop causing frequent bike skidding and traffic bottleneck. Urgent road surfacing required.',
    category: 'Road Damage',
    village: 'Penumaka',
    wardNumber: 'Ward 4',
    landmark: 'Near Penumaka ZP High School Bus Stop',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-07-28 09:30 AM',
    updatedAt: '2026-07-30 02:15 PM',
    citizenName: 'Krishna Rao',
    citizenEmail: 'krishna.rao@ap.gov.in',
    assignedOfficer: {
      name: 'Er. K. Srinivasa Rao',
      department: 'AP Roads & Buildings (R&B)',
      contact: '+91 94400 11223',
    },
    timeline: [
      {
        id: 't1',
        stage: 'Complaint Registered',
        timestamp: '2026-07-28 09:30 AM',
        description: 'Grievance registered by citizen Krishna Rao',
        updatedBy: 'Krishna Rao',
      },
      {
        id: 't2',
        stage: 'Officer Assigned',
        timestamp: '2026-07-29 11:00 AM',
        description: 'Assigned to Er. K. Srinivasa Rao (AP R&B)',
        updatedBy: 'District PR Admin',
      },
      {
        id: 't3',
        stage: 'In Progress',
        timestamp: '2026-07-30 02:15 PM',
        description: 'Asphalt patching machine and field crew deployed at site',
        updatedBy: 'Er. K. Srinivasa Rao',
        proofUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        progressPercent: 60,
      },
    ],
    remarks: [
      {
        id: 'r1',
        author: 'Er. K. Srinivasa Rao',
        role: 'admin',
        text: 'Material delivered to site. Asphalt patching in progress.',
        timestamp: '2026-07-30 02:15 PM',
      },
    ],
  },
  {
    id: 'ERC-2026-002',
    title: 'Clogged Open Drain Overflowing onto Street',
    description: 'Stormwater drain blocked due to plastic dumping near Undavalli Center. Stagnant water emitting foul odor and breeding mosquitoes.',
    category: 'Drainage',
    village: 'Undavalli',
    wardNumber: 'Ward 2',
    landmark: 'Behind Grama Sachivalayam Office',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-08-01 10:15 AM',
    updatedAt: '2026-08-01 10:15 AM',
    citizenName: 'M. Venkateswarlu',
    citizenEmail: 'volunteer.ap@ap.gov.in',
    timeline: [
      {
        id: 't1',
        stage: 'Complaint Registered',
        timestamp: '2026-08-01 10:15 AM',
        description: 'Grievance submitted by volunteer M. Venkateswarlu',
        updatedBy: 'M. Venkateswarlu',
      },
    ],
    remarks: [],
  },
  {
    id: 'ERC-2026-003',
    title: 'Drinking Water Pipeline Leakage at School Ward',
    description: 'Main overhead tank supply pipe burst near Kankipadu ZP School gate. Clean water leaking constantly for 2 days.',
    category: 'Water Supply',
    village: 'Kankipadu',
    wardNumber: 'Ward 1',
    landmark: 'Opposite Village Water Tank',
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2026-07-20 08:00 AM',
    updatedAt: '2026-07-22 04:30 PM',
    citizenName: 'Suresh Reddy',
    citizenEmail: 'suresh.reddy@ap.gov.in',
    assignedOfficer: {
      name: 'Er. P. Venkatesh',
      department: 'Rural Water Supply (RWS)',
      contact: '+91 98491 22334',
    },
    timeline: [
      {
        id: 't1',
        stage: 'Complaint Registered',
        timestamp: '2026-07-20 08:00 AM',
        description: 'Grievance registered',
        updatedBy: 'Suresh Reddy',
      },
      {
        id: 't2',
        stage: 'In Progress',
        timestamp: '2026-07-21 09:00 AM',
        description: 'RWS team replaced joint valve',
        updatedBy: 'Er. P. Venkatesh',
      },
      {
        id: 't3',
        stage: 'Resolved',
        timestamp: '2026-07-22 04:30 PM',
        description: 'Leakage completely repaired. Supply restored.',
        updatedBy: 'Er. P. Venkatesh',
        proofUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
        progressPercent: 100,
      },
    ],
    remarks: [],
    rating: 5,
    feedbackText: 'Quick action by Grama Sachivalayam RWS team!',
  },
  {
    id: 'ERC-2026-004',
    title: 'Non-Functional Street Lights on Main Road',
    description: '5 solar street lights not working on Mangalagiri Bypass approach road, making it dark and unsafe for commuters at night.',
    category: 'Street Light',
    village: 'Mangalagiri',
    wardNumber: 'Ward 5',
    landmark: 'Bypass Highway Circle',
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-08-02 05:45 PM',
    updatedAt: '2026-08-03 11:20 AM',
    citizenName: 'Krishna Rao',
    citizenEmail: 'krishna.rao@ap.gov.in',
    assignedOfficer: {
      name: 'Er. V. Ramanjaneyulu',
      department: 'APSPDCL Electrical Dept',
      contact: '+91 94408 33445',
    },
    timeline: [
      {
        id: 't1',
        stage: 'Complaint Registered',
        timestamp: '2026-08-02 05:45 PM',
        description: 'Grievance submitted',
        updatedBy: 'Krishna Rao',
      },
      {
        id: 't2',
        stage: 'In Progress',
        timestamp: '2026-08-03 11:20 AM',
        description: 'Replacement batteries ordered',
        updatedBy: 'Er. V. Ramanjaneyulu',
        proofUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
        progressPercent: 50,
      },
    ],
    remarks: [],
  },
];

const INITIAL_USERS = [];
let inMemoryDb = null;

function getDbFilePath() {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'db.json');
  }
  return DB_FILE;
}

function ensureDbExists(targetPath = DB_FILE) {
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    try {
      fs.mkdirSync(targetDir, { recursive: true });
    } catch (e) {
      console.warn('Could not create directory:', targetDir, e);
    }
  }
  
  if (!fs.existsSync(targetPath)) {
    const initialDb = {
      complaints: INITIAL_COMPLAINTS,
      users: INITIAL_USERS,
      notifications: [
        {
          id: 'n1',
          title: 'Work Started on ERC-2026-001',
          message: 'Er. K. Srinivasa Rao (AP R&B) deployed asphalt patch work team at Penumaka Main Road.',
          timestamp: '2026-07-30 02:15 PM',
          read: false,
          type: 'status_change',
          complaintId: 'ERC-2026-001',
        },
      ],
    };
    try {
      fs.writeFileSync(targetPath, JSON.stringify(initialDb, null, 2));
    } catch (e) {
      console.warn('Could not write initial db file:', targetPath, e);
      return initialDb;
    }
  }
}

export function readDb() {
  const targetPath = getDbFilePath();
  ensureDbExists(targetPath);
  try {
    if (fs.existsSync(targetPath)) {
      const data = fs.readFileSync(targetPath, 'utf-8');
      inMemoryDb = JSON.parse(data);
      return inMemoryDb;
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }
  
  if (!inMemoryDb) {
    inMemoryDb = { complaints: INITIAL_COMPLAINTS, users: INITIAL_USERS, notifications: [] };
  }
  return inMemoryDb;
}

export function writeDb(data) {
  inMemoryDb = data;
  const targetPath = getDbFilePath();
  try {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('Notice: Disk write unavailable, using in-memory state:', err.message);
  }
}

// Async PostgreSQL / Supabase helper methods
export async function getDbAsync() {
  if (!pool) {
    return readDb();
  }

  try {
    const complaintsRes = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
    const historyRes = await pool.query('SELECT * FROM complaint_history ORDER BY created_at ASC');
    const usersRes = await pool.query('SELECT * FROM users');
    const notificationsRes = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');

    const historyByComplaint = {};
    const remarksByComplaint = {};

    historyRes.rows.forEach(h => {
      if (!historyByComplaint[h.complaint_id]) historyByComplaint[h.complaint_id] = [];
      if (!remarksByComplaint[h.complaint_id]) remarksByComplaint[h.complaint_id] = [];

      historyByComplaint[h.complaint_id].push({
        id: h.id,
        stage: h.stage,
        timestamp: h.created_at ? new Date(h.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
        description: h.description,
        updatedBy: h.updated_by,
        updatedByRole: h.updated_by_role,
        proofUrl: h.proof_url || undefined,
        progressPercent: h.progress_percent !== null ? h.progress_percent : undefined,
      });

      if (h.description && (h.updated_by_role !== 'citizen' || h.stage.includes('Remark'))) {
        remarksByComplaint[h.complaint_id].push({
          id: `r_${h.id}`,
          author: h.updated_by,
          role: h.updated_by_role || 'admin',
          text: h.description,
          timestamp: h.created_at ? new Date(h.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
        });
      }
    });

    const formattedComplaints = complaintsRes.rows.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      priority: c.priority,
      status: c.status,
      village: c.village,
      wardNumber: c.ward_number,
      landmark: c.landmark || undefined,
      imageUrl: c.image_url || undefined,
      createdAt: c.created_at ? new Date(c.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
      updatedAt: c.updated_at ? new Date(c.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
      citizenName: c.citizen_name,
      citizenEmail: c.citizen_email,
      assignedOfficer: c.assigned_officer_name ? {
        name: c.assigned_officer_name,
        department: c.assigned_officer_dept || 'Municipal Dept',
        contact: c.assigned_officer_contact || '',
      } : undefined,
      timeline: historyByComplaint[c.id] || [],
      remarks: remarksByComplaint[c.id] || [],
      rating: c.rating !== null ? c.rating : undefined,
      feedbackText: c.feedback_text || undefined,
      coordinates: { lat: c.latitude || 16.5020, lng: c.longitude || 80.5750 }
    }));

    const formattedUsers = usersRes.rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      password: u.password_hash,
      phone: u.phone || '',
      village: u.village || 'Penumaka',
      ward: u.ward || 'Ward 1',
      totalComplaintsSubmitted: u.total_complaints_submitted || 0,
      createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : ''
    }));

    const formattedNotifications = notificationsRes.rows.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      timestamp: n.created_at ? new Date(n.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '',
      read: n.is_read,
      type: n.type || 'status_change',
      complaintId: n.complaint_id || undefined
    }));

    return {
      complaints: formattedComplaints,
      users: formattedUsers,
      notifications: formattedNotifications
    };
  } catch (err) {
    console.warn('⚠️ Error querying PostgreSQL, falling back to local storage:', err.message);
    return readDb();
  }
}

export async function queryPg(text, params) {
  if (!pool) return null;
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('PostgreSQL query error:', err.message);
    return null;
  }
}
