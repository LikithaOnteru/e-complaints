import streamlit as st
import os

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="E-Complaints — Modern Grievance Redressal Portal",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom High-End Modern CSS & Design System
st.markdown("""
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">

<style>
    /* Global Typography & Background */
    html, body, [class*="css"] {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    h1, h2, h3, h4, .main-header {
        font-family: 'Outfit', 'Inter', sans-serif !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
    }

    /* Main Container Padding & Clean Canvas */
    .main .block-container {
        padding-top: 1.5rem;
        padding-bottom: 4rem;
        max-width: 1280px;
    }

    /* Glassmorphism Card Style */
    .glass-card {
        background: rgba(17, 24, 39, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 1.75rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .glass-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
    }

    /* Glowing Hero Header Card */
    .hero-banner {
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(124, 58, 237, 0.85) 50%, rgba(219, 39, 119, 0.8) 100%);
        border-radius: 20px;
        padding: 3rem 2.5rem;
        color: #ffffff;
        box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.4);
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
    }
    .hero-banner::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
        transform: rotate(45deg);
    }

    /* Custom Metric Stat Cards */
    .stat-box {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .stat-val {
        font-size: 2.2rem;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .stat-lbl {
        font-size: 0.875rem;
        color: #94a3b8;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 0.25rem;
    }

    /* Modern Styled Buttons */
    div.stButton > button {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: #ffffff !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 0.6rem 1.4rem !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3) !important;
        transition: all 0.2s ease-in-out !important;
    }
    div.stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
        background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0d1322 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
    }
    .sidebar-brand {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    /* Status Badges */
    .badge-pending {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-progress {
        background: rgba(6, 182, 212, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(6, 182, 212, 0.3);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-resolved {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
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

# Sidebar Brand Header
st.sidebar.markdown("""
<div class="sidebar-brand">
    <h2 style="margin:0; font-size: 1.5rem; color: #a5b4fc;">🏛️ E-Complaints</h2>
    <p style="margin:0; font-size: 0.8rem; color: #94a3b8;">Grama Sachivalayam Portal</p>
</div>
""", unsafe_allow_html=True)

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

# Navigation items
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

if st.session_state["current_page"] not in nav_options:
    st.session_state["current_page"] = nav_options[0]

selected_nav = st.sidebar.radio(
    "Navigation Menu",
    nav_options,
    index=nav_options.index(st.session_state["current_page"]) if st.session_state["current_page"] in nav_options else 0
)

if selected_nav != st.session_state["current_page"]:
    st.session_state["current_page"] = selected_nav

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
