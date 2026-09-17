import os
import requests
from typing import List, Dict, Any, Optional

FASTAPI_URL = os.getenv("FASTAPI_URL", "http://localhost:8000")

class APIClient:
    def __init__(self, base_url: str = FASTAPI_URL):
        self.base_url = base_url.rstrip("/")

    def _get(self, endpoint: str) -> Optional[Any]:
        try:
            res = requests.get(f"{self.base_url}{endpoint}", timeout=5)
            if res.ok:
                return res.json()
        except Exception:
            pass
        return None

    def _post(self, endpoint: str, data: dict) -> Optional[Any]:
        try:
            res = requests.post(f"{self.base_url}{endpoint}", json=data, timeout=5)
            if res.ok:
                return res.json()
        except Exception:
            pass
        return None

    def _patch(self, endpoint: str, data: Optional[dict] = None) -> Optional[Any]:
        try:
            res = requests.patch(f"{self.base_url}{endpoint}", json=data or {}, timeout=5)
            if res.ok:
                return res.json()
        except Exception:
            pass
        return None

    # Auth Methods
    def login(self, email: str, role: Optional[str] = None, password: Optional[str] = None) -> Optional[dict]:
        return self._post("/api/auth/login", {"email": email, "role": role, "password": password})

    def register(self, user_data: dict) -> Optional[dict]:
        return self._post("/api/auth/register", user_data)

    def get_users(self) -> List[dict]:
        return self._get("/api/auth/users") or []

    # Complaint Methods
    def get_complaints(self) -> List[dict]:
        return self._get("/api/complaints") or []

    def get_complaint_by_id(self, complaint_id: str) -> Optional[dict]:
        return self._get(f"/api/complaints/{complaint_id}")

    def create_complaint(self, data: dict) -> Optional[dict]:
        return self._post("/api/complaints", data)

    def add_rating(self, complaint_id: str, rating: int, feedback_text: Optional[str] = None) -> Optional[dict]:
        return self._post(f"/api/complaints/{complaint_id}/rating", {"rating": rating, "feedbackText": feedback_text})

    # Admin Methods
    def update_status(self, complaint_id: str, status: str, remark_text: Optional[str] = None, updated_by: Optional[str] = None, updated_by_role: Optional[str] = None) -> Optional[dict]:
        return self._patch(f"/api/admin/complaints/{complaint_id}/status", {
            "status": status, "remarkText": remark_text, "updatedBy": updated_by, "updatedByRole": updated_by_role
        })

    def post_progress(self, complaint_id: str, progress_data: dict) -> Optional[dict]:
        return self._post(f"/api/admin/complaints/{complaint_id}/progress", progress_data)

    def assign_officer(self, complaint_id: str, officer_data: dict, updated_by: Optional[str] = None) -> Optional[dict]:
        return self._patch(f"/api/admin/complaints/{complaint_id}/assign", {
            "name": officer_data.get("name"),
            "department": officer_data.get("department"),
            "contact": officer_data.get("contact"),
            "updatedBy": updated_by
        })

    def get_analytics(self) -> Optional[dict]:
        return self._get("/api/admin/analytics")

    # Notifications & Meta
    def get_notifications(self) -> List[dict]:
        return self._get("/api/notifications") or []

    def mark_notification_read(self, notif_id: str) -> Optional[dict]:
        return self._patch(f"/api/notifications/{notif_id}/read")

    def get_villages(self) -> List[dict]:
        return self._get("/api/villages") or []

    def get_emergency_contacts(self) -> List[dict]:
        return self._get("/api/emergency-contacts") or []

    def predict_ai(self, title: str, description: str, village: Optional[str] = None) -> Optional[dict]:
        return self._post("/api/ai/predict", {"title": title, "description": description, "village": village})

api_client = APIClient()
