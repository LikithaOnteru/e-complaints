import streamlit as st
from app.services.api_client import api_client

def render_citizen_dashboard():
    user = st.session_state.get("user", {})
    user_email = user.get("email", "")
    user_name = user.get("name", "Citizen")

    st.subheader(f"Welcome, {user_name} 👋")
    st.caption(f"Village: {user.get('village', 'Penumaka')} | Ward: {user.get('ward', 'Ward 1')}")

    # Fetch user's complaints
    all_complaints = api_client.get_complaints()
    my_complaints = [c for c in all_complaints if c.get("citizenEmail", "").lower() == user_email.lower()]

    total = len(my_complaints)
    pending = sum(1 for c in my_complaints if c.get("status") == "Pending")
    in_progress = sum(1 for c in my_complaints if c.get("status") == "In Progress")
    resolved = sum(1 for c in my_complaints if c.get("status") == "Resolved")

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Submitted Grievances", total)
    with c2:
        st.metric("Pending Action", pending)
    with c3:
        st.metric("In Progress", in_progress)
    with c4:
        st.metric("Resolved", resolved)

    st.markdown("---")

    # Quick Action Buttons
    col_act1, col_act2 = st.columns(2)
    with col_act1:
        if st.button("➕ Register New Grievance", use_container_width=True, type="primary"):
            st.session_state["current_page"] = "Submit Complaint"
            st.rerun()
    with col_act2:
        if st.button("📋 View My Grievances", use_container_width=True):
            st.session_state["current_page"] = "My Complaints"
            st.rerun()

    st.markdown("---")

    st.markdown("### Recent Grievances Status")
    if not my_complaints:
        st.info("You haven't submitted any grievances yet. Click 'Register New Grievance' to lodge a complaint.")
    else:
        for c in my_complaints[:5]:
            status = c.get("status", "Pending")
            badge_color = "🔴" if status == "Pending" else "🟡" if status == "In Progress" else "🟢"
            with st.expander(f"{badge_color} [{c.get('id')}] {c.get('title')} — {status}"):
                st.write(f"**Category:** {c.get('category')} | **Village:** {c.get('village')} ({c.get('wardNumber')})")
                st.write(f"**Description:** {c.get('description')}")
                st.write(f"**Registered Date:** {c.get('createdAt')}")
                if c.get("assignedOfficer"):
                    off = c.get("assignedOfficer", {})
                    st.write(f"**Assigned Officer:** {off.get('name')} ({off.get('department')}) — {off.get('contact')}")
                
                if st.button(f"🔍 Track Details #{c.get('id')}", key=f"track_btn_{c.get('id')}"):
                    st.session_state["selected_complaint_id"] = c.get("id")
                    st.session_state["current_page"] = "Track Complaint"
                    st.rerun()
