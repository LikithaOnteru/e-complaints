from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import time
from backend.database import get_db
from backend.models import ComplaintModel, ComplaintHistoryModel, NotificationModel, RatingModel, UserModel, VillageModel
from backend.schemas import ComplaintCreate, RatingCreate

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

def format_complaint(c: ComplaintModel):
    assigned = None
    if c.assigned_officer_name:
        assigned = {
            "name": c.assigned_officer_name,
            "department": c.assigned_officer_dept or "Municipal Dept",
            "contact": c.assigned_officer_contact or ""
        }

    history_list = []
    remarks_list = []
    for h in sorted(c.history, key=lambda x: x.created_at):
        item = {
            "id": h.id,
            "stage": h.stage,
            "timestamp": h.created_at.strftime("%Y-%m-%d %I:%M %p") if h.created_at else "",
            "description": h.description,
            "updatedBy": h.updated_by,
            "updatedByRole": h.updated_by_role,
            "proofUrl": h.proof_url,
            "progressPercent": h.progress_percent
        }
        history_list.append(item)
        if h.description and (h.updated_by_role != "citizen" or "Remark" in h.stage):
            remarks_list.append({
                "id": f"r_{h.id}",
                "author": h.updated_by,
                "role": h.updated_by_role or "admin",
                "text": h.description,
                "timestamp": h.created_at.strftime("%Y-%m-%d %I:%M %p") if h.created_at else ""
            })

    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "priority": c.priority,
        "status": c.status,
        "village": c.village,
        "wardNumber": c.ward_number,
        "landmark": c.landmark,
        "imageUrl": c.image_url,
        "createdAt": c.created_at.strftime("%Y-%m-%d %I:%M %p") if c.created_at else "",
        "updatedAt": c.updated_at.strftime("%Y-%m-%d %I:%M %p") if c.updated_at else "",
        "citizenName": c.citizen_name,
        "citizenEmail": c.citizen_email,
        "assignedOfficer": assigned,
        "timeline": history_list,
        "remarks": remarks_list,
        "rating": c.rating,
        "feedbackText": c.feedback_text,
        "coordinates": {"lat": c.latitude or 16.5020, "lng": c.longitude or 80.5750}
    }

@router.get("")
def get_complaints(db: Session = Depends(get_db)):
    complaints = db.query(ComplaintModel).order_by(ComplaintModel.created_at.desc()).all()
    return [format_complaint(c) for c in complaints]

@router.get("/{id}")
def get_complaint_by_id(id: str, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return format_complaint(complaint)

@router.post("")
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    count = db.query(ComplaintModel).count() + 1
    year = datetime.now().year
    formatted_id = f"ERC-{year}-{str(count).zfill(3)}"
    now_str = datetime.now().strftime("%Y-%m-%d %I:%M %p")

    # Find associated user if email matches
    user = db.query(UserModel).filter(UserModel.email.ilike(data.citizenEmail or "")).first()
    user_id = user.id if user else None

    if user:
        user.total_complaints_submitted = (user.total_complaints_submitted or 0) + 1

    # Update active complaints count for village
    village_item = db.query(VillageModel).filter(VillageModel.name.ilike(data.village.strip())).first()
    if village_item:
        village_item.active_complaints = (village_item.active_complaints or 0) + 1

    new_complaint = ComplaintModel(
        id=formatted_id,
        user_id=user_id,
        citizen_name=data.citizenName or "Citizen",
        citizen_email=data.citizenEmail or "citizen@ap.gov.in",
        title=data.title.strip(),
        description=data.description.strip(),
        category=data.category,
        priority=data.priority or "Medium",
        status="Pending",
        village=data.village.strip(),
        ward_number=data.wardNumber.strip(),
        landmark=data.landmark,
        image_url=data.imageUrl,
        latitude=data.latitude or 16.5020,
        longitude=data.longitude or 80.5750
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Add initial history event
    h_item = ComplaintHistoryModel(
        id=f"t_{int(time.time() * 1000)}",
        complaint_id=formatted_id,
        stage="Complaint Registered",
        description=f"Grievance submitted by {new_complaint.citizen_name}",
        updated_by=new_complaint.citizen_name,
        updated_by_role="citizen"
    )
    db.add(h_item)

    # Add initial notification
    notif = NotificationModel(
        id=f"n_{int(time.time() * 1000)}",
        user_id=user_id,
        complaint_id=formatted_id,
        title=f"Complaint {formatted_id} Registered",
        message=f'Grievance "{new_complaint.title}" in {new_complaint.village} registered successfully.',
        type="status_change",
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(new_complaint)

    return {"success": True, "complaint": format_complaint(new_complaint)}

@router.post("/{id}/rating")
def add_rating(id: str, data: RatingCreate, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.rating = data.rating
    complaint.feedback_text = data.feedbackText

    rating_item = db.query(RatingModel).filter(RatingModel.complaint_id == id).first()
    if not rating_item:
        rating_item = RatingModel(
            id=f"r_{int(time.time() * 1000)}",
            complaint_id=id,
            user_id=complaint.user_id,
            rating=data.rating,
            feedback=data.feedbackText
        )
        db.add(rating_item)
    else:
        rating_item.rating = data.rating
        rating_item.feedback = data.feedbackText

    db.commit()
    db.refresh(complaint)
    return {"success": True, "complaint": format_complaint(complaint)}
