import streamlit as st
from app.services.api_client import api_client

def render_landing_page():
    st.markdown("""
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); padding: 2.5rem; border-radius: 16px; color: white; margin-bottom: 2rem;">
        <h1 style="margin:0; font-size: 2.5rem; font-weight: 800;">E-Complaints (స్పందన / Spandana)</h1>
        <p style="font-size: 1.2rem; opacity: 0.9; margin-top: 0.5rem;">
            Rural Grievance Redressal & Civic Monitoring System — Grama Sachivalayam & VSWS Dept, Andhra Pradesh
        </p>
        <p style="font-size: 1rem; opacity: 0.8; max-width: 800px;">
            Empowering rural citizens to register, track, and resolve civic grievances in real-time. Transparent, AI-assisted, and accountable.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Fetch live analytics
    analytics = api_client.get_analytics() or {
        "totalComplaints": 4, "pending": 1, "inProgress": 2, "resolved": 1, "resolutionRatePercent": 25.0
    }

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Grievances", analytics.get("totalComplaints", 0), delta="Active Registry")
    with col2:
        st.metric("Pending Action", analytics.get("pending", 0), delta_color="inverse")
    with col3:
        st.metric("In Progress", analytics.get("inProgress", 0))
    with col4:
        st.metric("Resolved & Closed", analytics.get("resolved", 0), delta=f"{analytics.get('resolutionRatePercent', 0)}% Rate")

    st.markdown("---")

    # Workflow Section
    st.subheader("How It Works — Grievance Redressal Workflow")
    w1, w2, w3, w4 = st.columns(4)
    with w1:
        st.markdown("### 1. Register")
        st.caption("Submit your grievance with details, location, and photo proof. AI suggests category and priority automatically.")
    with w2:
        st.markdown("### 2. Officer Assigned")
        st.caption("Grama Sachivalayam / RWS / R&B departmental officers are assigned with direct contact details.")
    with w3:
        st.markdown("### 3. Field Work")
        st.caption("Volunteers & engineers update step-by-step field progress with photo evidence.")
    with w4:
        st.markdown("### 4. Resolution & Rate")
        st.caption("Review the resolved grievance and provide rating and feedback to ensure accountability.")

    st.markdown("---")

    # Key Features
    st.subheader("Key Platform Capabilities")
    f1, f2, f3 = st.columns(3)
    with f1:
        st.markdown("**AI Assistance**")
        st.write("Automatic category detection, priority calculation, and duplicate grievance prevention.")
    with f2:
        st.markdown("**Real-Time Tracking**")
        st.write("Complete audit log timeline from submission to resolution with photo proof.")
    with f3:
        st.markdown("**Village Map & Analytics**")
        st.write("Geographic complaint heatmap and departmental performance metrics for administrators.")

    st.markdown("---")

    # Emergency Contact Quick Preview
    st.subheader("Emergency Helplines")
    st.info("State Grievance Helpline: **1902** | Water Supply (RWS): **1800-425-1899** | Electricity: **1912** | Ambulance: **108** | Police: **112**")
