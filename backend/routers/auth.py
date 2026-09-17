from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import time
from backend.database import get_db
from backend.models import UserModel
from backend.schemas import UserRegister, UserLogin, UserResponse
from backend.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(UserModel).all()

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    if not data.email:
        raise HTTPException(status_code=400, detail="Email or mobile number is required")

    clean_email = data.email.strip().lower()
    user = db.query(UserModel).filter(
        (UserModel.email.ilike(clean_email)) | (UserModel.phone.ilike(f"%{clean_email}%"))
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="User account not found. Please register first.")

    if user.password_hash and data.password:
        if not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect password.")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone": user.phone,
            "village": user.village,
            "ward": user.ward,
            "totalComplaintsSubmitted": user.total_complaints_submitted,
            "createdAt": user.created_at.strftime("%Y-%m-%d") if user.created_at else None
        }
    }

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    if not data.name or not data.email:
        raise HTTPException(status_code=400, detail="Name and Email are required")

    clean_email = data.email.strip().lower()
    existing_user = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()

    hashed_pw = hash_password(data.password) if data.password else ""

    if existing_user:
        existing_user.name = data.name.strip()
        existing_user.role = data.role or existing_user.role
        if data.password:
            existing_user.password_hash = hashed_pw
        if data.phone:
            existing_user.phone = data.phone
        if data.village:
            existing_user.village = data.village
        if data.ward:
            existing_user.ward = data.ward
        db.commit()
        db.refresh(existing_user)
        user_model = existing_user
    else:
        user_id = f"usr_{int(time.time() * 1000)}"
        user_model = UserModel(
            id=user_id,
            name=data.name.strip(),
            email=clean_email,
            password_hash=hashed_pw,
            role=data.role or "citizen",
            phone=data.phone or "",
            village=data.village or "Penumaka",
            ward=data.ward or "Ward 1",
            total_complaints_submitted=0
        )
        db.add(user_model)
        db.commit()
        db.refresh(user_model)

    return {
        "success": True,
        "user": {
            "id": user_model.id,
            "name": user_model.name,
            "email": user_model.email,
            "role": user_model.role,
            "phone": user_model.phone,
            "village": user_model.village,
            "ward": user_model.ward,
            "totalComplaintsSubmitted": user_model.total_complaints_submitted
        }
    }
