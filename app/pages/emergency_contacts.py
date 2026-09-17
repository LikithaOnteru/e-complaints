import streamlit as st
from app.services.api_client import api_client

def render_emergency_contacts():
    st.subheader("AP Emergency Contacts & Departmental Helplines")
    st.caption("State grievance cell, disaster management, water supply, electricity board, and medical emergency numbers.")

    contacts = api_client.get_emergency_contacts()

    # Search filter
    search = st.text_input("Filter Helplines", placeholder="Search by department name, category, or phone...")
    if search:
        s = search.lower()
        contacts = [c for c in contacts if s in c.get("name", "").lower() or s in c.get("category", "").lower() or s in c.get("phone", "").lower()]

    # Group by category
    categories = sorted(list(set(c.get("category", "General") for c in contacts)))

    for cat in categories:
        st.markdown(f"### 📞 {cat}")
        cat_contacts = [c for c in contacts if c.get("category") == cat]
        
        c_cols = st.columns(min(len(cat_contacts), 2))
        for idx, contact in enumerate(cat_contacts):
            with c_cols[idx % 2]:
                with st.container():
                    st.markdown(f"#### {contact.get('name')}")
                    st.markdown(f"**Primary Phone:** `📞 {contact.get('phone')}`")
                    if contact.get("alternatePhone"):
                        st.write(f"**Alt Phone:** `{contact.get('alternatePhone')}`")
                    st.write(f"**Address:** {contact.get('address')}")
                    st.write(f"**Availability:** {contact.get('availableHours')}")
                    st.markdown("---")
