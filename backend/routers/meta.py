from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import VillageModel, EmergencyContactModel, ComplaintModel
from backend.schemas import AIPredictRequest, AIPredictResponse
from backend.services.ai_service import analyze_complaint

router = APIRouter(prefix="/api", tags=["Metadata & AI"])

@router.get("/villages")
def get_villages(db: Session = Depends(get_db)):
    villages = db.query(VillageModel).all()
    return [
        {
            "id": v.id,
            "name": v.name,
            "district": v.district,
            "activeComplaints": v.active_complaints,
            "lat": v.latitude,
            "lng": v.longitude
        }
        for v in villages
    ]

@router.get("/emergency-contacts")
def get_emergency_contacts(db: Session = Depends(get_db)):
    contacts = db.query(EmergencyContactModel).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "phone": c.phone,
            "alternatePhone": c.alternate_phone,
            "address": c.address,
            "availableHours": c.available_hours,
            "icon": c.icon
        }
        for c in contacts
    ]

@router.post("/ai/predict", response_model=AIPredictResponse)
def ai_predict(data: AIPredictRequest, db: Session = Depends(get_db)):
    complaints = db.query(ComplaintModel).all()
    complaint_dicts = [{"id": c.id, "title": c.title, "description": c.description, "village": c.village, "status": c.status} for c in complaints]
    res = analyze_complaint(data.title, data.description, data.village, complaint_dicts)
    return res
