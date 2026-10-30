import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resetSubstance, removeSubstance, substanceStats, getCheckIns } from '../lib/userData';
import { formatDay } from '../lib/dates';
import { moods } from '../data/lighthouse';
import OceanHero from '../components/OceanHero';

const milestoneDays = [
  { label: '24 hours', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: '6 months', days: 180 },
  { label: '1 year', days: 365 },
];

const moodLabel = Object.fromEntries(moods.map(m => [m.value, `${m.emoji} ${m.label}`]));

export default function SubstanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const substance = (profile?.substances || []).find(s => s.id === id);

  useEffect(() => {
    getCheckIns(currentUser.uid, { max: 30 })
      .then(list => setNotes(list.filter(c => c.notes).slice(0, 10)))
      .catch(err => console.error('Error loading notes:', err));
  }, [currentUser]);

  if (!substance) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-3">🧭</div>
          <h1 className="text-2xl font-bold mb-2">Not on your chart</h1>
          <p className="text-gray-600 mb-6">This tracker doesn't exist anymore.</p>
          <Link to="/dashboard" className="btn-primary">Back to the harbor</Link>
        </div>
      </div>
    );
  }

  const { daysClean, longestStreak, totalCleanDays } = substanceStats(substance);

  const confirmReset = () => {
    setModal(null);
    resetSubstance(currentUser.uid, substance.id).catch(err => {
      console.error('Error resetting:', err);
      setError('Could not save the reset. Please try again.');
    });
  };

  const confirmRemove = () => {
    removeSubstance(currentUser.uid, substance.id)
      .then(() => navigate('/dashboard'))
      .catch(err => {
        console.error('Error removing:', err);
        setError('Could not remove this tracker. Please try again.');
      });
  };

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/dawn-beach.jpg"
        eyebrow={substance.name}
        title={`${daysClean} ${daysClean === 1 ? 'day' : 'days'} anchored`}
        subtitle={`Since ${formatDay(substance.lastReset)}. Every one of these days is yours to keep.`}
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative">
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Longest streak</p>
            <p className="text-4xl font-bold text-calm-600">{longestStreak}</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total anchored days</p>
            <p className="text-4xl font-bold text-calm-600">{totalCleanDays}</p>
            <p className="text-sm text-gray-500">tracking since {formatDay(substance.startDate)}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Last reset</p>
            <p className="text-lg font-semibold mt-3">
              {substance.lastReset === substance.startDate ? 'Never' : formatDay(substance.lastReset)}
            </p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-6">Milestone timeline</h2>
          <div className="space-y-3">
            {milestoneDays.map(m => {
              const achieved = daysClean >= m.days;
              return (
                <div key={m.label} className={`flex items-center gap-4 p-4 rounded-2xl ${achieved ? 'bg-calm-50' : 'bg-gray-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achieved ? 'bg-calm-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {achieved ? '✓' : '⚓'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-sm text-gray-600">{achieved ? 'Reached' : `${m.days - daysClean} ${m.days - daysClean === 1 ? 'day' : 'days'} to go`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent check-in notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500">Notes you add to your daily check-ins will appear here.</p>
          ) : (
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{formatDay(n.day)}</span>
                    <span>{moodLabel[n.mood]}</span>
                  </div>
                  <p className="text-gray-700">{n.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {(substance.streaks || []).length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Past streaks</h2>
            <div className="flex flex-wrap gap-2">
              {[...substance.streaks].reverse().map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-serenity-50 text-sm">
                  <strong>{s.days}d</strong> <span className="text-gray-500">· ended {formatDay(s.endedOn, { month: 'short', day: 'numeric' })}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <button onClick={() => setModal('reset')} className="w-full py-3 border-2 border-gray-200 rounded-full hover:border-gray-300 transition text-gray-600 font-medium">
            I used today
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">Honesty is part of recovery. This stays private.</p>
          <button onClick={() => setModal('remove')} className="block mx-auto mt-4 text-xs text-gray-400 hover:text-red-600">
            Stop tracking {substance.name}
          </button>
        </div>
      </div>

      {modal === 'reset' && (
        <div className="fixed inset-0 bg-abyss-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-rise" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3">🌊</div>
            <h3 className="text-xl font-bold mb-2">A wave knocked you over. You're still here.</h3>
            <p className="text-gray-700 mb-4">
              A slip doesn't erase your {totalCleanDays} anchored days. Your counter restarts today, but your total and your
              longest streak are kept.
            </p>
            <div className="p-3 bg-gentle-50 rounded-xl text-sm text-gray-700 mb-6">
              If you used after a break, your tolerance may be lower. Stay with someone, and if opioids are involved, keep naloxone nearby.
              {' '}<Link to="/learn#relapse" className="text-calm-700 font-medium hover:underline">What to do after a slip →</Link>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={confirmReset} className="flex-1 btn-primary">Drop anchor again</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'remove' && (
        <div className="fixed inset-0 bg-abyss-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-rise" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Stop tracking {substance.name}?</h3>
            <p className="text-gray-700 mb-6">This removes the counter and its history. It can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full hover:bg-gray-50">Keep it</button>
              <button onClick={confirmRemove} className="flex-1 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
