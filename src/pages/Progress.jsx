import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCheckIns, getCravings, substanceStats } from '../lib/userData';
import { toDayString, addDays, parseDay } from '../lib/dates';
import OceanHero from '../components/OceanHero';
import { moods } from '../data/lighthouse';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Progress() {
  const { currentUser, profile } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [recent, setRecent] = useState([]);
  const [cravings, setCravings] = useState([]);

  useEffect(() => {
    getCheckIns(currentUser.uid, { sinceDays: 90 })
      .then(list => {
        const cutoff = Date.now() - 30 * 86400000;
        setCheckins(list);
        setRecent(list.filter(c => c.timestamp >= cutoff));
      })
      .catch(err => console.error('Error loading check-ins:', err));
    getCravings(currentUser.uid).then(setCravings).catch(err => console.error('Error loading cravings:', err));
  }, [currentUser]);

  const substances = profile?.substances || [];
  const stats = substances.map(s => ({ ...s, ...substanceStats(s) }));
  const totalDays = stats.reduce((sum, s) => sum + s.totalCleanDays, 0);
  const longest = stats.reduce((max, s) => Math.max(max, s.longestStreak), 0);

  const streakHistory = stats
    .flatMap(s => [
      ...(s.streaks || []).map(st => ({ name: s.name, days: st.days, at: st.endedOn, current: false })),
      { name: s.name, days: s.daysClean, at: toDayString(), current: true },
    ])
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(-8);
  const maxStreak = Math.max(1, ...streakHistory.map(s => s.days));

  const stormy = [...cravings.map(c => c.day), ...checkins.filter(c => c.mood === 'Cravings').map(c => c.day)];
  const byWeekday = WEEKDAYS.map((_, i) => stormy.filter(day => parseDay(day).getDay() === i).length);
  const stormiest = Math.max(...byWeekday) > 0 ? WEEKDAYS[byWeekday.indexOf(Math.max(...byWeekday))] : null;

  const moodShare = Object.fromEntries(moods.map(m => [
    m.value,
    recent.length ? Math.round((recent.filter(c => c.mood === m.value).length / recent.length) * 100) : 0,
  ]));

  const today = toDayString();
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const weekCounts = week.map(day => cravings.filter(c => c.day === day).length);
  const maxWeek = Math.max(1, ...weekCounts);

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/underwater.jpg"
        eyebrow="Progress & insights"
        title="How deep your roots go"
        subtitle="The surface changes every day. Underneath, you're building something steady."
        size="sm"
      />

      <div className="max-w-6xl mx-auto px-4 -mt-4 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total anchored days</p>
            <p className="text-5xl font-bold text-calm-600">{totalDays}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Longest streak</p>
            <p className="text-5xl font-bold text-calm-600">{longest}</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Waves ridden out</p>
            <p className="text-5xl font-bold text-serenity-600">{cravings.length}</p>
            <p className="text-sm text-gray-500">cravings survived</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Stormiest day</p>
            <p className="text-3xl font-bold text-abyss-800 mt-2">{stormiest || '—'}</p>
            <p className="text-sm text-gray-500 mt-1">{stormiest ? `Plan something for ${stormiest}s` : 'Not enough data yet'}</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Streak history</h2>
          {streakHistory.length === 0 ? (
            <p className="text-gray-500">Start tracking something on the <Link to="/dashboard" className="text-calm-700 underline">Harbor</Link> page to see your streaks here.</p>
          ) : (
            <>
              <div className="h-64 flex items-end gap-3">
                {streakHistory.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${s.name}: ${s.days} days`}>
                    <span className="text-xs text-gray-500 mb-1">{s.days}d</span>
                    <div
                      className={`w-full rounded-t-xl ${s.current ? 'bg-gradient-to-t from-calm-600 to-calm-300' : 'bg-gradient-to-t from-abyss-600 to-serenity-300'}`}
                      style={{ height: `${Math.max((s.days / maxStreak) * 100, 3)}%` }}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 truncate max-w-full">{s.current ? 'now' : s.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">Teal bars are your current streaks. Every one of them counts.</p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-1">Inner weather</h2>
            <p className="text-sm text-gray-500 mb-4">Last 30 days · {recent.length} check-ins</p>
            <div className="space-y-4">
              {moods.map(m => (
                <div key={m.value} className="flex items-center gap-3">
                  <span className="w-28 text-sm">{m.emoji} {m.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className={`${m.color} h-3 rounded-full`} style={{ width: `${moodShare[m.value]}%` }}></div>
                  </div>
                  <span className="text-sm w-10 text-right">{moodShare[m.value]}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-1">Waves ridden out this week</h2>
            <p className="text-sm text-gray-500 mb-4">Logged from the wave timer and urge surfing</p>
            <div className="h-40 flex items-end gap-2">
              {week.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center justify-end h-full">
                  {weekCounts[i] > 0 && <span className="text-xs text-gray-500 mb-1">{weekCounts[i]}</span>}
                  <div className="w-full bg-gentle-400 rounded-t-xl" style={{ height: `${(weekCounts[i] / maxWeek) * 100}%`, minHeight: '6px' }}></div>
                  <span className="text-xs mt-2 text-gray-600">{WEEKDAYS[parseDay(day).getDay()][0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-calm-50 to-serenity-50 border-calm-200">
          <h2 className="text-xl font-semibold mb-2">🧭 Insight</h2>
          <p className="text-gray-700">
            {stormiest
              ? `Your cravings show up most on ${stormiest}s. Try scheduling a walk, a call or a meeting that day, before the wave builds.`
              : 'Check in daily and use Ride the Wave when cravings hit. Patterns will appear here as your log grows.'}
          </p>
        </div>
      </div>
    </div>
  );
}
