from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "citizen"
    phone: Optional[str] = None
    village: Optional[str] = "Penumaka"
    ward: Optional[str] = "Ward 1"

class UserLogin(BaseModel):
    email: str
    password: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    village: Optional[str] = None
    ward: Optional[str] = None
    total_complaints_submitted: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Complaint History Schema
class HistoryItem(BaseModel):
    id: str
    stage: str
    timestamp: str
    description: str
    updatedBy: str
    updatedByRole: Optional[str] = "admin"
    proofUrl: Optional[str] = None
    progressPercent: Optional[int] = None

    class Config:
        from_attributes = True

class RemarkItem(BaseModel):
    id: str
    author: str
    role: str
    text: str
    timestamp: str

# Complaint Schemas
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    village: str
    wardNumber: str
    landmark: Optional[str] = None
    imageUrl: Optional[str] = None
    priority: Optional[str] = "Medium"
    citizenName: Optional[str] = None
    citizenEmail: Optional[str] = None
    latitude: Optional[float] = 16.5020
    longitude: Optional[float] = 80.5750

class StatusUpdate(BaseModel):
    status: str
    remarkText: Optional[str] = None
    updatedBy: Optional[str] = "Officer"
    updatedByRole: Optional[str] = "admin"

class ProgressUpdate(BaseModel):
    stage: Optional[str] = "Progress Update"
    description: str
    status: Optional[str] = None
    proofUrl: Optional[str] = None
    progressPercent: Optional[int] = None
    updatedBy: Optional[str] = "Gram Volunteer"
    updatedByRole: Optional[str] = "volunteer"

class OfficerAssign(BaseModel):
    name: str
    department: str
    contact: Optional[str] = None
    updatedBy: Optional[str] = "Admin"

class ComplaintResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    priority: str
    status: str
    village: str
    wardNumber: str
    landmark: Optional[str] = None
    imageUrl: Optional[str] = None
    createdAt: str
    updatedAt: str
    citizenName: str
    citizenEmail: str
    assignedOfficer: Optional[dict] = None
    timeline: List[dict] = []
    remarks: List[dict] = []
    rating: Optional[int] = None
    feedbackText: Optional[str] = None
    coordinates: Optional[dict] = None

# Rating Schema
class RatingCreate(BaseModel):
    rating: int
    feedbackText: Optional[str] = None

# Notification Schema
class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    timestamp: str
    read: bool
    type: str
    complaintId: Optional[str] = None

    class Config:
        from_attributes = True

# Emergency Contact Schema
class EmergencyContactResponse(BaseModel):
    id: str
    name: str
    category: str
    phone: str
    alternatePhone: Optional[str] = None
    address: str
    availableHours: str
    icon: str

    class Config:
        from_attributes = True

# Village Schema
class VillageResponse(BaseModel):
    id: str
    name: str
    district: str
    activeComplaints: int
    lat: float
    lng: float

    class Config:
        from_attributes = True

# AI Prediction Schema
class AIPredictRequest(BaseModel):
    title: str
    description: str
    village: Optional[str] = None

class AIPredictResponse(BaseModel):
    suggestedCategory: str
    categoryConfidence: int
    categoryReasoning: str
    suggestedPriority: str
    priorityReasons: List[str] = []
    suggestedDepartment: str
    isPossibleDuplicate: bool = False
    duplicateComplaintId: Optional[str] = None
