import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BALKANS_CENTER: [number, number] = [43.85, 18.39];
const DEFAULT_ZOOM = 6;

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface LocationMapPickerProps {
  /** Initial marker position */
  lat?: number | null;
  lng?: number | null;
  /** Called when user clicks the map (lat, lng in degrees) */
  onSelect: (lat: number, lng: number) => void;
  /** Optional: called with reverse-geocoded address when user clicks (e.g. from Nominatim) */
  onLocationName?: (name: string) => void;
  /** Height of the map container */
  height?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

function MapClickHandler({
  onSelect,
  onLocationName,
  position,
}: {
  onSelect: (lat: number, lng: number) => void;
  onLocationName?: (name: string) => void;
  position: [number, number] | null;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
      if (onLocationName) {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          { headers: { Accept: 'application/json' } }
        )
          .then((res) => res.json())
          .then((data) => {
            const name =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              data.address?.state ||
              data.display_name?.split(',')[0] ||
              data.display_name ||
              '';
            const country = data.address?.country;
            onLocationName(country ? `${name}, ${country}` : name);
          })
          .catch(() => {});
      }
    },
  });
  return position ? (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Lokacija smeštaja</Popup>
    </Marker>
  ) : null;
}

export default function LocationMapPicker({
  lat,
  lng,
  onSelect,
  onLocationName,
  height = '320px',
  ariaLabel = 'Kliknite na mapu da označite lokaciju',
}: LocationMapPickerProps) {
  const hasInitial = lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  const [position, setPosition] = useState<[number, number] | null>(
    hasInitial ? [Number(lat), Number(lng)] : null
  );

  useEffect(() => {
    if (lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      setPosition([Number(lat), Number(lng)]);
    } else {
      setPosition(null);
    }
  }, [lat, lng]);

  const handleSelect = useCallback(
    (newLat: number, newLng: number) => {
      setPosition([newLat, newLng]);
      onSelect(newLat, newLng);
    },
    [onSelect]
  );

  const center: [number, number] = position ?? (hasInitial ? [Number(lat), Number(lng)] : BALKANS_CENTER);
  const zoom = position || hasInitial ? 14 : DEFAULT_ZOOM;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600" style={{ height }} role="application" aria-label={ariaLabel}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          onSelect={handleSelect}
          onLocationName={onLocationName}
          position={position ?? (hasInitial ? [Number(lat), Number(lng)] : null)}
        />
      </MapContainer>
    </div>
  );
}
