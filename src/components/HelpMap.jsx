import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { placeCategories, directionsUrl, formatDistance } from '../lib/places';

const iconCache = {};
function pinIcon(category) {
  if (!iconCache[category]) {
    const { icon, color } = placeCategories[category] || placeCategories.hospital;
    iconCache[category] = L.divIcon({
      className: 'anchor-pin',
      html: `<span style="background:${color}"><i>${icon}</i></span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30],
    });
  }
  return iconCache[category];
}

const youIcon = L.divIcon({ className: 'anchor-you', html: '<span></span>', iconSize: [20, 20], iconAnchor: [10, 10] });

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 0.8 });
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

function ClickToPick({ onPick }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

export default function HelpMap({
  center,
  zoom = 13,
  you,
  origin,
  radiusKm,
  places = [],
  selectedId,
  onSelect,
  onPick,
  pick,
  className = 'h-[460px]',
}) {
  const markerRefs = useRef({});

  useEffect(() => {
    if (selectedId) markerRefs.current[selectedId]?.openPopup();
  }, [selectedId]);

  return (
    <div className={`isolate relative ${className}`}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={center} zoom={selectedId ? 16 : zoom} />
        {onPick && <ClickToPick onPick={onPick} />}

        {you && <Marker position={[you.lat, you.lng]} icon={youIcon} zIndexOffset={1000}><Popup>You are here</Popup></Marker>}
        {origin && radiusKm && (
          <Circle center={[origin.lat, origin.lng]} radius={radiusKm * 1000} pathOptions={{ color: '#249e9b', weight: 1, fillOpacity: 0.04 }} />
        )}

        {pick && <Marker position={[pick.lat, pick.lng]} icon={pinIcon('verified')} />}

        {places.map(p => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon(p.category)}
            ref={(ref) => { if (ref) markerRefs.current[p.id] = ref; }}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Popup>
              <div className="min-w-48">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 !m-0">{placeCategories[p.category]?.label}</p>
                <p className="font-bold text-base text-abyss-900 !my-1">{p.name}</p>
                {p.address && <p className="text-sm text-gray-600 !m-0">{p.address}</p>}
                {p.distance != null && <p className="text-sm text-gray-600 !m-0">{formatDistance(p.distance)} away</p>}
                <div className="flex gap-3 mt-2">
                  <a href={directionsUrl(p)} target="_blank" rel="noopener noreferrer" className="font-semibold !text-calm-700">Directions</a>
                  {p.phone && <a href={`tel:${p.phone}`} className="font-semibold !text-calm-700">Call</a>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
