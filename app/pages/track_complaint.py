import streamlit as st
from app.services.api_client import api_client

def render_track_complaint():
    st.subheader("Track Grievance Audit & Timeline")

    complaint_id = st.session_state.get("selected_complaint_id")

    # Select complaint ID input
    all_complaints = api_client.get_complaints()
    id_list = [c.get("id") for c in all_complaints]

    selected_id = st.selectbox(
        "Select or Enter Grievance ID",
        id_list,
        index=id_list.index(complaint_id) if complaint_id in id_list else 0 if id_list else 0
    )

    if not selected_id:
        st.info("No grievances available to track.")
        return

    c = api_client.get_complaint_by_id(selected_id)
    if not c:
        st.error(f"Grievance ID {selected_id} not found.")
        return

    st.markdown("---")

    # Grievance Summary Header
    status = c.get("status", "Pending")
    status_icon = "🔴" if status == "Pending" else "🟡" if status == "In Progress" else "🟢" if status == "Resolved" else "⚪"

    col_h1, col_h2 = st.columns([3, 1])
    with col_h1:
        st.markdown(f"### [{c.get('id')}] {c.get('title')}")
        st.write(f"**Category:** {c.get('category')} | **Village:** {c.get('village')} ({c.get('wardNumber')}) | **Priority:** `{c.get('priority')}`")
        st.write(f"**Citizen:** {c.get('citizenName')} ({c.get('citizenEmail')}) | **Date:** {c.get('createdAt')}")
    with col_h2:
        st.markdown(f"### {status_icon} {status}")
        if c.get("assignedOfficer"):
            off = c.get("assignedOfficer", {})
            st.info(f"**Officer:** {off.get('name')}\n**Dept:** {off.get('department')}")

    # Visual Step Tracker
    st.markdown("#### Progress Pipeline")
    steps = ["Submitted", "Officer Assigned", "In Progress", "Resolved"]
    current_step_idx = 0 if status == "Pending" else 1 if c.get("assignedOfficer") and status == "Pending" else 2 if status == "In Progress" else 3 if status == "Resolved" else 0

    p_cols = st.columns(4)
    for idx, s in enumerate(steps):
        with p_cols[idx]:
            if idx <= current_step_idx:
                st.success(f"✅ Step {idx+1}: {s}")
            else:
                st.caption(f"⚪ Step {idx+1}: {s}")

    st.markdown("---")

    # Complete Audit Timeline
    st.markdown("#### Audit Event Timeline")
    timeline = c.get("timeline", [])
    if not timeline:
        st.caption("No timeline events recorded yet.")
    else:
        for t in reversed(timeline):
            with st.container():
                st.markdown(f"**{t.get('stage')}** — `{t.get('timestamp')}`")
                st.write(f"{t.get('description')} *(Updated by: {t.get('updatedBy')})*")
                if t.get("proofUrl"):
                    st.image(t.get("proofUrl"), caption="Field Proof Attachment", width=400)
                if t.get("progressPercent") is not None:
                    st.progress(t.get("progressPercent") / 100, text=f"Field Completion: {t.get('progressPercent')}%")
                st.markdown("---")

    # Rating & Feedback Form for Resolved Grievance
    if status == "Resolved":
        st.markdown("#### Citizen Satisfaction Rating & Feedback")
        if c.get("rating"):
            st.success(f"⭐ Rating Submitted: **{c.get('rating')} / 5 Stars**")
            if c.get("feedbackText"):
                st.write(f"*Feedback:* {c.get('feedbackText')}")
        else:
            with st.form(f"rating_form_{c.get('id')}"):
                star_rating = st.slider("Rate Grievance Resolution Quality (1 = Poor, 5 = Excellent)", 1, 5, 5)
                feedback_text = st.text_area("Feedback Comments (Optional)", placeholder="Write your experience with Grama Sachivalayam team...")
                rate_sub = st.form_submit_button("Submit Rating & Close", type="primary")
                if rate_sub:
                    res = api_client.add_rating(c.get("id"), star_rating, feedback_text)
                    if res and res.get("success"):
                        st.success("Thank you for your rating!")
                        st.rerun()
