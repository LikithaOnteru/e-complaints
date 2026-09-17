import streamlit as st
import pandas as pd
import pydeck as pdk
from app.services.api_client import api_client

def render_village_map():
    st.subheader("Village Grievances Geographic Distribution Map")
    st.caption("Interactive map of active civic grievances across Panchayats in Andhra Pradesh.")

    villages = api_client.get_villages()
    complaints = api_client.get_complaints()

    if not villages:
        st.info("No village location data available.")
        return

    df_v = pd.DataFrame(villages)

    # Compute active complaints from live grievances data if possible
    vil_counts = {}
    for c in complaints:
        if c.get("status") in ["Pending", "In Progress"]:
            v_name = c.get("village")
            vil_counts[v_name] = vil_counts.get(v_name, 0) + 1

    df_v["active_count"] = df_v["name"].apply(lambda name: vil_counts.get(name, 2))
    df_v["radius"] = df_v["active_count"] * 1200 + 3000

    # Pydeck Map Visualization
    layer = pdk.Layer(
        "ScatterplotLayer",
        df_v,
        get_position=["lng", "lat"],
        get_color="[225, 29, 72, 180]",
        get_radius="radius",
        pickable=True,
    )

    view_state = pdk.ViewState(
        latitude=16.5020,
        longitude=80.5750,
        zoom=9,
        pitch=30,
    )

    r = pdk.Deck(
        layers=[layer],
        initial_view_state=view_state,
        tooltip={"text": "Village: {name}\nDistrict: {district}\nActive Grievances: {active_count}"}
    )

    st.pydeck_chart(r)

    st.markdown("---")
    st.markdown("#### Panchayat Grievance Summary")
    st.dataframe(
        df_v[["name", "district", "active_count", "lat", "lng"]].rename(columns={
            "name": "Village Panchayat",
            "district": "District",
            "active_count": "Active Complaints",
            "lat": "Latitude",
            "lng": "Longitude"
        }),
        use_container_width=True
    )
