import express from 'express';
import cors from 'cors';
import { readDb, writeDb, getDbAsync, queryPg } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Auth Routes
app.get('/api/auth/users', async (req, res) => {
  const db = await getDbAsync();
  res.json(db.users || []);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email or mobile number is required' });
  }

  const db = await getDbAsync();
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

app.post('/api/auth/register', async (req, res) => {
  const { name, email, role, password, phone, village, ward } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const db = await getDbAsync();
  const cleanEmail = email.trim().toLowerCase();
  const userId = `usr_${Date.now()}`;

  const newUser = {
    id: userId,
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

  // Try PostgreSQL query if connected
  const pgRes = await queryPg(
    `INSERT INTO users (id, name, email, password_hash, role, phone, village, ward)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (email) DO UPDATE SET name = $2, role = $5, phone = $6, village = $7, ward = $8
     RETURNING *`,
    [userId, newUser.name, cleanEmail, newUser.password, newUser.role, newUser.phone, newUser.village, newUser.ward]
  );

  // Fallback to local write
  const existingIndex = db.users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (existingIndex >= 0) {
    db.users[existingIndex] = { ...db.users[existingIndex], ...newUser };
  } else {
    db.users.unshift(newUser);
  }
  writeDb(db);

  res.json({ success: true, user: newUser });
});

// Complaints Routes
app.get('/api/complaints', async (req, res) => {
  const db = await getDbAsync();
  res.json(db.complaints || []);
});

app.get('/api/complaints/:id', async (req, res) => {
  const db = await getDbAsync();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  res.json(complaint);
});

app.post('/api/complaints', async (req, res) => {
  const db = await getDbAsync();
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

  // Try PostgreSQL write
  await queryPg(
    `INSERT INTO complaints (id, citizen_name, citizen_email, title, description, category, priority, status, village, ward_number, landmark, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      formattedId,
      newComplaint.citizenName || 'Citizen',
      newComplaint.citizenEmail || 'citizen@ap.gov.in',
      newComplaint.title,
      newComplaint.description,
      newComplaint.category || 'Road Damage',
      newComplaint.priority || 'Medium',
      'Pending',
      newComplaint.village || 'Penumaka',
      newComplaint.wardNumber || 'Ward 1',
      newComplaint.landmark || null,
      newComplaint.imageUrl || null
    ]
  );

  await queryPg(
    `INSERT INTO complaint_history (id, complaint_id, stage, description, updated_by, updated_by_role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [`t_${Date.now()}`, formattedId, 'Complaint Registered', `Grievance submitted by ${newComplaint.citizenName || 'Citizen'}`, newComplaint.citizenName || 'Citizen', 'citizen']
  );

  // Local fallback update
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

app.patch('/api/complaints/:id/status', async (req, res) => {
  const { status, remarkText, updatedBy, updatedByRole } = req.body;
  const db = await getDbAsync();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  complaint.status = status;
  complaint.updatedAt = now;

  const tId = `t_${Date.now()}`;
  complaint.timeline.push({
    id: tId,
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

  // Try PostgreSQL write
  await queryPg(`UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2`, [status, req.params.id]);
  await queryPg(
    `INSERT INTO complaint_history (id, complaint_id, stage, description, updated_by, updated_by_role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tId, req.params.id, status, remarkText || `Status updated to ${status}`, updatedBy || 'Officer', updatedByRole || 'admin']
  );

  writeDb(db);
  res.json({ success: true, complaint });
});

app.post('/api/complaints/:id/progress', async (req, res) => {
  const { stage, description, status, proofUrl, progressPercent, updatedBy, updatedByRole } = req.body;
  const db = await getDbAsync();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  if (status) complaint.status = status;
  complaint.updatedAt = now;

  const tId = `t_${Date.now()}`;
  const newTimelineItem = {
    id: tId,
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

  // Try PostgreSQL write
  if (status) {
    await queryPg(`UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2`, [status, req.params.id]);
  }
  await queryPg(
    `INSERT INTO complaint_history (id, complaint_id, stage, description, updated_by, updated_by_role, proof_url, progress_percent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [tId, req.params.id, stage || 'Progress Update', description, updatedBy || 'Gram Volunteer', updatedByRole || 'volunteer', proofUrl || null, progressPercent !== undefined ? progressPercent : null]
  );

  writeDb(db);
  res.json({ success: true, complaint });
});

app.post('/api/complaints/:id/remarks', async (req, res) => {
  const { author, role, text } = req.body;
  const db = await getDbAsync();
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

app.post('/api/complaints/:id/rating', async (req, res) => {
  const { rating, feedbackText } = req.body;
  const db = await getDbAsync();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.rating = rating;
  complaint.feedbackText = feedbackText;

  // Try PostgreSQL write
  await queryPg(`UPDATE complaints SET rating = $1, feedback_text = $2 WHERE id = $3`, [rating, feedbackText || null, req.params.id]);
  await queryPg(
    `INSERT INTO ratings (id, complaint_id, rating, feedback)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (complaint_id) DO UPDATE SET rating = $3, feedback = $4`,
    [`r_${Date.now()}`, req.params.id, rating, feedbackText || null]
  );

  writeDb(db);
  res.json({ success: true, complaint });
});

app.patch('/api/complaints/:id/assign', async (req, res) => {
  const { officer, updatedBy } = req.body;
  const db = await getDbAsync();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  complaint.assignedOfficer = officer;
  complaint.updatedAt = now;

  const tId = `t_${Date.now()}`;
  complaint.timeline.push({
    id: tId,
    stage: 'Officer Assigned',
    timestamp: now,
    description: `Assigned to ${officer.name} (${officer.department})`,
    updatedBy: updatedBy || 'Admin',
  });

  // Try PostgreSQL write
  await queryPg(
    `UPDATE complaints SET assigned_officer_name = $1, assigned_officer_dept = $2, assigned_officer_contact = $3, updated_at = NOW() WHERE id = $4`,
    [officer.name, officer.department || 'Municipal Dept', officer.contact || '', req.params.id]
  );
  await queryPg(
    `INSERT INTO complaint_history (id, complaint_id, stage, description, updated_by, updated_by_role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tId, req.params.id, 'Officer Assigned', `Assigned to ${officer.name} (${officer.department})`, updatedBy || 'Admin', 'admin']
  );

  writeDb(db);
  res.json({ success: true, complaint });
});

// Admin Analytics API Endpoint
app.get('/api/admin/analytics', async (req, res) => {
  const db = await getDbAsync();
  const complaints = db.complaints || [];
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const categoryBreakdown = {};
  const villageBreakdown = {};

  complaints.forEach(c => {
    categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    villageBreakdown[c.village] = (villageBreakdown[c.village] || 0) + 1;
  });

  const ratings = complaints.filter(c => c.rating !== undefined && c.rating !== null).map(c => c.rating);
  const averageRating = ratings.length > 0 ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 4.8;
  const resolutionRatePercent = total > 0 ? Number(((resolved / total) * 100).toFixed(1)) : 0;

  res.json({
    totalComplaints: total,
    pending,
    inProgress,
    resolved,
    resolutionRatePercent,
    averageRating,
    categoryBreakdown,
    villageBreakdown
  });
});

// Notifications Routes
app.get('/api/notifications', async (req, res) => {
  const db = await getDbAsync();
  res.json(db.notifications || []);
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  const db = await getDbAsync();
  const item = db.notifications.find(n => n.id === req.params.id);
  if (item) item.read = true;
  await queryPg(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [req.params.id]);
  writeDb(db);
  res.json({ success: true });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 E-Complaints Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
