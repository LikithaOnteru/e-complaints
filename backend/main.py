from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, SessionLocal
from backend.models import UserModel, VillageModel, EmergencyContactModel, ComplaintModel, ComplaintHistoryModel, NotificationModel
from backend.services.auth_service import hash_password
from backend.routers import auth, complaints, admin, notifications, meta

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="E-Complaints API",
    description="Rural Grievance Redressal Platform Backend (AP Sachivalayam System)",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial data if tables are empty
def seed_database():
    db = SessionLocal()
    try:
        # Seed Villages
        if db.query(VillageModel).count() == 0:
            villages = [
                VillageModel(id="v1", name="Penumaka", district="Guntur (Andhra Pradesh)", active_complaints=8, latitude=16.5020, longitude=80.5750),
                VillageModel(id="v2", name="Undavalli", district="Guntur (Andhra Pradesh)", active_complaints=6, latitude=16.4958, longitude=80.5847),
                VillageModel(id="v3", name="Kankipadu", district="NTR District (Andhra Pradesh)", active_complaints=5, latitude=16.4273, longitude=80.7788),
                VillageModel(id="v4", name="Gollapudi", district="NTR District (Andhra Pradesh)", active_complaints=4, latitude=16.5412, longitude=80.5891),
                VillageModel(id="v5", name="Tullur", district="Guntur / Amaravati (Andhra Pradesh)", active_complaints=5, latitude=16.5365, longitude=80.4682),
                VillageModel(id="v6", name="Bhimavaram Rural", district="West Godavari (Andhra Pradesh)", active_complaints=3, latitude=16.5449, longitude=81.5212),
                VillageModel(id="v7", name="Anakapalle", district="Visakhapatnam (Andhra Pradesh)", active_complaints=4, latitude=17.6868, longitude=83.0042),
                VillageModel(id="v8", name="Tirupati Rural", district="Tirupati (Andhra Pradesh)", active_complaints=2, latitude=13.6288, longitude=79.4192)
            ]
            db.bulk_save_objects(villages)

        # Seed Emergency Contacts
        if db.query(EmergencyContactModel).count() == 0:
            contacts = [
                EmergencyContactModel(id="ec1", name="AP Spandana Public Grievance Helpline", category="State Grievance Cell", phone="1902", alternate_phone="1800-425-4440", address="Grama Sachivalayam & VSWS Dept, Vijayawada, AP", available_hours="24/7 Toll Free Helpline", icon="Building2"),
                EmergencyContactModel(id="ec2", name="AP Rural Water Supply (RWS) Helpline", category="Water Department", phone="1800-425-1899", alternate_phone="+91 866 2480112", address="AP RWS Sub-Division Office, Tadepalle, Guntur Dist", available_hours="24/7 Helpline", icon="Droplets"),
                EmergencyContactModel(id="ec3", name="APSPDCL / APEPDCL Electricity Emergency", category="Electricity Board", phone="1912", alternate_phone="+91 866 2422580", address="AP DISCOM Electricity Control Room, Vijayawada", available_hours="24/7 Emergency Line", icon="Zap"),
                EmergencyContactModel(id="ec4", name="AP 108 Emergency Ambulance Service", category="Hospital & Healthcare", phone="108", alternate_phone="+91 866 2570108", address="Primary Health Center (PHC), Penumaka Village, AP", available_hours="24/7 Emergency", icon="HeartPulse"),
                EmergencyContactModel(id="ec5", name="AP Police & Emergency Helpline", category="Police & Safety", phone="112", alternate_phone="100", address="Tadepalle Rural Police Outpost, Guntur Dist, AP", available_hours="24/7 Control Room", icon="ShieldAlert"),
                EmergencyContactModel(id="ec6", name="AP Swachha Andhra Corporation (Sanitation)", category="Sanitation Department", phone="1800-425-5555", address="Panchayati Raj Office, NTR District / Guntur, AP", available_hours="Mon - Sat: 8:00 AM - 6:00 PM", icon="Trash2"),
                EmergencyContactModel(id="ec7", name="AP State Disaster Response (SDMA)", category="Disaster & Flood Relief", phone="1070", alternate_phone="1800-425-0101", address="AP State Disaster Management Authority, Kunchanapalli, AP", available_hours="24/7 Helpline", icon="AlertTriangle")
            ]
            db.bulk_save_objects(contacts)

        # Seed Demo Users
        if db.query(UserModel).count() == 0:
            pw = hash_password("password123")
            users = [
                UserModel(id="usr_krishna_rao", name="Krishna Rao", email="krishna.rao@ap.gov.in", password_hash=pw, role="citizen", phone="+91 98480 12345", village="Penumaka", ward="Ward 4", total_complaints_submitted=2),
                UserModel(id="usr_volunteer_ap", name="M. Venkateswarlu", email="volunteer.ap@ap.gov.in", password_hash=pw, role="volunteer", phone="+91 94401 55667", village="Undavalli", ward="Ward 2", total_complaints_submitted=1),
                UserModel(id="usr_admin_ap", name="District Collectorate AP", email="admin.ap@ap.gov.in", password_hash=pw, role="admin", phone="+91 866 2570001", village="Vijayawada HQ", ward="State Central", total_complaints_submitted=0)
            ]
            db.bulk_save_objects(users)

        # Seed Initial Complaints
        if db.query(ComplaintModel).count() == 0:
            c1 = ComplaintModel(
                id="ERC-2026-001", user_id="usr_krishna_rao", citizen_name="Krishna Rao", citizen_email="krishna.rao@ap.gov.in",
                title="Severe Potholes & Asphalt Damage on Main Panchayat Road",
                description="Multiple deep potholes near Penumaka Center bus stop causing frequent bike skidding and traffic bottleneck. Urgent road surfacing required.",
                category="Road Damage", priority="High", status="In Progress", village="Penumaka", ward_number="Ward 4", landmark="Near Penumaka ZP High School Bus Stop",
                image_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
                assigned_officer_name="Er. K. Srinivasa Rao", assigned_officer_dept="AP Roads & Buildings (R&B)", assigned_officer_contact="+91 94400 11223"
            )
            c2 = ComplaintModel(
                id="ERC-2026-002", user_id="usr_volunteer_ap", citizen_name="M. Venkateswarlu", citizen_email="volunteer.ap@ap.gov.in",
                title="Clogged Open Drain Overflowing onto Street",
                description="Stormwater drain blocked due to plastic dumping near Undavalli Center. Stagnant water emitting foul odor and breeding mosquitoes.",
                category="Drainage", priority="High", status="Pending", village="Undavalli", ward_number="Ward 2", landmark="Behind Grama Sachivalayam Office",
                image_url="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800"
            )
            c3 = ComplaintModel(
                id="ERC-2026-003", user_id="usr_krishna_rao", citizen_name="Suresh Reddy", citizen_email="suresh.reddy@ap.gov.in",
                title="Drinking Water Pipeline Leakage at School Ward",
                description="Main overhead tank supply pipe burst near Kankipadu ZP School gate. Clean water leaking constantly for 2 days.",
                category="Water Supply", priority="Medium", status="Resolved", village="Kankipadu", ward_number="Ward 1", landmark="Opposite Village Water Tank",
                image_url="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
                assigned_officer_name="Er. P. Venkatesh", assigned_officer_dept="Rural Water Supply (RWS)", assigned_officer_contact="+91 98491 22334",
                rating=5, feedback_text="Quick action by Grama Sachivalayam RWS team!"
            )
            c4 = ComplaintModel(
                id="ERC-2026-004", user_id="usr_krishna_rao", citizen_name="Krishna Rao", citizen_email="krishna.rao@ap.gov.in",
                title="Non-Functional Street Lights on Main Road",
                description="5 solar street lights not working on Mangalagiri Bypass approach road, making it dark and unsafe for commuters at night.",
                category="Street Light", priority="Medium", status="In Progress", village="Mangalagiri", ward_number="Ward 5", landmark="Bypass Highway Circle",
                image_url="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800",
                assigned_officer_name="Er. V. Ramanjaneyulu", assigned_officer_dept="APSPDCL Electrical Dept", assigned_officer_contact="+91 94408 33445"
            )
            db.bulk_save_objects([c1, c2, c3, c4])

            # Seed History
            h1 = ComplaintHistoryModel(id="t1", complaint_id="ERC-2026-001", stage="Complaint Registered", description="Grievance registered by citizen Krishna Rao", updated_by="Krishna Rao", updated_by_role="citizen")
            h2 = ComplaintHistoryModel(id="t2", complaint_id="ERC-2026-001", stage="Officer Assigned", description="Assigned to Er. K. Srinivasa Rao (AP R&B)", updated_by="District PR Admin", updated_by_role="admin")
            h3 = ComplaintHistoryModel(id="t3", complaint_id="ERC-2026-001", stage="In Progress", description="Asphalt patching machine and field crew deployed at site", updated_by="Er. K. Srinivasa Rao", updated_by_role="admin", proof_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", progress_percent=60)
            h4 = ComplaintHistoryModel(id="t4", complaint_id="ERC-2026-002", stage="Complaint Registered", description="Grievance submitted by volunteer M. Venkateswarlu", updated_by="M. Venkateswarlu", updated_by_role="volunteer")
            db.bulk_save_objects([h1, h2, h3, h4])

            # Seed Notification
            n1 = NotificationModel(id="n1", user_id="usr_krishna_rao", complaint_id="ERC-2026-001", title="Work Started on ERC-2026-001", message="Er. K. Srinivasa Rao (AP R&B) deployed asphalt patch work team at Penumaka Main Road.", type="status_change", is_read=False)
            db.bulk_save_objects([n1])

        db.commit()
    except Exception as e:
        print("Seed data notice:", e)
        db.rollback()
    finally:
        db.close()

seed_database()

# Register API Routers
app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(admin.router)
app.include_router(notifications.router)
app.include_router(meta.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "E-Complaints FastAPI Backend"}
