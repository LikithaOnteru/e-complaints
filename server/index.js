import express from 'express';
import cors from 'cors';
import { readDb, writeDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Auth Routes
app.get('/api/auth/users', (req, res) => {
  const db = readDb();
  res.json(db.users || []);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email or mobile number is required' });
  }

  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();
  
  const user = db.users.find(
    u => u.email.toLowerCase() === cleanEmail || (u.phone && u.phone.includes(cleanEmail))
  );

  if (!user) {
    return res.status(401).json({ success: false, error: 'User account not found. Please register first.' });
  }

  // Validate password if user has password set
  if (user.password && password && user.password !== password) {
    return res.status(401).json({ success: false, error: 'Incorrect password.' });
  }

  return res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, password, phone, village, ward } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();
  const existingIndex = db.users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    role: role || 'citizen',
    password: password || '',
    phone: phone || '',
    village: village || 'Penumaka',
    ward: ward || 'Ward 1',
    totalComplaintsSubmitted: 0,
    createdAt: new Date().toLocaleDateString(),
  };

  if (existingIndex >= 0) {
    db.users[existingIndex] = { ...db.users[existingIndex], ...newUser };
  } else {
    db.users.unshift(newUser);
  }

  writeDb(db);
  res.json({ success: true, user: newUser });
});

// Complaints Routes
app.get('/api/complaints', (req, res) => {
  const db = readDb();
  res.json(db.complaints || []);
});

app.get('/api/complaints/:id', (req, res) => {
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  res.json(complaint);
});

app.post('/api/complaints', (req, res) => {
  const db = readDb();
  const count = db.complaints.length + 1;
  const year = new Date().getFullYear();
  const formattedId = `ERC-${year}-${count.toString().padStart(3, '0')}`;
  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const newComplaint = {
    ...req.body,
    id: formattedId,
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        id: `t_${Date.now()}`,
        stage: 'Complaint Registered',
        timestamp: now,
        description: `Grievance submitted by ${req.body.citizenName || 'Citizen'}`,
        updatedBy: req.body.citizenName || 'Citizen',
      },
    ],
    remarks: [],
  };

  db.complaints.unshift(newComplaint);

  const newNotif = {
    id: `n_${Date.now()}`,
    title: `Complaint ${formattedId} Registered`,
    message: `Grievance "${newComplaint.title}" in ${newComplaint.village} registered successfully.`,
    timestamp: now,
    read: false,
    type: 'status_change',
    complaintId: formattedId,
  };
  db.notifications.unshift(newNotif);

  writeDb(db);
  res.json({ success: true, complaint: newComplaint });
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { status, remarkText, updatedBy, updatedByRole } = req.body;
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  complaint.status = status;
  complaint.updatedAt = now;

  complaint.timeline.push({
    id: `t_${Date.now()}`,
    stage: status,
    timestamp: now,
    description: remarkText || `Status updated to ${status}`,
    updatedBy: updatedBy || 'Officer',
    updatedByRole: updatedByRole || 'admin',
  });

  if (remarkText) {
    complaint.remarks.push({
      id: `r_${Date.now()}`,
      author: updatedBy || 'Officer',
      role: updatedByRole || 'admin',
      text: remarkText,
      timestamp: now,
    });
  }

  writeDb(db);
  res.json({ success: true, complaint });
});

app.post('/api/complaints/:id/progress', (req, res) => {
  const { stage, description, status, proofUrl, progressPercent, updatedBy, updatedByRole } = req.body;
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  if (status) complaint.status = status;
  complaint.updatedAt = now;

  const newTimelineItem = {
    id: `t_${Date.now()}`,
    stage: stage || 'Progress Update',
    timestamp: now,
    description: description,
    updatedBy: updatedBy || 'Gram Volunteer',
    updatedByRole: updatedByRole || 'volunteer',
    proofUrl: proofUrl || undefined,
    progressPercent: progressPercent !== undefined ? progressPercent : undefined,
  };

  complaint.timeline.push(newTimelineItem);

  if (description) {
    complaint.remarks.push({
      id: `r_${Date.now()}`,
      author: updatedBy || 'Gram Volunteer',
      role: updatedByRole || 'volunteer',
      text: `[${stage}] ${description}${proofUrl ? ' (Proof photo attached)' : ''}`,
      timestamp: now,
    });
  }

  writeDb(db);
  res.json({ success: true, complaint });
});

app.post('/api/complaints/:id/remarks', (req, res) => {
  const { author, role, text } = req.body;
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  complaint.remarks.push({
    id: `r_${Date.now()}`,
    author: author || 'Citizen',
    role: role || 'citizen',
    text: text,
    timestamp: now,
  });

  writeDb(db);
  res.json({ success: true, complaint });
});

app.post('/api/complaints/:id/rating', (req, res) => {
  const { rating, feedbackText } = req.body;
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.rating = rating;
  complaint.feedbackText = feedbackText;

  writeDb(db);
  res.json({ success: true, complaint });
});

app.patch('/api/complaints/:id/assign', (req, res) => {
  const { officer, updatedBy } = req.body;
  const db = readDb();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  complaint.assignedOfficer = officer;
  complaint.updatedAt = now;

  complaint.timeline.push({
    id: `t_${Date.now()}`,
    stage: 'Officer Assigned',
    timestamp: now,
    description: `Assigned to ${officer.name} (${officer.department})`,
    updatedBy: updatedBy || 'Admin',
  });

  writeDb(db);
  res.json({ success: true, complaint });
});

// Notifications Routes
app.get('/api/notifications', (req, res) => {
  const db = readDb();
  res.json(db.notifications || []);
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const db = readDb();
  const item = db.notifications.find(n => n.id === req.params.id);
  if (item) item.read = true;
  writeDb(db);
  res.json({ success: true });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 E-Complaints Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;

