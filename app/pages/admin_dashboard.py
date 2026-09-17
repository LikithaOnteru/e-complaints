import streamlit as st
import pandas as pd
import plotly.express as px
from app.services.api_client import api_client

def render_admin_dashboard():
    st.subheader("Executive Admin Dashboard & Analytics")

    analytics = api_client.get_analytics() or {}
    complaints = api_client.get_complaints()

    # Executive KPI Cards
    k1, k2, k3, k4, k5 = st.columns(5)
    with k1:
        st.metric("Total Grievances", analytics.get("totalComplaints", 0))
    with k2:
        st.metric("Pending", analytics.get("pending", 0), delta_color="inverse")
    with k3:
        st.metric("In Progress", analytics.get("inProgress", 0))
    with k4:
        st.metric("Resolved", analytics.get("resolved", 0), delta=f"{analytics.get('resolutionRatePercent', 0)}% Rate")
    with k5:
        st.metric("Citizen Rating", f"⭐ {analytics.get('averageRating', 4.8)} / 5.0")

    st.markdown("---")

    # Interactive Plotly Charts
    c_chart1, c_chart2 = st.columns(2)

    with c_chart1:
        st.markdown("#### Grievances by Category")
        cat_breakdown = analytics.get("categoryBreakdown", {})
        if cat_breakdown:
            df_cat = pd.DataFrame(list(cat_breakdown.items()), columns=["Category", "Count"])
            fig_pie = px.pie(df_cat, values="Count", names="Category", hole=0.4, color_discrete_sequence=px.colors.qualitative.Set2)
            st.plotly_chart(fig_pie, use_container_width=True)
        else:
            st.info("No category data available.")

    with c_chart2:
        st.markdown("#### Grievances by Village / Panchayat")
        vil_breakdown = analytics.get("villageBreakdown", {})
        if vil_breakdown:
            df_vil = pd.DataFrame(list(vil_breakdown.items()), columns=["Village", "Count"])
            fig_bar = px.bar(df_vil, x="Village", y="Count", color="Count", color_continuous_scale="Viridis")
            st.plotly_chart(fig_bar, use_container_width=True)
        else:
            st.info("No village data available.")

    st.markdown("---")

    # Export Report Section
    st.markdown("#### Export Grievance Reports")
    if complaints:
        df_export = pd.DataFrame(complaints)
        # Flatten officer data if present
        df_export["officer"] = df_export["assignedOfficer"].apply(lambda x: x.get("name") if isinstance(x, dict) else "Unassigned")
        
        csv_data = df_export.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📥 Download Complete Report (CSV)",
            data=csv_data,
            file_name="rural_grievances_report.csv",
            mime="text/csv",
            type="primary"
        )
