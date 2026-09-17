import streamlit as st
from app.services.api_client import api_client

def render_admin_complaints():
    st.subheader("Admin Grievance Management Hub")
    st.caption("Update status, assign departmental officers, and post field progress updates.")

    user = st.session_state.get("user", {})
    all_complaints = api_client.get_complaints()

    # Search & Filter controls
    col_s1, col_s2, col_s3 = st.columns([2, 1, 1])
    with col_s1:
        search = st.text_input("Search Grievance Registry", placeholder="Search by ID, citizen name, village, or title...")
    with col_s2:
        status_filter = st.selectbox("Status Filter", ["All", "Pending", "In Progress", "Resolved", "Rejected"])
    with col_s3:
        cat_filter = st.selectbox("Category Filter", ["All", "Road Damage", "Drainage", "Water Supply", "Street Light", "Garbage", "Electricity", "Sanitation", "Others"])

    filtered = all_complaints
    if status_filter != "All":
        filtered = [c for c in filtered if c.get("status") == status_filter]
    if cat_filter != "All":
        filtered = [c for c in filtered if c.get("category") == cat_filter]
    if search:
        s = search.lower()
        filtered = [c for c in filtered if s in c.get("id", "").lower() or s in c.get("title", "").lower() or s in c.get("citizenName", "").lower() or s in c.get("village", "").lower()]

    st.caption(f"Displaying {len(filtered)} of {len(all_complaints)} grievances")

    if not filtered:
        st.info("No grievances match the specified filters.")
        return

    for c in filtered:
        status = c.get("status", "Pending")
        badge = "🔴 Pending" if status == "Pending" else "🟡 In Progress" if status == "In Progress" else "🟢 Resolved" if status == "Resolved" else "⚪ Rejected"
        
        with st.expander(f"{badge} — [{c.get('id')}] {c.get('title')} ({c.get('village')})"):
            st.write(f"**Citizen:** {c.get('citizenName')} ({c.get('citizenEmail')})")
            st.write(f"**Location:** {c.get('village')} | {c.get('wardNumber')} | Landmark: {c.get('landmark') or 'N/A'}")
            st.write(f"**Category:** {c.get('category')} | **Priority:** `{c.get('priority')}` | **Date:** {c.get('createdAt')}")
            st.write(f"**Description:** {c.get('description')}")
            
            if c.get("imageUrl"):
                st.image(c.get("imageUrl"), caption="Grievance Image", width=350)

            if c.get("assignedOfficer"):
                off = c.get("assignedOfficer", {})
                st.success(f"👮 **Assigned Officer:** {off.get('name')} ({off.get('department')}) — Contact: {off.get('contact')}")

            st.markdown("---")
            st.markdown("#### Admin Actions")

            act_tab1, act_tab2, act_tab3 = st.tabs(["📝 Update Status", "👮 Assign Officer", "📸 Post Field Progress"])

            with act_tab1:
                with st.form(f"status_form_{c.get('id')}"):
                    new_status = st.selectbox("Select New Status", ["Pending", "In Progress", "Resolved", "Rejected"], index=["Pending", "In Progress", "Resolved", "Rejected"].index(status))
                    remark = st.text_area("Status Remark / Note", placeholder="Reason or update details...")
                    sub_status = st.form_submit_button("Update Status", type="primary")
                    if sub_status:
                        res = api_client.update_status(c.get("id"), new_status, remark, updated_by=user.get("name", "Admin"), updated_by_role="admin")
                        if res and res.get("success"):
                            st.success(f"Status updated to {new_status}!")
                            st.rerun()

            with act_tab2:
                with st.form(f"assign_form_{c.get('id')}"):
                    off_name = st.text_input("Officer Name", value="Er. K. Srinivasa Rao")
                    off_dept = st.text_input("Department", value="AP Roads & Buildings (R&B)")
                    off_contact = st.text_input("Contact Number", value="+91 94400 11223")
                    sub_assign = st.form_submit_button("Assign Officer")
                    if sub_assign:
                        res = api_client.assign_officer(c.get("id"), {"name": off_name, "department": off_dept, "contact": off_contact}, updated_by=user.get("name", "Admin"))
                        if res and res.get("success"):
                            st.success(f"Officer {off_name} assigned!")
                            st.rerun()

            with act_tab3:
                with st.form(f"progress_form_{c.get('id')}"):
                    prog_stage = st.text_input("Progress Stage", value="In Progress - Site Work")
                    prog_desc = st.text_area("Progress Description", placeholder="Describe field progress...")
                    prog_percent = st.slider("Field Completion %", 0, 100, 50)
                    prog_proof = st.text_input("Proof Image URL", placeholder="https://images.unsplash.com/...")
                    sub_prog = st.form_submit_button("Publish Progress Update")
                    if sub_prog:
                        res = api_client.post_progress(c.get("id"), {
                            "stage": prog_stage,
                            "description": prog_desc,
                            "progressPercent": prog_percent,
                            "proofUrl": prog_proof,
                            "updatedBy": user.get("name", "Gram Volunteer"),
                            "updatedByRole": user.get("role", "volunteer")
                        })
                        if res and res.get("success"):
                            st.success("Progress update published!")
                            st.rerun()
