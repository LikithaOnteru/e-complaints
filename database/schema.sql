-- E-Complaints Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor to initialize all tables, indexes, and seed data.

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'citizen',
    phone VARCHAR(32),
    village VARCHAR(128) DEFAULT 'Penumaka',
    ward VARCHAR(64) DEFAULT 'Ward 1',
    total_complaints_submitted INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY, -- e.g. ERC-2026-001
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'Medium',
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    village VARCHAR(128) NOT NULL,
    ward_number VARCHAR(64) NOT NULL,
    landmark VARCHAR(255),
    image_url TEXT,
    assigned_officer_name VARCHAR(255),
    assigned_officer_dept VARCHAR(255),
    assigned_officer_contact VARCHAR(64),
    rating INT,
    feedback_text TEXT,
    latitude DOUBLE PRECISION DEFAULT 16.5020,
    longitude DOUBLE PRECISION DEFAULT 80.5750,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMPLAINT HISTORY (TIMELINE & REMARKS) TABLE
CREATE TABLE IF NOT EXISTS complaint_history (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    stage VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    updated_by_role VARCHAR(32) DEFAULT 'admin',
    proof_url TEXT,
    progress_percent INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    complaint_id VARCHAR(64) REFERENCES complaints(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) DEFAULT 'status_change',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. RATINGS TABLE
CREATE TABLE IF NOT EXISTS ratings (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) UNIQUE NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. VILLAGES TABLE
CREATE TABLE IF NOT EXISTS villages (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    active_complaints INT DEFAULT 0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- 7. EMERGENCY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    alternate_phone VARCHAR(64),
    address VARCHAR(255) NOT NULL,
    available_hours VARCHAR(128) NOT NULL,
    icon VARCHAR(64) DEFAULT 'Building2'
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_village ON complaints(village);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_history_complaint ON complaint_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- SEED DATA: SEED INITIAL VILLAGES
INSERT INTO villages (id, name, district, active_complaints, latitude, longitude) VALUES
('v1', 'Penumaka', 'Guntur (Andhra Pradesh)', 8, 16.5020, 80.5750),
('v2', 'Undavalli', 'Guntur (Andhra Pradesh)', 6, 16.4958, 80.5847),
('v3', 'Kankipadu', 'NTR District (Andhra Pradesh)', 5, 16.4273, 80.7788),
('v4', 'Gollapudi', 'NTR District (Andhra Pradesh)', 4, 16.5412, 80.5891),
('v5', 'Tullur', 'Guntur / Amaravati (Andhra Pradesh)', 5, 16.5365, 80.4682),
('v6', 'Bhimavaram Rural', 'West Godavari (Andhra Pradesh)', 3, 16.5449, 81.5212),
('v7', 'Anakapalle', 'Visakhapatnam (Andhra Pradesh)', 4, 17.6868, 83.0042),
('v8', 'Tirupati Rural', 'Tirupati (Andhra Pradesh)', 2, 13.6288, 79.4192)
ON CONFLICT (id) DO NOTHING;

-- SEED DATA: EMERGENCY CONTACTS
INSERT INTO emergency_contacts (id, name, category, phone, alternate_phone, address, available_hours, icon) VALUES
('ec1', 'AP Spandana Public Grievance Helpline', 'State Grievance Cell', '1902', '1800-425-4440', 'Grama Sachivalayam & VSWS Dept, Vijayawada, AP', '24/7 Toll Free Helpline', 'Building2'),
('ec2', 'AP Rural Water Supply (RWS) Helpline', 'Water Department', '1800-425-1899', '+91 866 2480112', 'AP RWS Sub-Division Office, Tadepalle, Guntur Dist', '24/7 Helpline', 'Droplets'),
('ec3', 'APSPDCL / APEPDCL Electricity Emergency', 'Electricity Board', '1912', '+91 866 2422580', 'AP DISCOM Electricity Control Room, Vijayawada', '24/7 Emergency Line', 'Zap'),
('ec4', 'AP 108 Emergency Ambulance Service', 'Hospital & Healthcare', '108', '+91 866 2570108', 'Primary Health Center (PHC), Penumaka Village, AP', '24/7 Emergency', 'HeartPulse'),
('ec5', 'AP Police & Emergency Helpline', 'Police & Safety', '112', '100', 'Tadepalle Rural Police Outpost, Guntur Dist, AP', '24/7 Control Room', 'ShieldAlert'),
('ec6', 'AP Swachha Andhra Corporation (Sanitation)', 'Sanitation Department', '1800-425-5555', NULL, 'Panchayati Raj Office, NTR District / Guntur, AP', 'Mon - Sat: 8:00 AM - 6:00 PM', 'Trash2'),
('ec7', 'AP State Disaster Response (SDMA)', 'Disaster & Flood Relief', '1070', '1800-425-0101', 'AP State Disaster Management Authority, Kunchanapalli, AP', '24/7 Helpline', 'AlertTriangle')
ON CONFLICT (id) DO NOTHING;

-- SEED DATA: DEMO USERS (password is 'password123')
INSERT INTO users (id, name, email, password_hash, role, phone, village, ward) VALUES
('usr_krishna_rao', 'Krishna Rao', 'krishna.rao@ap.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'citizen', '+91 98480 12345', 'Penumaka', 'Ward 4'),
('usr_volunteer_ap', 'M. Venkateswarlu', 'volunteer.ap@ap.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'volunteer', '+91 94401 55667', 'Undavalli', 'Ward 2'),
('usr_admin_ap', 'District Collectorate AP', 'admin.ap@ap.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'admin', '+91 866 2570001', 'Vijayawada HQ', 'State Central')
ON CONFLICT (id) DO NOTHING;

-- SEED DATA: INITIAL COMPLAINTS
INSERT INTO complaints (id, user_id, citizen_name, citizen_email, title, description, category, priority, status, village, ward_number, landmark, image_url, assigned_officer_name, assigned_officer_dept, assigned_officer_contact, latitude, longitude) VALUES
('ERC-2026-001', 'usr_krishna_rao', 'Krishna Rao', 'krishna.rao@ap.gov.in', 'Severe Potholes & Asphalt Damage on Main Panchayat Road', 'Multiple deep potholes near Penumaka Center bus stop causing frequent bike skidding and traffic bottleneck. Urgent road surfacing required.', 'Road Damage', 'High', 'In Progress', 'Penumaka', 'Ward 4', 'Near Penumaka ZP High School Bus Stop', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800', 'Er. K. Srinivasa Rao', 'AP Roads & Buildings (R&B)', '+91 94400 11223', 16.5020, 80.5750),
('ERC-2026-002', 'usr_volunteer_ap', 'M. Venkateswarlu', 'volunteer.ap@ap.gov.in', 'Clogged Open Drain Overflowing onto Street', 'Stormwater drain blocked due to plastic dumping near Undavalli Center. Stagnant water emitting foul odor and breeding mosquitoes.', 'Drainage', 'High', 'Pending', 'Undavalli', 'Ward 2', 'Behind Grama Sachivalayam Office', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800', NULL, NULL, NULL, 16.4958, 80.5847),
('ERC-2026-003', 'usr_krishna_rao', 'Suresh Reddy', 'suresh.reddy@ap.gov.in', 'Drinking Water Pipeline Leakage at School Ward', 'Main overhead tank supply pipe burst near Kankipadu ZP School gate. Clean water leaking constantly for 2 days.', 'Water Supply', 'Medium', 'Resolved', 'Kankipadu', 'Ward 1', 'Opposite Village Water Tank', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800', 'Er. P. Venkatesh', 'Rural Water Supply (RWS)', '+91 98491 22334', 16.4273, 80.7788),
('ERC-2026-004', 'usr_krishna_rao', 'Krishna Rao', 'krishna.rao@ap.gov.in', 'Non-Functional Street Lights on Main Road', '5 solar street lights not working on Mangalagiri Bypass approach road, making it dark and unsafe for commuters at night.', 'Street Light', 'Medium', 'In Progress', 'Mangalagiri', 'Ward 5', 'Bypass Highway Circle', 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800', 'Er. V. Ramanjaneyulu', 'APSPDCL Electrical Dept', '+91 94408 33445', 16.4350, 80.5520)
ON CONFLICT (id) DO NOTHING;

-- SEED COMPLAINT HISTORY
INSERT INTO complaint_history (id, complaint_id, stage, description, updated_by, updated_by_role, proof_url, progress_percent) VALUES
('t1', 'ERC-2026-001', 'Complaint Registered', 'Grievance registered by citizen Krishna Rao', 'Krishna Rao', 'citizen', NULL, NULL),
('t2', 'ERC-2026-001', 'Officer Assigned', 'Assigned to Er. K. Srinivasa Rao (AP R&B)', 'District PR Admin', 'admin', NULL, NULL),
('t3', 'ERC-2026-001', 'In Progress', 'Asphalt patching machine and field crew deployed at site', 'Er. K. Srinivasa Rao', 'admin', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', 60),
('t4', 'ERC-2026-002', 'Complaint Registered', 'Grievance submitted by volunteer M. Venkateswarlu', 'M. Venkateswarlu', 'volunteer', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, complaint_id, title, message, type, is_read) VALUES
('n1', 'usr_krishna_rao', 'ERC-2026-001', 'Work Started on ERC-2026-001', 'Er. K. Srinivasa Rao (AP R&B) deployed asphalt patch work team at Penumaka Main Road.', 'status_change', FALSE)
ON CONFLICT (id) DO NOTHING;
