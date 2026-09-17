import streamlit as st
from app.services.api_client import api_client

def render_notifications_page():
    st.subheader("Grievance Notifications Hub")

    notifs = api_client.get_notifications()

    if not notifs:
        st.info("No notifications found.")
        return

    unread_count = sum(1 for n in notifs if not n.get("read"))
    st.caption(f"Unread Alerts: **{unread_count}** | Total Notifications: **{len(notifs)}**")

    for n in notifs:
        is_unread = not n.get("read")
        badge = "🔴 Unread" if is_unread else "⚪ Read"
        
        with st.expander(f"{badge} — {n.get('title')} ({n.get('timestamp')})", expanded=is_unread):
            st.write(f"**Message:** {n.get('message')}")
            if n.get("complaintId"):
                st.write(f"**Grievance ID:** {n.get('complaintId')}")
                if st.button(f"Inspect Grievance #{n.get('complaintId')}", key=f"notif_inspect_{n.get('id')}"):
                    st.session_state["selected_complaint_id"] = n.get("complaintId")
                    st.session_state["current_page"] = "Track Complaint"
                    st.rerun()

            if is_unread:
                if st.button("Mark as Read", key=f"mark_read_{n.get('id')}"):
                    api_client.mark_notification_read(n.get("id"))
                    st.rerun()
