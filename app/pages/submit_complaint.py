import streamlit as st
from app.services.api_client import api_client

def render_submit_complaint():
    st.subheader("Register New Grievance")
    st.caption("Submit your civic grievance to Grama Sachivalayam & AP Departmental Officers.")

    user = st.session_state.get("user", {})

    with st.form("submit_complaint_form"):
        title = st.text_input("Grievance Title *", placeholder="e.g. Severe Potholes on School Main Road")
        
        c1, c2 = st.columns(2)
        with c1:
            category = st.selectbox("Category *", [
                "Road Damage", "Drainage", "Water Supply", "Garbage", "Street Light", "Electricity", "Sanitation", "Others"
            ])
        with c2:
            priority = st.selectbox("Priority Level", ["Low", "Medium", "High"])

        v1, v2 = st.columns(2)
        with v1:
            village = st.selectbox("Village / Panchayat *", [
                "Penumaka", "Undavalli", "Kankipadu", "Gollapudi", "Tullur", "Bhimavaram Rural", "Anakapalle", "Tirupati Rural"
            ], index=0 if user.get("village") == "Penumaka" else 0)
        with v2:
            ward = st.text_input("Ward Number / Area *", value=user.get("ward", "Ward 1"))

        landmark = st.text_input("Landmark / Nearby Location", placeholder="e.g. Near ZP High School Gate")
        description = st.text_area("Detailed Grievance Description *", placeholder="Provide complete details about the issue...")
        image_url = st.text_input("Photo / Image Proof URL (Optional)", placeholder="https://images.unsplash.com/...")

        # AI Prediction Button & Box
        if title and len(description) > 10:
            ai_res = api_client.predict_ai(title, description, village)
            if ai_res:
                st.info(f"""
                🤖 **AI Smart Assistant Suggestion**:
                - **Suggested Category:** {ai_res.get('suggestedCategory')} ({ai_res.get('categoryConfidence')}% confidence)
                - **Suggested Priority:** {ai_res.get('suggestedPriority')} ({', '.join(ai_res.get('priorityReasons', []))})
                - **Handling Department:** {ai_res.get('suggestedDepartment')}
                """)
                if ai_res.get("isPossibleDuplicate"):
                    st.warning(f"⚠️ **Possible Duplicate Found!** A similar active grievance ({ai_res.get('duplicateComplaintId')}) already exists in {village}.")

        submitted = st.form_submit_button("Submit Grievance", use_container_width=True, type="primary")

        if submitted:
            if not title or not description or not village:
                st.error("Please fill out all required fields marked with *.")
            else:
                payload = {
                    "title": title,
                    "description": description,
                    "category": category,
                    "priority": priority,
                    "village": village,
                    "wardNumber": ward,
                    "landmark": landmark,
                    "imageUrl": image_url or "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
                    "citizenName": user.get("name", "Citizen"),
                    "citizenEmail": user.get("email", "citizen@ap.gov.in")
                }
                res = api_client.create_complaint(payload)
                if res and res.get("success"):
                    complaint = res.get("complaint", {})
                    st.success(f"🎉 Grievance Registered Successfully! ID: **{complaint.get('id')}**")
                    st.balloons()
                    st.session_state["selected_complaint_id"] = complaint.get("id")
                    st.session_state["current_page"] = "Track Complaint"
                    st.rerun()
                else:
                    st.error("Failed to register complaint. Please try again.")
