import streamlit as st
from app.services.api_client import api_client

def render_auth_page():
    st.subheader("Account Access & Registration")
    
    tab_login, tab_register = st.tabs(["🔒 Sign In", "📝 Create Account"])

    with tab_login:
        st.markdown("#### Login to E-Complaints")
        with st.form("login_form"):
            email = st.text_input("Email / Mobile Number", value="krishna.rao@ap.gov.in")
            password = st.text_input("Password", type="password", value="password123")
            role_choice = st.selectbox("Role", ["Citizen", "Gram Volunteer", "Admin / Officer"])
            
            submitted = st.form_submit_button("Sign In", use_container_width=True)
            if submitted:
                if not email:
                    st.error("Please provide an email or mobile number.")
                else:
                    mapped_role = "citizen" if role_choice == "Citizen" else "volunteer" if role_choice == "Gram Volunteer" else "admin"
                    res = api_client.login(email=email, role=mapped_role, password=password)
                    if res and res.get("success"):
                        user_data = res.get("user", {})
                        st.session_state["logged_in"] = True
                        st.session_state["user"] = user_data
                        st.session_state["role"] = user_data.get("role", mapped_role)
                        st.success(f"Welcome back, {user_data.get('name')}!")
                        st.rerun()
                    else:
                        error_msg = res.get("detail") or "Invalid login credentials. Please try again or register." if res else "Could not connect to authentication service."
                        st.error(error_msg)

        st.caption("Demo Accounts:")
        st.code("""
Citizen:    krishna.rao@ap.gov.in   | password123
Volunteer:  volunteer.ap@ap.gov.in  | password123
Admin:      admin.ap@ap.gov.in      | password123
        """)

    with tab_register:
        st.markdown("#### Register New Account")
        with st.form("register_form"):
            name = st.text_input("Full Name *")
            reg_email = st.text_input("Email Address *")
            phone = st.text_input("Mobile Number")
            reg_password = st.text_input("Password *", type="password")
            village = st.selectbox("Village / Panchayat", ["Penumaka", "Undavalli", "Kankipadu", "Gollapudi", "Tullur", "Bhimavaram Rural", "Anakapalle", "Tirupati Rural"])
            ward = st.text_input("Ward Number", value="Ward 1")
            reg_role = st.selectbox("Account Type", ["Citizen", "Gram Volunteer"])

            reg_submitted = st.form_submit_button("Create Account", use_container_width=True)
            if reg_submitted:
                if not name or not reg_email or not reg_password:
                    st.error("Name, Email, and Password are required.")
                else:
                    role_str = "citizen" if reg_role == "Citizen" else "volunteer"
                    res = api_client.register({
                        "name": name,
                        "email": reg_email,
                        "password": reg_password,
                        "phone": phone,
                        "village": village,
                        "ward": ward,
                        "role": role_str
                    })
                    if res and res.get("success"):
                        u_data = res.get("user", {})
                        st.session_state["logged_in"] = True
                        st.session_state["user"] = u_data
                        st.session_state["role"] = role_str
                        st.success("Account created successfully!")
                        st.rerun()
                    else:
                        st.error("Failed to create account. Please try again.")
