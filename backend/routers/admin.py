from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import time
from backend.database import get_db
from backend.models import ComplaintModel, ComplaintHistoryModel, NotificationModel, RatingModel, VillageModel
from backend.schemas import StatusUpdate, ProgressUpdate, OfficerAssign
from backend.routers.complaints import format_complaint

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/complaints")
def admin_get_complaints(db: Session = Depends(get_db)):
    complaints = db.query(ComplaintModel).order_by(ComplaintModel.created_at.desc()).all()
    return [format_complaint(c) for c in complaints]

@router.patch("/complaints/{id}/status")
def update_status(id: str, data: StatusUpdate, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = data.status
    complaint.updated_at = datetime.utcnow()

    # Create timeline entry
    history_item = ComplaintHistoryModel(
        id=f"t_{int(time.time() * 1000)}",
        complaint_id=id,
        stage=data.status,
        description=data.remarkText or f"Status updated to {data.status}",
        updated_by=data.updatedBy or "Officer",
        updated_by_role=data.updatedByRole or "admin"
    )
    db.add(history_item)

    # Add notification for user
    notif = NotificationModel(
        id=f"n_{int(time.time() * 1000)}",
        user_id=complaint.user_id,
        complaint_id=id,
        title=f"Status Update for {id}",
        message=f'Grievance "{complaint.title}" status changed to {data.status}.',
        type="status_change",
        is_read=False
    )
    db.add(notif)

    db.commit()
    db.refresh(complaint)
    return {"success": True, "complaint": format_complaint(complaint)}

@router.post("/complaints/{id}/progress")
def post_progress(id: str, data: ProgressUpdate, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if data.status:
        complaint.status = data.status
    complaint.updated_at = datetime.utcnow()

    history_item = ComplaintHistoryModel(
        id=f"t_{int(time.time() * 1000)}",
        complaint_id=id,
        stage=data.stage or "Progress Update",
        description=data.description,
        updated_by=data.updatedBy or "Gram Volunteer",
        updated_by_role=data.updatedByRole or "volunteer",
        proof_url=data.proofUrl,
        progress_percent=data.progressPercent
    )
    db.add(history_item)

    db.commit()
    db.refresh(complaint)
    return {"success": True, "complaint": format_complaint(complaint)}

@router.patch("/complaints/{id}/assign")
def assign_officer(id: str, data: OfficerAssign, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.assigned_officer_name = data.name
    complaint.assigned_officer_dept = data.department
    complaint.assigned_officer_contact = data.contact
    complaint.updated_at = datetime.utcnow()

    history_item = ComplaintHistoryModel(
        id=f"t_{int(time.time() * 1000)}",
        complaint_id=id,
        stage="Officer Assigned",
        description=f"Assigned to {data.name} ({data.department})",
        updated_by=data.updatedBy or "Admin",
        updated_by_role="admin"
    )
    db.add(history_item)

    notif = NotificationModel(
        id=f"n_{int(time.time() * 1000)}",
        user_id=complaint.user_id,
        complaint_id=id,
        title=f"Officer Assigned for {id}",
        message=f"Officer {data.name} ({data.department}) assigned to resolve your grievance.",
        type="officer_assigned",
        is_read=False
    )
    db.add(notif)

    db.commit()
    db.refresh(complaint)
    return {"success": True, "complaint": format_complaint(complaint)}

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    complaints = db.query(ComplaintModel).all()
    total = len(complaints)
    pending = sum(1 for c in complaints if c.status == "Pending")
    in_progress = sum(1 for c in complaints if c.status == "In Progress")
    resolved = sum(1 for c in complaints if c.status == "Resolved")
    rejected = sum(1 for c in complaints if c.status == "Rejected")

    category_counts = {}
    village_counts = {}
    for c in complaints:
        category_counts[c.category] = category_counts.get(c.category, 0) + 1
        village_counts[c.village] = village_counts.get(c.village, 0) + 1

    ratings = [c.rating for c in complaints if c.rating is not None]
    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 4.8

    resolution_rate = round((resolved / total * 100), 1) if total > 0 else 0.0

    return {
        "totalComplaints": total,
        "pending": pending,
        "inProgress": in_progress,
        "resolved": resolved,
        "rejected": rejected,
        "resolutionRatePercent": resolution_rate,
        "averageRating": avg_rating,
        "categoryBreakdown": category_counts,
        "villageBreakdown": village_counts
    }
