import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report, IssueLocation } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface Props {
  reports?: Report[];
  selectedLocation?: Partial<IssueLocation>;
  onSelectLocation?: (location: { latitude: number; longitude: number; address?: string }) => void;
  onSelectReport?: (report: Report) => void;
  selectMode?: boolean;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export const MapView: React.FC<Props> = ({
  reports = [],
  selectedLocation,
  onSelectLocation,
  onSelectReport,
  selectMode = false,
  center = [12.9716, 77.5946], // Default Bengaluru Civic Center
  zoom = 13,
  className = 'w-full h-[500px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] =
      selectedLocation?.latitude && selectedLocation?.longitude
        ? [selectedLocation.latitude, selectedLocation.longitude]
        : reports.length > 0
        ? [reports[0].location.latitude, reports[0].location.longitude]
        : center;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(initialCenter, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Handle map clicks in select mode
    if (selectMode && onSelectLocation) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onSelectLocation({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        });
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Reports Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || selectMode) return;

    markersLayer.clearLayers();

    reports.forEach((report) => {
      const { latitude, longitude } = report.location;
      if (!latitude || !longitude) return;

      // Color coding by status
      let pinColor = '#ea580c'; // default civic orange
      if (report.status === 'Resolved' || report.status === 'Verified') {
        pinColor = '#10b981'; // green
      } else if (report.status === 'In Progress') {
        pinColor = '#f59e0b'; // amber
      } else if (report.priority === 'Urgent') {
        pinColor = '#ef4444'; // red
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(markersLayer);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-slate-900 max-w-[240px]';
      popupContent.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: ${pinColor}; text-transform: uppercase;">
          ${report.category}
        </div>
        <div style="font-size: 13px; font-weight: 700; margin-top: 2px; line-height: 1.2;">
          ${report.title}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
          📍 ${report.location.address}
        </div>
        <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px; background: #f1f5f9;">
            ${report.status}
          </span>
          <button id="view-btn-${report.id}" style="
            background: #ea580c;
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
          ">
            Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-btn-${report.id}`);
        if (btn && onSelectReport) {
          btn.onclick = () => onSelectReport(report);
        }
      });
    });

    if (reports.length > 0) {
      const bounds = L.latLngBounds(
        reports.map((r) => [r.location.latitude, r.location.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, selectMode]);

  // Update selected location marker in selectMode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectMode) return;

    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      const pos: [number, number] = [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ];

      if (!pickerMarkerRef.current) {
        const pickerIcon = L.divIcon({
          className: 'picker-pin',
          html: `
            <div style="
              background-color: #ea580c;
              width: 36px;
              height: 36px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 6px 16px rgba(234,88,12,0.4);
              border: 3px solid white;
            ">
              <div style="width: 12px; height: 12px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        pickerMarkerRef.current = L.marker(pos, {
          icon: pickerIcon,
          draggable: true,
        }).addTo(map);

        pickerMarkerRef.current.on('dragend', (e) => {
          const latlng = (e.target as L.Marker).getLatLng();
          if (onSelectLocation) {
            onSelectLocation({
              latitude: Number(latlng.lat.toFixed(6)),
              longitude: Number(latlng.lng.toFixed(6)),
            });
          }
        });
      } else {
        pickerMarkerRef.current.setLatLng(pos);
      }

      map.panTo(pos);
    }
  }, [selectedLocation, selectMode]);

  // GPS Locate me button handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 16);
        }
        if (onSelectLocation) {
          onSelectLocation({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            address: 'My Current Location (GPS)',
          });
        }
      },
      () => {
        // Fallback to center coordinates if GPS denied in sandbox
        const fallbackCoords: [number, number] = [12.9716, 77.5946];
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(fallbackCoords, 15);
        }
        if (onSelectLocation) {
          onSelectLocation({
            latitude: 12.9716,
            longitude: 77.5946,
            address: 'Central District, Bengaluru',
          });
        }
      }
    );
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Locate Button */}
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-4 right-4 z-[400] bg-white text-slate-800 hover:text-orange-600 p-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-bold transition-all hover:shadow-xl"
        title="Use my current GPS location"
      >
        <Navigation className="w-4 h-4 text-orange-600" />
        <span>Locate Me</span>
      </button>

      {selectMode && (
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 font-medium">
          <MapPin className="w-4 h-4 text-orange-600" />
          <span>Click anywhere or drag pin to position</span>
        </div>
      )}
    </div>
  );
};
