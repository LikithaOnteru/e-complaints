from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False, default="citizen")
    phone = Column(String(32), nullable=True)
    village = Column(String(128), default="Penumaka")
    ward = Column(String(64), default="Ward 1")
    total_complaints_submitted = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaints = relationship("ComplaintModel", back_populates="user")
    notifications = relationship("NotificationModel", back_populates="user")


class ComplaintModel(Base):
    __tablename__ = "complaints"

    id = Column(String(64), primary_key=True)  # ERC-2026-001
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    citizen_name = Column(String(255), nullable=False)
    citizen_email = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(64), nullable=False)
    priority = Column(String(32), nullable=False, default="Medium")
    status = Column(String(32), nullable=False, default="Pending")
    village = Column(String(128), nullable=False)
    ward_number = Column(String(64), nullable=False)
    landmark = Column(String(255), nullable=True)
    image_url = Column(Text, nullable=True)
    assigned_officer_name = Column(String(255), nullable=True)
    assigned_officer_dept = Column(String(255), nullable=True)
    assigned_officer_contact = Column(String(64), nullable=True)
    rating = Column(Integer, nullable=True)
    feedback_text = Column(Text, nullable=True)
    latitude = Column(Float, default=16.5020)
    longitude = Column(Float, default=80.5750)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="complaints")
    history = relationship("ComplaintHistoryModel", back_populates="complaint", cascade="all, delete-orphan")
    notifications = relationship("NotificationModel", back_populates="complaint", cascade="all, delete-orphan")
    rating_rel = relationship("RatingModel", back_populates="complaint", uselist=False, cascade="all, delete-orphan")


class ComplaintHistoryModel(Base):
    __tablename__ = "complaint_history"

    id = Column(String(64), primary_key=True)
    complaint_id = Column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    updated_by = Column(String(255), nullable=False)
    updated_by_role = Column(String(32), default="admin")
    proof_url = Column(Text, nullable=True)
    progress_percent = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("ComplaintModel", back_populates="history")


class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    complaint_id = Column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(64), default="status_change")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="notifications")
    complaint = relationship("ComplaintModel", back_populates="notifications")


class RatingModel(Base):
    __tablename__ = "ratings"

    id = Column(String(64), primary_key=True)
    complaint_id = Column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("ComplaintModel", back_populates="rating_rel")


class VillageModel(Base):
    __tablename__ = "villages"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    district = Column(String(128), nullable=False)
    active_complaints = Column(Integer, default=0)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)


class EmergencyContactModel(Base):
    __tablename__ = "emergency_contacts"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    category = Column(String(128), nullable=False)
    phone = Column(String(64), nullable=False)
    alternate_phone = Column(String(64), nullable=True)
    address = Column(String(255), nullable=False)
    available_hours = Column(String(128), nullable=False)
    icon = Column(String(64), default="Building2")
