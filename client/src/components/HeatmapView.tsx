import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report } from '../types';
import { Flame, Layers } from 'lucide-react';

interface Props {
  reports: Report[];
  className?: string;
}

export const HeatmapView: React.FC<Props> = ({
  reports,
  className = 'w-full h-[550px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const center: [number, number] =
      reports.length > 0
        ? [reports[0].location.latitude, reports[0].location.longitude]
        : [12.9716, 77.5946];

    // Dark/muted tiles for high-contrast heatmap visualization
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(center, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing overlay layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Render multi-tier density radiation circles around reports
    reports.forEach((report) => {
      const { latitude, longitude } = report.location;
      if (!latitude || !longitude) return;

      const isUrgent = report.priority === 'Urgent';
      const isHigh = report.priority === 'High';

      const outerColor = isUrgent ? '#ef4444' : isHigh ? '#f97316' : '#eab308';
      const innerColor = isUrgent ? '#b91c1c' : isHigh ? '#ea580c' : '#ca8a04';

      // Outer broad halo
      L.circle([latitude, longitude], {
        radius: isUrgent ? 550 : 400,
        fillColor: outerColor,
        fillOpacity: 0.15,
        color: outerColor,
        weight: 0,
      }).addTo(map);

      // Mid density ring
      L.circle([latitude, longitude], {
        radius: isUrgent ? 280 : 200,
        fillColor: outerColor,
        fillOpacity: 0.35,
        color: outerColor,
        weight: 0,
      }).addTo(map);

      // Core hotspot
      const core = L.circleMarker([latitude, longitude], {
        radius: isUrgent ? 14 : 10,
        fillColor: innerColor,
        fillOpacity: 0.85,
        color: '#ffffff',
        weight: 2,
      }).addTo(map);

      core.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <div style="font-weight: bold; color: ${innerColor};">${report.priority} Density Hotspot</div>
          <div style="font-weight: 600; margin-top: 2px;">${report.category}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">📍 ${report.location.address}</div>
          <div style="margin-top: 4px; font-size: 10px; font-weight: bold; color: #475569;">
            Status: ${report.status} • Upvotes: ${report.upvotes}
          </div>
        </div>
      `);
    });

    if (reports.length > 0) {
      const bounds = L.latLngBounds(
        reports.map((r) => [r.location.latitude, r.location.longitude])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [reports]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Heatmap Legend */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-2 w-56">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          <span>Civic Issue Hotspots</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Visualizing cluster density & urgent municipal problem concentrations.
        </p>
        <div className="space-y-1.5 pt-1 text-[11px] font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 ring-2 ring-red-200"></span>
            <span className="text-slate-700">Urgent Hazard Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-2 ring-orange-200"></span>
            <span className="text-slate-700">High Density Cluster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 ring-2 ring-yellow-200"></span>
            <span className="text-slate-700">Standard Issue Dispersion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
