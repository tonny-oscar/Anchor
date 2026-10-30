import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addSubstance, addCheckIn, substanceStats } from '../lib/userData';
import { toDayString, formatDay } from '../lib/dates';
import OceanHero from '../components/OceanHero';
import HaltCheck from '../components/HaltCheck';
import { todaysMessage, moods } from '../data/lighthouse';

const quickTools = [
  { to: '/craving', icon: '🌊', title: 'Ride the Wave', text: 'Craving right now? Start here.' },
  { to: '/learn', icon: '📖', title: 'Learn', text: 'How cravings and recovery work.' },
  { to: '/support', icon: '🏝️', title: 'Support', text: 'Your people and 24/7 helplines.' },
  { to: '/milestones', icon: '🐚', title: 'Milestones', text: 'See what you have earned.' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { currentUser, profile } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [mood, setMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const trackedSubstances = profile?.substances || [];
  const checkedInToday = profile?.lastCheckIn?.day === toDayString();

  const availableSubstances = [
    'Alcohol',
    'Nicotine',
    'Cannabis (Weed)',
    'Cocaine',
    'Heroin',
    'Methamphetamine',
    'Prescription Opioids',
    'Benzodiazepines',
    'MDMA (Ecstasy)',
    'LSD',
    'Ketamine',
    'Prescription Stimulants',
    'Synthetic Cannabinoids',
    'Inhalants',
    'Gambling',
    'Other'
  ];

  const handleAddSubstance = (substance) => {
    setShowAddModal(false);
    addSubstance(currentUser.uid, substance).catch(err => {
      console.error('Error adding substance:', err);
      setError('Could not save that. Please try again.');
    });
  };

  const saveCheckIn = () => {
    if (!mood) return;
    const entry = { mood, notes };
    setMood(null);
    setNotes('');
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
    addCheckIn(currentUser.uid, entry).catch(err => {
      console.error('Error saving check-in:', err);
      setSaved(false);
      setError('Your check-in could not be saved. Please try again.');
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/deep-water.jpg"
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${greeting()}, ${profile?.displayName || currentUser?.displayName || 'Friend'}`}
        size="sm"
      >
        <div className="inline-flex items-start gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 max-w-xl">
          <span className="text-2xl" aria-hidden="true">🗼</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-calm-200 mb-1">Today's lighthouse message</p>
            <p className="quote text-lg text-white">{todaysMessage()}</p>
          </div>
        </div>
      </OceanHero>

      <div className="max-w-6xl mx-auto px-4 -mt-4 relative">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex justify-between gap-3">
            {error}
            <button onClick={() => setError('')} className="font-semibold">Dismiss</button>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickTools.map(t => (
            <Link key={t.to} to={t.to} className={`card p-4 hover:-translate-y-1 transition duration-300 ${t.to === '/craving' ? 'bg-abyss-800 border-abyss-700 text-white' : ''}`}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className={`font-semibold ${t.to === '/craving' ? 'text-white' : 'text-abyss-900'}`}>{t.title}</div>
              <div className={`text-sm ${t.to === '/craving' ? 'text-abyss-100' : 'text-gray-600'}`}>{t.text}</div>
            </Link>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Your anchored days</h2>
              <p className="encouragement-text">Progress, not perfection. One tide at a time.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              + Track something new
            </button>
          </div>

          {trackedSubstances.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4 animate-bob inline-block">⚓</div>
              <h3 className="text-xl font-semibold mb-2">Drop your first anchor</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Choose what you want to step away from. Your count starts today, and only you can see it.</p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Choose what to track
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedSubstances.map(sub => {
                const { daysClean, longestStreak } = substanceStats(sub);
                const pct = Math.min((daysClean / 30) * 100, 100);
                return (
                  <Link key={sub.id} to={`/substance/${sub.id}`} className="card relative overflow-hidden hover:shadow-xl transition group">
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-calm-100 to-calm-50/0 transition-all duration-700" style={{ height: `${Math.max(pct, 8)}%` }} />
                    <div className="relative">
                      <h3 className="text-xl font-bold mb-4">{sub.name}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-6xl font-bold text-calm-600">{daysClean}</span>
                        <span className="text-gray-600">{daysClean === 1 ? 'day' : 'days'} anchored</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-3">
                        <span>Best: <strong className="text-abyss-800">{longestStreak}d</strong></span>
                        <span>Since {formatDay(sub.startDate)}</span>
                      </div>
                      <div className="mt-4 bg-white/70 rounded-full h-2">
                        <div className="bg-gradient-to-r from-calm-400 to-serenity-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">The tide rises toward 30 days</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-1">What's the weather inside today?</h2>
            <p className="text-sm text-gray-600 mb-4">
              {checkedInToday
                ? 'You checked in today. You can add another if the weather changes.'
                : 'A quick check-in helps you spot patterns over time.'}
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {moods.map(m => (
                <button key={m.value} onClick={() => setMood(m.value)} className={`py-4 rounded-2xl border-2 transition ${mood === m.value ? 'border-calm-500 bg-calm-50' : 'border-gray-200 hover:border-calm-300'}`}>
                  <div className="text-3xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-medium">{m.label}</div>
                </button>
              ))}
            </div>
            {mood && (
              <div className="animate-rise">
                <textarea placeholder="Anything on the horizon? (optional)" className="input mb-3" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                {mood === 'Cravings' && (
                  <Link to="/craving" className="block mb-3 p-3 rounded-xl bg-gentle-50 text-sm text-gentle-800 hover:bg-gentle-100">
                    Stormy weather is okay. <strong>Open Ride the Wave →</strong>
                  </Link>
                )}
                <button onClick={saveCheckIn} className="btn-primary w-full">Save check-in</button>
              </div>
            )}
            {saved && <p className="mt-3 text-sm text-calm-700 font-medium animate-rise">✓ Logged. Thank you for checking in with yourself.</p>}
            <Link to="/checkin" className="inline-block mt-4 text-sm text-calm-700 hover:underline">See your check-in history →</Link>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-1">HALT: check the hull</h2>
            <p className="text-xs text-gray-500 mb-3">Hungry · Angry · Lonely · Tired</p>
            <HaltCheck />
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-abyss-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto animate-rise" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2">What are you stepping away from?</h2>
            <p className="text-gray-600 mb-6">Pick one or more. Each gets its own counter. There is no judgment here.</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {availableSubstances.map(substance => {
                const tracking = trackedSubstances.find(s => s.name === substance);
                return (
                  <button
                    key={substance}
                    onClick={() => handleAddSubstance(substance)}
                    className="p-4 text-left border-2 border-gray-200 rounded-2xl hover:border-calm-500 hover:bg-calm-50 transition disabled:hover:border-gray-200 disabled:hover:bg-white"
                    disabled={!!tracking}
                  >
                    <span className={tracking ? 'text-gray-400' : 'font-medium'}>{substance}</span>
                    {tracking && <span className="text-xs text-calm-600 ml-2">⚓ Tracking</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full py-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
