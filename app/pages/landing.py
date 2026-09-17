import streamlit as st
from app.services.api_client import api_client

def render_landing_page():
    # Hero Banner Card
    st.markdown("""
    <div class="hero-banner">
        <h1 style="margin:0; font-size: 2.8rem; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            E-Complaints (స్పందన / Spandana)
        </h1>
        <p style="font-size: 1.25rem; opacity: 0.95; margin-top: 0.75rem; max-width: 850px; font-weight: 400;">
            Rural Grievance Redressal & Civic Monitoring System — Grama Sachivalayam & VSWS Dept, Andhra Pradesh
        </p>
        <p style="font-size: 0.95rem; opacity: 0.85; max-width: 750px; line-height: 1.6;">
            Empowering rural citizens to register, track, and resolve civic grievances in real-time. Transparent, AI-assisted, and accountable.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Fetch live analytics
    analytics = api_client.get_analytics() or {
        "totalComplaints": 5, "pending": 1, "inProgress": 2, "resolved": 2, "resolutionRatePercent": 40.0
    }

    # Custom Stat Cards
    s1, s2, s3, s4 = st.columns(4)
    with s1:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val">{analytics.get("totalComplaints", 0)}</div>
            <div class="stat-lbl">Total Grievances</div>
        </div>
        """, unsafe_allow_html=True)
    with s2:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{analytics.get("pending", 0)}</div>
            <div class="stat-lbl">Pending Action</div>
        </div>
        """, unsafe_allow_html=True)
    with s3:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="background: linear-gradient(135deg, #06b6d4 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{analytics.get("inProgress", 0)}</div>
            <div class="stat-lbl">In Progress</div>
        </div>
        """, unsafe_allow_html=True)
    with s4:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-val" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{analytics.get("resolved", 0)}</div>
            <div class="stat-lbl">Resolved ({analytics.get('resolutionRatePercent', 0)}%)</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Workflow Section
    st.markdown("### 🔄 Grievance Redressal Workflow")
    
    w1, w2, w3, w4 = st.columns(4)
    with w1:
        st.markdown("""
        <div class="glass-card" style="min-height: 200px;">
            <h4 style="color: #818cf8; margin-top: 0;">1. Register</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">Submit grievance with landmark & photo proof. AI auto-detects category & priority.</p>
        </div>
        """, unsafe_allow_html=True)
    with w2:
        st.markdown("""
        <div class="glass-card" style="min-height: 200px;">
            <h4 style="color: #38bdf8; margin-top: 0;">2. Officer Assigned</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">Sachivalayam, RWS, or R&B departmental officers assigned with direct contacts.</p>
        </div>
        """, unsafe_allow_html=True)
    with w3:
        st.markdown("""
        <div class="glass-card" style="min-height: 200px;">
            <h4 style="color: #fbbf24; margin-top: 0;">3. Field Work</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">Engineers & volunteers update step-by-step progress with completion % & photo evidence.</p>
        </div>
        """, unsafe_allow_html=True)
    with w4:
        st.markdown("""
        <div class="glass-card" style="min-height: 200px;">
            <h4 style="color: #34d399; margin-top: 0;">4. Resolution & Rating</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1;">Inspect resolved grievance and submit 1-5 star rating & feedback for quality audit.</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Platform Capabilities
    st.markdown("### 🌟 Key Platform Capabilities")
    f1, f2, f3 = st.columns(3)
    with f1:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: #a78bfa; margin-top:0;">🤖 AI Assistance</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6;">
                Auto category classification, priority safety keyword triggers, and smart duplicate detection in the same village.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with f2:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: #60a5fa; margin-top:0;">🔍 Real-Time Audit Tracker</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6;">
                Complete step pipeline from submission to closure with full event logs, remarks, and field photo attachments.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with f3:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: #f472b6; margin-top:0;">🗺️ Village Map & Analytics</h4>
            <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6;">
                Interactive PyDeck geographical complaint distribution map across AP Panchayats with Plotly executive charts.
            </p>
        </div>
        """, unsafe_allow_html=True)

    # Emergency Contact Quick Preview Banner
    st.markdown("""
    <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 1.25rem 1.75rem; margin-top: 1.5rem; color: #fca5a5;">
        <h4 style="margin:0 0 0.5rem 0; color: #f87171;">🚨 Emergency Helplines</h4>
        <p style="margin:0; font-size: 0.95rem; color: #fecdd3;">
            State Grievance Helpline: <strong>1902</strong> | Water Supply (RWS): <strong>1800-425-1899</strong> | Electricity Board: <strong>1912</strong> | Ambulance: <strong>108</strong> | Police: <strong>112</strong>
        </p>
    </div>
    """, unsafe_allow_html=True)
