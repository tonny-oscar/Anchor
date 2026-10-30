export const DEFAULT_CENTER = { lat: -1.2864, lng: 36.8172, label: 'Nairobi' };

export const placeCategories = {
  verified: { label: 'Anchor verified', icon: '⚓', color: '#0a1e2d' },
  treatment: { label: 'Treatment & counselling', icon: '🤝', color: '#1a7f80' },
  hospital: { label: 'Hospitals & clinics', icon: '🏥', color: '#2a6d98' },
  pharmacy: { label: 'Pharmacies', icon: '💊', color: '#a8764a' },
};

const OVERPASS_ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const OVERPASS_TIMEOUT_MS = 60000;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function queryEndpoint(endpoint, query, signal) {
  const res = await fetch(endpoint, { method: 'POST', body: new URLSearchParams({ data: query }), signal });
  if (!res.ok) throw new Error(`${endpoint} responded ${res.status}`);
  return res.json();
}

function readCache(key) {
  try {
    const hit = JSON.parse(localStorage.getItem(key));
    return hit && Date.now() - hit.at < CACHE_TTL_MS ? hit.elements : null;
  } catch {
    return null;
  }
}

function writeCache(key, elements) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), elements }));
  } catch {
    // Storage full or unavailable; results simply won't be cached.
  }
}

export function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function directionsUrl({ lat, lng }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function categorize(tags) {
  const healthcare = tags.healthcare || '';
  const speciality = tags['healthcare:speciality'] || '';
  const socialFor = tags['social_facility:for'] || '';
  if (/rehabilitation|counselling|psychotherapist/.test(healthcare) || /addiction|psychiatry/.test(speciality) || /drug|alcohol|mental/.test(socialFor)) {
    return 'treatment';
  }
  if (tags.amenity === 'pharmacy' || healthcare === 'pharmacy') return 'pharmacy';
  return 'hospital';
}

function addressFrom(tags) {
  const parts = [tags['addr:street'], tags['addr:city'] || tags['addr:suburb']].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export async function fetchNearbyPlaces({ lat, lng }, radiusKm = 10) {
  const r = Math.round(radiusKm * 1000);
  const around = `(around:${r},${lat},${lng})`;
  const query = `[out:json][timeout:55];
(
  nwr${around}["amenity"~"^(hospital|clinic|doctors|pharmacy)$"];
  nwr${around}["healthcare"~"^(rehabilitation|counselling|psychotherapist)$"];
);
out center tags 400;`;

  const cacheKey = `anchor-places:${lat.toFixed(3)},${lng.toFixed(3)},${r}`;
  let elements = readCache(cacheKey);

  if (!elements) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);
    try {
      const json = await Promise.any(OVERPASS_ENDPOINTS.map(ep => queryEndpoint(ep, query, controller.signal)));
      elements = json.elements;
      writeCache(cacheKey, elements);
    } catch {
      throw new Error('All map data servers are busy right now.');
    } finally {
      clearTimeout(timer);
      controller.abort();
    }
  }

  const seen = new Set();
  return elements
    .map(el => {
      const pos = el.type === 'node' ? { lat: el.lat, lng: el.lon } : el.center && { lat: el.center.lat, lng: el.center.lon };
      const tags = el.tags || {};
      if (!pos || !tags.name) return null;
      return {
        id: `${el.type}/${el.id}`,
        name: tags.name,
        category: categorize(tags),
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        address: addressFrom(tags),
        hours: tags.opening_hours || null,
        ...pos,
        distance: distanceKm({ lat, lng }, pos),
      };
    })
    .filter(p => p && !seen.has(p.name + p.category) && seen.add(p.name + p.category))
    .sort((a, b) => a.distance - b.distance);
}

export async function geocode(text) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const [hit] = await res.json();
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon), label: hit.display_name.split(',').slice(0, 2).join(',') } : null;
}
