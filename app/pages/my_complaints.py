import streamlit as st
from app.services.api_client import api_client

def render_my_complaints():
    user = st.session_state.get("user", {})
    user_email = user.get("email", "").lower()

    st.subheader("My Registered Grievances")
    
    all_complaints = api_client.get_complaints()
    my_complaints = [c for c in all_complaints if c.get("citizenEmail", "").lower() == user_email]

    # Filters
    col_f1, col_f2 = st.columns([2, 1])
    with col_f1:
        search_query = st.text_input("Search Grievances", placeholder="Search by ID, title, or category...")
    with col_f2:
        status_filter = st.selectbox("Status Filter", ["All", "Pending", "In Progress", "Resolved", "Rejected"])

    filtered = my_complaints
    if status_filter != "All":
        filtered = [c for c in filtered if c.get("status") == status_filter]
    if search_query:
        q = search_query.lower()
        filtered = [c for c in filtered if q in c.get("id", "").lower() or q in c.get("title", "").lower() or q in c.get("category", "").lower()]

    st.caption(f"Showing {len(filtered)} of {len(my_complaints)} grievances")

    if not filtered:
        st.info("No grievances found matching your criteria.")
    else:
        for c in filtered:
            status = c.get("status", "Pending")
            badge = "🔴 Pending" if status == "Pending" else "🟡 In Progress" if status == "In Progress" else "🟢 Resolved" if status == "Resolved" else "⚪ Rejected"
            
            with st.container():
                st.markdown(f"#### [{c.get('id')}] {c.get('title')}")
                st.write(f"**Status:** {badge} | **Priority:** `{c.get('priority')}` | **Category:** {c.get('category')}")
                st.write(f"**Village:** {c.get('village')} ({c.get('wardNumber')}) | **Date:** {c.get('createdAt')}")
                st.write(f"**Description:** {c.get('description')}")

                if c.get("assignedOfficer"):
                    off = c.get("assignedOfficer", {})
                    st.success(f"👮 **Assigned Officer:** {off.get('name')} ({off.get('department')}) — Contact: {off.get('contact')}")

                c1, c2 = st.columns([1, 4])
                with c1:
                    if st.button("Track & Audit", key=f"my_track_{c.get('id')}", use_container_width=True):
                        st.session_state["selected_complaint_id"] = c.get("id")
                        st.session_state["current_page"] = "Track Complaint"
                        st.rerun()
                st.markdown("---")
