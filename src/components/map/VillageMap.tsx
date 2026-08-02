import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_VILLAGES } from '../../data/mockVillages';
import { MapPin, Flame, Layers, ExternalLink, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';

// Custom Leaflet Icons using SVG Data URIs
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const highIcon = createCustomIcon('#ef4444');
const pendingIcon = createCustomIcon('#f59e0b');
const inProgressIcon = createCustomIcon('#3b82f6');
const resolvedIcon = createCustomIcon('#10b981');

export const VillageMap: React.FC = () => {
  const { complaints, navigateTo } = useApp();
  const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('All');

  const filteredComplaints = selectedVillageFilter === 'All'
    ? complaints
    : complaints.filter(c => c.village === selectedVillageFilter);

  // Center coordinates (Andhra Pradesh - Vijayawada / Amaravati Region)
  const centerLat = 16.5062;
  const centerLng = 80.6480;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Andhra Pradesh Village Grievance Map</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial tracking of grievances across AP Grama Sachivalayams (Penumaka, Undavalli, Kankipadu, Tullur & more).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMapMode('markers')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapMode === 'markers'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Pin Markers
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapMode === 'heatmap'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Complaint Heatmap
            </button>
          </div>

          {/* Village Filter */}
          <select
            value={selectedVillageFilter}
            onChange={e => setSelectedVillageFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Villages (6)</option>
            {MOCK_VILLAGES.map(v => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div className="relative w-full h-[540px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 z-10">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers Mode */}
          {mapMode === 'markers' &&
            filteredComplaints.map(c => {
              if (!c.coordinates) return null;
              
              let markerIcon = pendingIcon;
              if (c.priority === 'High' && c.status !== 'Resolved') markerIcon = highIcon;
              else if (c.status === 'In Progress') markerIcon = inProgressIcon;
              else if (c.status === 'Resolved') markerIcon = resolvedIcon;

              return (
                <Marker
                  key={c.id}
                  position={[c.coordinates.lat, c.coordinates.lng]}
                  icon={markerIcon}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 space-y-2 max-w-xs">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <span className="text-xs font-bold text-blue-600">{c.id}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{c.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>📍 {c.village} ({c.wardNumber})</span>
                        <PriorityBadge priority={c.priority} size="sm" />
                      </div>
                      <button
                        onClick={() => navigateTo('complaint_details', c.id)}
                        className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                      >
                        View Full Details
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Heatmap Density Mode (Sector intensity circles) */}
          {mapMode === 'heatmap' &&
            MOCK_VILLAGES.map(v => {
              const villageComplaints = complaints.filter(c => c.village === v.name && c.status !== 'Resolved');
              const intensity = villageComplaints.length;
              const radius = 600 + intensity * 250;

              return (
                <React.Fragment key={v.id}>
                  <Circle
                    center={[v.lat, v.lng]}
                    radius={radius}
                    pathOptions={{
                      color: intensity > 6 ? '#ef4444' : intensity > 3 ? '#f59e0b' : '#3b82f6',
                      fillColor: intensity > 6 ? '#ef4444' : intensity > 3 ? '#f59e0b' : '#3b82f6',
                      fillOpacity: 0.35,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-1">
                        <h4 className="font-bold text-sm text-slate-900">{v.name} Village</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Active Unresolved Grievances: <strong>{intensity}</strong>
                        </p>
                        <p className="text-xs font-semibold text-rose-600 mt-1">
                          {intensity > 6 ? '🔥 High Grievance Density Zone' : 'Moderate Activity'}
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                </React.Fragment>
              );
            })}
        </MapContainer>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
          <p className="font-bold text-slate-800 dark:text-slate-200">Map Legend</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">High Priority / Unresolved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">Pending Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
