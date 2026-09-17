import streamlit as st
import os

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="E-Complaints — Rural Grievance Redressal Platform",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for UI styling
st.markdown("""
<style>
    .stApp {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .main .block-container {
        padding-top: 1.5rem;
        padding-bottom: 3rem;
    }
    .stButton>button {
        border-radius: 8px;
        font-weight: 600;
    }
    div[data-testid="stSidebarNav"] {
        padding-top: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False
if "user" not in st.session_state:
    st.session_state["user"] = None
if "role" not in st.session_state:
    st.session_state["role"] = "guest"
if "current_page" not in st.session_state:
    st.session_state["current_page"] = "Home"

# Import pages
from app.pages.landing import render_landing_page
from app.pages.auth_page import render_auth_page
from app.pages.citizen_dashboard import render_citizen_dashboard
from app.pages.submit_complaint import render_submit_complaint
from app.pages.my_complaints import render_my_complaints
from app.pages.track_complaint import render_track_complaint
from app.pages.notifications_page import render_notifications_page
from app.pages.emergency_contacts import render_emergency_contacts
from app.pages.admin_dashboard import render_admin_dashboard
from app.pages.admin_complaints import render_admin_complaints
from app.pages.village_map import render_village_map
from app.services.api_client import api_client

# Sidebar Navigation
st.sidebar.markdown("## 🏛️ E-Complaints")
st.sidebar.caption("Grama Sachivalayam Grievance Portal")

logged_in = st.session_state.get("logged_in", False)
role = st.session_state.get("role", "guest")
user = st.session_state.get("user", {})

if logged_in:
    st.sidebar.success(f"👤 **{user.get('name', 'User')}**\nRole: `{role.upper()}`")
    if st.sidebar.button("🚪 Sign Out", use_container_width=True):
        st.session_state["logged_in"] = False
        st.session_state["user"] = None
        st.session_state["role"] = "guest"
        st.session_state["current_page"] = "Home"
        st.rerun()

st.sidebar.markdown("---")

# Navigation items based on authentication & role
if not logged_in:
    nav_options = ["Home", "Sign In / Register", "Emergency Contacts", "Village Map"]
else:
    if role == "admin":
        nav_options = [
            "Admin Dashboard", "Manage Complaints", "Village Map", "Emergency Contacts", "Home"
        ]
    else:  # citizen or volunteer
        nav_options = [
            "Citizen Dashboard", "Submit Complaint", "My Complaints", "Track Complaint",
            "Notifications", "Emergency Contacts", "Village Map", "Home"
        ]

# Ensure current_page is valid
if st.session_state["current_page"] not in nav_options:
    st.session_state["current_page"] = nav_options[0]

selected_nav = st.sidebar.radio(
    "Navigation Menu",
    nav_options,
    index=nav_options.index(st.session_state["current_page"]) if st.session_state["current_page"] in nav_options else 0
)

# Update session state page when menu is clicked
if selected_nav != st.session_state["current_page"]:
    st.session_state["current_page"] = selected_nav

# Unread Notification Badge in Sidebar
if logged_in:
    notifs = api_client.get_notifications()
    unread_c = sum(1 for n in notifs if not n.get("read"))
    if unread_c > 0:
        st.sidebar.info(f"🔔 You have **{unread_c}** unread notification(s)!")

st.sidebar.markdown("---")
st.sidebar.caption("© 2026 AP VSWS & Panchayati Raj Dept")

# Page Router
page = st.session_state["current_page"]

if page == "Home":
    render_landing_page()
elif page == "Sign In / Register":
    render_auth_page()
elif page == "Citizen Dashboard":
    render_citizen_dashboard()
elif page == "Submit Complaint":
    render_submit_complaint()
elif page == "My Complaints":
    render_my_complaints()
elif page == "Track Complaint":
    render_track_complaint()
elif page == "Notifications":
    render_notifications_page()
elif page == "Emergency Contacts":
    render_emergency_contacts()
elif page == "Admin Dashboard":
    render_admin_dashboard()
elif page == "Manage Complaints":
    render_admin_complaints()
elif page == "Village Map":
    render_village_map()
else:
    render_landing_page()
