# E-Complaints — Rural Grievance Redressal Platform

## Project Overview
**E-Complaints (స్పందన / Spandana)** is a full-stack rural civic grievance redressal and public monitoring platform designed for Grama Sachivalayam & Panchayati Raj departments in Andhra Pradesh. It enables citizens, volunteers, and district administrators to lodge, track, audit, and resolve civic complaints transparently in real time.

---

## Problem Statement
Rural citizens often face difficulties reporting civic issues such as broken water pipelines, road potholes, defective streetlights, and clogged drainage systems. E-Complaints bridges this gap by providing:
- Instant grievance registration with photo proof and landmark tagging.
- AI-driven category classification, priority rating, and smart duplicate detection.
- Departmental officer assignment and step-by-step progress tracking with field photo evidence.
- Executive admin analytics dashboards with village complaint distribution maps.

---

## Architecture
```text
                 E-COMPLAINTS
                      │
                      ↓
              ┌───────────────┐
              │   Streamlit   │  (Streamlit Community Cloud)
              │   Frontend    │
              └───────┬───────┘
                      │  REST API Calls
                      ↓
              ┌───────────────┐
              │    FastAPI    │  (Uvicorn / Render / Railway)
              │    Backend    │
              └───────┬───────┘
                      │  SQLAlchemy ORM
                      ↓
              ┌───────────────┐
              │    Supabase   │  (Cloud PostgreSQL Database)
              │   PostgreSQL  │
              └───────────────┘
```

* **Frontend**: Streamlit (`streamlit_app.py`, `app/pages/*`)
* **Backend**: FastAPI + Python (`backend/main.py`, `backend/routers/*`, `backend/services/*`)
* **Database**: Supabase PostgreSQL (`database/schema.sql` + SQLAlchemy ORM with SQLite local fallback)
* **Auth**: Bcrypt Password Hashing + JWT Token Authentication

---

## Citizen Features
- **Registration & Login**: Secure account creation with role selection (Citizen, Volunteer, Admin).
- **Grievance Submission**: Submit complaints with title, category, village, ward number, landmark, description, and photo attachments.
- **AI Smart Assistant**: Automatic detection of category, priority level, department routing, and duplicate warning.
- **Real-Time Audit Tracker**: Visual step pipeline (`Submitted -> Officer Assigned -> In Progress -> Resolved`) with field proof photos and timeline audit logs.
- **Satisfaction Rating**: Rating (1-5 stars) and feedback for resolved grievances.
- **Notifications Hub**: Alerts when grievance status changes or officers are assigned.
- **Emergency Contacts**: Departmental helplines (State Grievance Cell, RWS Water, SPDCL Power, Police, Ambulance).

---

## Admin Features
- **Executive Dashboard**: Key stats (Total, Pending, In Progress, Resolved), resolution rate %, and citizen satisfaction rating.
- **Interactive Analytics**: Plotly category breakdown pie chart and village distribution bar chart.
- **Grievance Management**: Search & filter by keyword, category, status, or village.
- **Status & Progress Updates**: Update status, assign departmental officers, publish field progress completion percentage, and upload progress proof images.
- **Village Complaints Map**: Interactive PyDeck geographic cluster map across AP Panchayats.
- **Report Export**: One-click CSV export of complete grievance reports.

---

## AI Features
- **Category Classifier**: Analyzes grievance keywords to map issues into categories (Road Damage, Water Supply, Drainage, Street Light, Garbage, Electricity, Sanitation).
- **Priority Detection**: Identifies critical safety trigger words (`accident`, `live wire`, `burst`, `flooding`) to assign High, Medium, or Low priority.
- **Smart Duplicate Prevention**: Checks existing active grievances in the same village to alert users of potential duplicate submissions.

---

## Database Schema (`database/schema.sql`)
- `users`: User profiles, email, bcrypt password hash, role, village, ward.
- `complaints`: Grievance records, category, priority, status, officer assignment, rating.
- `complaint_history`: Audit events log, stage updates, field progress %, proof image URL.
- `notifications`: User notification alerts.
- `ratings`: Satisfaction ratings and feedback text.
- `villages`: Panchayat list with active complaint counts and coordinates.
- `emergency_contacts`: Emergency helpline directory.

---

## API Endpoints (`FastAPI`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `POST` | `/api/auth/register` | Register new citizen/volunteer user |
| `GET` | `/api/complaints` | List all grievances |
| `POST` | `/api/complaints` | Submit new grievance |
| `GET` | `/api/complaints/{id}` | Fetch grievance details & timeline |
| `POST` | `/api/complaints/{id}/rating` | Submit satisfaction rating |
| `PATCH` | `/api/admin/complaints/{id}/status` | Update grievance status |
| `POST` | `/api/admin/complaints/{id}/progress` | Publish field progress update |
| `PATCH` | `/api/admin/complaints/{id}/assign` | Assign departmental officer |
| `GET` | `/api/admin/analytics` | Executive analytics breakdown |
| `GET` | `/api/notifications` | Fetch user notifications |
| `GET` | `/api/villages` | Fetch village locations for map |
| `GET` | `/api/emergency-contacts` | Fetch emergency helplines |
| `POST` | `/api/ai/predict` | AI category & priority prediction |

---

## Local Setup & Development

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run FastAPI Backend
```bash
uvicorn backend.main:app --reload --port 8000
```
Backend Swagger API documentation will be available at: `http://localhost:8000/docs`.

### 3. Run Streamlit Frontend
```bash
streamlit run streamlit_app.py
```
Streamlit app will launch in your browser at: `http://localhost:8501`.

---

## Supabase Database Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`database/schema.sql`](file:///c:/Users/Likitha/OneDrive/Desktop/e-complaints/database/schema.sql).
4. Copy your PostgreSQL Connection String under **Project Settings -> Database**.

---

## Deployment Steps

### Streamlit Community Cloud (Frontend)
1. Push project to GitHub.
2. Sign in to [share.streamlit.io](https://share.streamlit.io).
3. Click **New App**, select your GitHub repository and set Main file path to `streamlit_app.py`.
4. In **Advanced settings -> Secrets**, paste:
   ```toml
   DATABASE_URL = "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"
   FASTAPI_URL = "https://your-fastapi-backend.onrender.com"
   ```
5. Click **Deploy**.

### FastAPI Backend Deployment (Render / Railway)
1. Create a Web Service on Render / Railway linked to your repository.
2. Set Build Command: `pip install -r requirements.txt`.
3. Set Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.
4. Add Environment Variable: `DATABASE_URL` with your Supabase PostgreSQL connection string.

---

## Testing & Verification
1. **Authentication Test**: Login with `krishna.rao@ap.gov.in` / `password123`.
2. **Submission Test**: Submit a grievance and observe AI predictions.
3. **Data Persistence Test**:
   - Register a complaint.
   - Restart FastAPI backend / Streamlit app.
   - Log back in and verify complaint and timeline history remain completely intact.

---

## Git Commands for Pushing Changes
```bash
git add .
git commit -m "Migrate E-Complaints to Streamlit + FastAPI + Supabase architecture"
git push origin main
```
