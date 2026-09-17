from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import NotificationModel

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(db: Session = Depends(get_db)):
    notifs = db.query(NotificationModel).order_by(NotificationModel.created_at.desc()).all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "timestamp": n.created_at.strftime("%Y-%m-%d %I:%M %p") if n.created_at else "",
            "read": n.is_read,
            "type": n.type,
            "complaintId": n.complaint_id
        }
        for n in notifs
    ]

@router.patch("/{id}/read")
def mark_read(id: str, db: Session = Depends(get_db)):
    notif = db.query(NotificationModel).filter(NotificationModel.id == id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True}
