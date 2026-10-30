import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCheckIns } from '../lib/userData';
import { toDayString, addDays, formatDay } from '../lib/dates';
import OceanHero from '../components/OceanHero';
import { moods, moodColors } from '../data/lighthouse';

const moodLabel = Object.fromEntries(moods.map(m => [m.value, `${m.emoji} ${m.label}`]));

export default function CheckIn() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getCheckIns(currentUser.uid, { max: 200 })
      .then(setEntries)
      .catch(err => {
        console.error('Error loading check-ins:', err);
        setEntries([]);
      });
  }, [currentUser]);

  const today = toDayString();
  const latestByDay = {};
  (entries || []).forEach(e => { if (!latestByDay[e.day]) latestByDay[e.day] = e.mood; });
  const calendar = Array.from({ length: 28 }, (_, i) => addDays(today, i - 27));
  const visible = (entries || []).filter(e => filter === 'All' || e.mood === filter);

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/calm-horizon.jpg"
        eyebrow="Daily check-ins"
        title="Your weather log"
        subtitle="Looking back at the weather helps you see the seasons in your recovery."
        size="sm"
      >
        <Link to="/dashboard" className="btn-primary">New check-in</Link>
      </OceanHero>

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative">
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Last 4 weeks</h2>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map(day => (
              <div
                key={day}
                title={`${formatDay(day)}${latestByDay[day] ? ` · ${moodLabel[latestByDay[day]]}` : ''}`}
                className={`aspect-square rounded-xl flex items-end justify-end p-1 text-[10px] ${latestByDay[day] ? `${moodColors[latestByDay[day]]} text-white` : 'bg-gray-100 text-gray-400'} ${day === today ? 'ring-2 ring-abyss-700 ring-offset-2' : ''}`}
              >
                {Number(day.slice(8))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {moods.map(m => (
              <div key={m.value} className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${m.color}`}></div>{m.label}</div>
            ))}
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-100"></div>No check-in</div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Past entries</h2>
            <select className="input w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All weather</option>
              {moods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          {entries === null ? (
            <p className="text-gray-500">Loading your log...</p>
          ) : visible.length === 0 ? (
            <p className="text-gray-500">
              {entries.length === 0 ? 'No check-ins yet. Your first one starts the log.' : 'No entries with that weather.'}
            </p>
          ) : (
            <div className="space-y-3">
              {visible.map(entry => (
                <div key={entry.id} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">
                      {formatDay(entry.day, { weekday: 'short', month: 'short', day: 'numeric' })}
                      <span className="text-gray-500 font-normal text-sm ml-2">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </p>
                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm">{moodLabel[entry.mood]}</span>
                  </div>
                  {entry.notes && <p className="text-gray-700">{entry.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
