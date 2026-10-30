import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { substanceStats } from '../lib/userData';
import OceanHero from '../components/OceanHero';

const milestoneList = [
  { name: 'First Light', days: 1, icon: '🌅', benefit: 'You chose a new direction. Your body begins to detox.' },
  { name: 'Finding Your Sea Legs', days: 3, icon: '⛵', benefit: 'Physical withdrawal often peaks, then starts to ease.' },
  { name: 'One Week at Sea', days: 7, icon: '🧭', benefit: 'Sleep patterns begin to improve.' },
  { name: 'Steady Current', days: 14, icon: '🌊', benefit: 'Mental clarity increases.' },
  { name: 'Full Moon Tide', days: 30, icon: '🌕', benefit: 'Brain chemistry is rebalancing.' },
  { name: 'Calmer Waters', days: 60, icon: '🐬', benefit: 'Moods become more stable.' },
  { name: 'Safe Harbor', days: 90, icon: '⚓', benefit: 'New habits are firmly taking hold.' },
  { name: 'Lighthouse Keeper', days: 180, icon: '🗼', benefit: 'Physical health significantly improved.' },
  { name: 'Around the Sun', days: 365, icon: '☀️', benefit: 'A whole year of seasons, faced clear-headed.' },
  { name: 'Open Ocean', days: 547, icon: '🐋', benefit: 'Relapse risk is much lower.' },
  { name: 'Captain', days: 730, icon: '🧑‍✈️', benefit: 'A new identity, fully your own.' },
  { name: 'Charting New Waters', days: 1825, icon: '🗺️', benefit: 'Long-term recovery is established.' }
];

const timelines = {
  Nicotine: [
    { time: '20 minutes', benefit: 'Heart rate and blood pressure begin to drop' },
    { time: '12 hours', benefit: 'Carbon monoxide in the blood returns to normal' },
    { time: '48 hours', benefit: 'Taste and smell begin to improve' },
    { time: '72 hours', benefit: 'Nicotine is out of your body; breathing feels easier' },
    { time: '2–12 weeks', benefit: 'Circulation and lung function improve' },
    { time: '1–9 months', benefit: 'Coughing and shortness of breath decrease' },
    { time: '1 year', benefit: 'Risk of heart disease is about half that of a smoker' },
    { time: '5+ years', benefit: 'Stroke risk keeps falling toward a non-smoker\'s' },
  ],
  Alcohol: [
    { time: '6–24 hours', benefit: 'Withdrawal may start. If you drank heavily, get medical advice' },
    { time: '24–72 hours', benefit: 'Withdrawal symptoms usually peak, then ease' },
    { time: '1 week', benefit: 'Sleep starts improving; you\'re better hydrated' },
    { time: '2–4 weeks', benefit: 'Liver fat begins to reduce; blood pressure can drop' },
    { time: '1–3 months', benefit: 'Energy, mood, skin and concentration improve' },
    { time: '1 year', benefit: 'Risk of many alcohol-related illnesses keeps falling' },
  ],
  'Any substance': [
    { time: 'Day 1', benefit: 'Your body starts clearing the substance' },
    { time: 'Week 1', benefit: 'The worst of acute withdrawal usually passes' },
    { time: 'Month 1', benefit: 'Brain fog begins to lift' },
    { time: 'Month 3', benefit: 'Focus, memory and decision-making improve' },
    { time: 'Month 6', benefit: 'Emotions steady; everyday joys feel good again' },
    { time: 'Year 1+', benefit: 'The brain\'s reward system shows measurable healing' },
  ],
};

export default function Milestones() {
  const { profile } = useAuth();
  const substances = (profile?.substances || []).map(s => ({ ...s, ...substanceStats(s) }));
  const [selectedId, setSelectedId] = useState(null);
  const [timelineKey, setTimelineKey] = useState('Any substance');
  const selected = substances.find(s => s.id === selectedId) || substances[0];
  const days = selected?.daysClean ?? 0;
  const milestones = milestoneList.map(m => ({ ...m, achieved: !!selected && days >= m.days }));
  const next = selected && milestones.find(m => !m.achieved);

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/shore-gulls.jpg"
        eyebrow="Milestones"
        title="Every tide counts"
        subtitle="Each badge marks a stretch of water you crossed. Celebrate them; they were hard-won."
        size="sm"
      />

      <div className="max-w-6xl mx-auto px-4 -mt-4 relative">
        {!selected && (
          <div className="card mb-8 text-center">
            <p className="text-gray-700 mb-4">Start tracking something to begin earning milestones.</p>
            <Link to="/dashboard" className="btn-primary">Drop your first anchor</Link>
          </div>
        )}

        {substances.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {substances.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`px-4 py-2 rounded-full text-sm border transition ${selected?.id === s.id ? 'bg-abyss-800 text-white border-abyss-800' : 'bg-white border-gray-300 hover:border-calm-400'}`}
              >
                {s.name} · {s.daysClean}d
              </button>
            ))}
          </div>
        )}

        {next && (
          <div className="card mb-8 flex items-center gap-4 bg-abyss-800 border-abyss-700 text-white">
            <div className="text-4xl">{next.icon}</div>
            <div>
              <p className="text-xs uppercase tracking-widest text-calm-200 font-bold">Next on the horizon · {selected.name}</p>
              <p className="text-xl font-semibold">{next.name} · {next.days - days} {next.days - days === 1 ? 'day' : 'days'} to go</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {milestones.map(m => (
            <div key={m.name} className={`card text-center relative overflow-hidden ${m.achieved ? 'bg-gradient-to-b from-calm-50 to-white border-calm-300' : 'bg-gray-50'}`}>
              <div className={`text-5xl mb-3 ${m.achieved ? '' : 'grayscale opacity-40'}`}>{m.icon}</div>
              <h3 className="text-lg font-bold mb-1">{m.name}</h3>
              <p className="text-sm font-medium text-calm-700 mb-2">{m.days} {m.days === 1 ? 'day' : 'days'}</p>
              <p className="text-sm text-gray-600">{m.benefit}</p>
              <div className={`mt-3 text-xs font-semibold ${m.achieved ? 'text-calm-700' : 'text-gray-400'}`}>
                {m.achieved ? '✓ Reached' : 'Still ahead'}
              </div>
            </div>
          ))}
        </div>

        <div className="card mb-8">
          <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">What's healing below the surface</h2>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-full">
              {Object.keys(timelines).map(k => (
                <button key={k} onClick={() => setTimelineKey(k)} className={`px-3 py-1.5 rounded-full text-sm transition ${timelineKey === k ? 'bg-white shadow text-abyss-900 font-semibold' : 'text-gray-600'}`}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {timelines[timelineKey].map(item => (
              <div key={item.time} className="flex items-start gap-4 p-4 bg-gradient-to-r from-calm-50 to-serenity-50 rounded-2xl">
                <div className="bg-abyss-700 text-white px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap min-w-24 text-center">
                  {item.time}
                </div>
                <p className="text-gray-700 pt-1">{item.benefit}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">General guidance only. Everyone's body heals at its own pace.</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <img src="/ocean/dawn-beach.jpg" alt="Sunrise over a calm beach" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-abyss-900/50" />
          <div className="relative text-center text-white py-14 px-6">
            <h2 className="text-3xl font-bold text-white mb-2">Keep sailing</h2>
            <p className="text-abyss-100 max-w-xl mx-auto">You're building a new life, one tide at a time. Every milestone is a victory worth celebrating.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
