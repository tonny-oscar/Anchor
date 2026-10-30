import { useState, useEffect } from 'react';
import OceanHero from '../components/OceanHero';
import HelpMap from '../components/HelpMap';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile } from '../lib/userData';
import { getCenters } from '../lib/content';
import {
  DEFAULT_CENTER, placeCategories, fetchNearbyPlaces, geocode,
  distanceKm, formatDistance, directionsUrl,
} from '../lib/places';
import { kenyaHelplines } from '../data/site';

const RADII = [5, 10, 25];

export default function FindHelp() {
  const { currentUser, profile } = useAuth();
  const saved = profile?.location?.lat ? { lat: profile.location.lat, lng: profile.location.lng, label: profile.location.area || 'your saved area' } : null;

  const [origin, setOrigin] = useState(saved || DEFAULT_CENTER);
  const [isGps, setIsGps] = useState(false);
  const [radius, setRadius] = useState(5);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [areaDraft, setAreaDraft] = useState('');
  const [status, setStatus] = useState('');
  const [centers, setCenters] = useState([]);
  const [result, setResult] = useState({ key: null, places: [], error: null });

  const [attempt, setAttempt] = useState(0);
  const requestKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)},${radius},${attempt}`;
  const loading = result.key !== requestKey;

  useEffect(() => {
    getCenters().then(setCenters).catch(err => console.warn('Verified centres unavailable:', err.code || err.message));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchNearbyPlaces(origin, radius)
      .then(places => !cancelled && setResult({ key: requestKey, places, error: null }))
      .catch(err => {
        console.error('Error loading places:', err);
        if (!cancelled) setResult({ key: requestKey, places: [], error: 'The map data servers are busy, so nearby places could not be loaded.' });
      });
    return () => { cancelled = true; };
  }, [origin, radius, requestKey]);

  const moveTo = (next, gps) => {
    setOrigin(next);
    setIsGps(gps);
    setSelectedId(null);
    if (currentUser) {
      saveProfile(currentUser.uid, { location: { lat: next.lat, lng: next.lng, area: gps ? null : next.label, updatedAt: new Date().toISOString() } })
        .catch(err => console.error('Error saving location:', err));
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Your browser does not support location. Search for your town instead.');
      return;
    }
    setStatus('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        moveTo({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'your location' }, true);
        setStatus('');
      },
      () => setStatus('We couldn\'t get your location. Allow location access in your browser, or search for your town.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  const searchArea = async (e) => {
    e.preventDefault();
    if (!areaDraft.trim()) return;
    setStatus(`Searching for ${areaDraft.trim()}...`);
    try {
      const hit = await geocode(areaDraft.trim());
      if (!hit) {
        setStatus(`We couldn't find "${areaDraft.trim()}". Try a nearby town or add the country, e.g. "Thika, Kenya".`);
        return;
      }
      moveTo(hit, false);
      setStatus('');
    } catch (err) {
      console.error('Geocoding failed:', err);
      setStatus('Search is unavailable right now. Try "Use my location" instead.');
    }
  };

  const verified = centers
    .filter(c => Number.isFinite(c.lat) && Number.isFinite(c.lng))
    .map(c => ({ ...c, category: 'verified', distance: distanceKm(origin, c) }))
    .sort((a, b) => a.distance - b.distance);
  const nearbyVerified = verified.filter(c => c.distance <= radius);
  const all = [...verified, ...result.places];
  const counts = Object.fromEntries(Object.keys(placeCategories).map(k => [k, (k === 'verified' ? nearbyVerified : result.places).filter(p => p.category === k).length]));
  const onMap = all.filter(p => filter === 'all' || p.category === filter);
  const list = [...nearbyVerified, ...result.places].filter(p => filter === 'all' || p.category === filter);
  const selected = all.find(p => p.id === selectedId);
  const mapCenter = selected || origin;
  const googleSearch = `https://www.google.com/maps/search/${encodeURIComponent(`drug rehabilitation centre near ${origin.lat},${origin.lng}`)}`;

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/aerial-shore.jpg"
        eyebrow="Find help near you"
        title="Your nearest safe harbor"
        subtitle="See treatment centres, counsellors, hospitals and pharmacies on the map, with distance and directions."
        size="sm"
      />

      <div className="max-w-7xl mx-auto px-4 -mt-4 relative space-y-4">
        <div className="card">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <button onClick={useMyLocation} className="btn-primary whitespace-nowrap">📍 Use my location</button>
            <form onSubmit={searchArea} className="flex gap-2 flex-1">
              <input value={areaDraft} onChange={e => setAreaDraft(e.target.value)} placeholder="Or search a town, e.g. Mombasa, Kisumu, Nakuru" className="input" />
              <button type="submit" className="btn-secondary">Search</button>
            </form>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-full self-start lg:self-auto">
              {RADII.map(r => (
                <button key={r} onClick={() => setRadius(r)} className={`px-3 py-1.5 rounded-full text-sm transition ${radius === r ? 'bg-white shadow font-semibold text-abyss-900' : 'text-gray-600'}`}>
                  {r} km
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {status || <>Showing places within <strong>{radius} km</strong> of <strong>{isGps ? 'your location' : origin.label}</strong>.</>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm border transition ${filter === 'all' ? 'bg-abyss-800 text-white border-abyss-800' : 'bg-white border-gray-200 hover:border-calm-400'}`}
          >
            All places
          </button>
          {Object.entries(placeCategories).map(([key, c]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm border transition ${filter === key ? 'bg-abyss-800 text-white border-abyss-800' : 'bg-white border-gray-200 hover:border-calm-400'}`}
            >
              {c.icon} {c.label} {!loading && <span className="opacity-60">({counts[key]})</span>}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-0 overflow-hidden">
            <HelpMap
              center={mapCenter}
              zoom={radius > 10 ? 11 : radius > 5 ? 12 : 13}
              you={isGps ? origin : null}
              origin={origin}
              radiusKm={radius}
              places={onMap}
              selectedId={selectedId}
              onSelect={setSelectedId}
              className="h-[420px] lg:h-[600px]"
            />
          </div>

          <div className="card p-0 overflow-hidden flex flex-col lg:h-[600px]">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{loading ? 'Searching nearby...' : `${list.length} places nearby`}</h2>
                {loading && <p className="text-xs text-gray-500">The first search of an area can take up to a minute. After that it's instant.</p>}
              </div>
              {loading && <div className="w-5 h-5 rounded-full border-2 border-calm-200 border-t-calm-600 animate-spin" />}
            </div>
            <div className="overflow-y-auto flex-1 max-h-[480px] lg:max-h-none">
              {result.error && !loading && (
                <div className="p-4 text-sm">
                  <p className="text-red-700 mb-3">{result.error}</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setAttempt(a => a + 1)} className="btn-secondary py-2">Try again</button>
                    <a href={googleSearch} target="_blank" rel="noopener noreferrer" className="self-center text-calm-700 font-semibold hover:underline">Search Google Maps →</a>
                  </div>
                </div>
              )}
              {!loading && !result.error && list.length === 0 && (
                <div className="p-4 text-sm text-gray-600">
                  Nothing found in this area. Try a bigger radius, or <a href={googleSearch} target="_blank" rel="noopener noreferrer" className="text-calm-700 underline">search Google Maps</a>.
                </div>
              )}
              {list.slice(0, 80).map(p => {
                const c = placeCategories[p.category];
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${selectedId === p.id ? 'bg-calm-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex gap-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 text-white" style={{ background: c.color }}>{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-abyss-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.type || c.label} · {formatDistance(p.distance)}</p>
                        {(p.address || p.hours) && <p className="text-xs text-gray-500 truncate">{p.address || p.hours}</p>}
                        {selectedId === p.id && (
                          <div className="flex gap-3 mt-2 text-sm">
                            <a href={directionsUrl(p)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold text-calm-700 hover:underline">Directions</a>
                            {p.phone && <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="font-semibold text-calm-700 hover:underline">Call</a>}
                            {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold text-calm-700 hover:underline">Website</a>}
                          </div>
                        )}
                        {selectedId === p.id && p.description && <p className="text-sm text-gray-600 mt-2">{p.description}</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100">
              Map data © OpenStreetMap contributors. ⚓ marks centres verified by the Anchor team.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Call for help in Kenya</h2>
            <div className="space-y-2">
              {kenyaHelplines.map(h => (
                <a key={h.number} href={`tel:${h.number}`} className="flex items-center gap-4 p-3 rounded-2xl bg-calm-50 hover:bg-calm-100 transition">
                  <span className="text-2xl font-bold text-calm-700 w-16">{h.number}</span>
                  <span>
                    <span className="block font-semibold">{h.name}</span>
                    <span className="block text-sm text-gray-600">{h.note}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="card bg-gentle-50 border-gentle-200">
            <h2 className="text-xl font-semibold mb-3">Before you go</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>📞 Call ahead. Ask about costs, waiting times and whether they offer detox.</li>
              <li>🧾 Bring ID and a list of any medicines you take.</li>
              <li>🤝 Take someone you trust with you if you can.</li>
              <li>⚠️ If you drink heavily every day or use benzodiazepines, ask for a medically supervised detox. Stopping suddenly can be dangerous.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
