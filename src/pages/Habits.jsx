import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addHabit as saveHabit, toggleHabit as saveToggle, removeHabit, habitState } from '../lib/userData';
import OceanHero from '../components/OceanHero';

const suggestions = [
  { icon: '🚶', name: 'Morning walk outside' },
  { icon: '💧', name: 'Drink 8 glasses of water' },
  { icon: '📓', name: '10 minutes of journaling' },
  { icon: '🧘', name: '5 minutes of breathing' },
  { icon: '📞', name: 'Call or text one person' },
  { icon: '🚿', name: 'Cold shower' },
  { icon: '🙏', name: 'Write 3 things I\'m grateful for' },
  { icon: '🤝', name: 'Attend a meeting' },
  { icon: '🥗', name: 'Eat a real breakfast' },
  { icon: '🌙', name: 'In bed by 11pm' },
  { icon: '🏊', name: 'Swim, run or lift' },
  { icon: '📵', name: 'One hour screen-free' },
];

export default function Habits() {
  const { currentUser, profile } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [error, setError] = useState('');
  const habits = (profile?.habits || []).map(h => ({ ...h, ...habitState(h) }));

  const onFail = (err) => {
    console.error('Error saving habit:', err);
    setError('Could not save that change. Please try again.');
  };

  const addHabit = (name = newHabitName) => {
    if (!name.trim()) return;
    setNewHabitName('');
    setShowAddModal(false);
    saveHabit(currentUser.uid, name.trim()).catch(onFail);
  };

  const toggleHabit = (habitId) => {
    saveToggle(currentUser.uid, habitId).catch(onFail);
  };

  const done = habits.filter(h => h.doneToday).length;
  const unusedSuggestions = suggestions.filter(s => !habits.some(h => h.name === s.name));

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/bright-shore.jpg"
        eyebrow="Healthy habits"
        title="New tides, new rituals"
        subtitle="Old habits leave an empty space. Fill it with small things that make you feel strong."
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Today's rituals</h2>
            {habits.length > 0 && <p className="encouragement-text">{done} of {habits.length} done today</p>}
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">+ Add habit</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

        {habits.length === 0 ? (
          <div className="card text-center py-10">
            <div className="text-5xl mb-3">🐚</div>
            <h3 className="text-xl font-semibold mb-2">No rituals yet</h3>
            <p className="text-gray-600 mb-6">Start with one tiny habit. Tap a suggestion below to add it.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <div
                key={habit.id}
                className={`card flex items-center gap-4 transition group ${habit.doneToday ? 'bg-calm-50 border-calm-300' : 'hover:border-calm-300'}`}
              >
                <button onClick={() => toggleHabit(habit.id)} className="flex-1 flex items-center gap-4 text-left" aria-pressed={habit.doneToday}>
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${habit.doneToday ? 'bg-calm-500 border-calm-500 text-white' : 'border-gray-300'}`}>
                    {habit.doneToday && '✓'}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${habit.doneToday ? 'line-through decoration-calm-400 text-gray-500' : ''}`}>{habit.name}</h3>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>Current streak: <strong>{habit.currentStreak}</strong> {habit.currentStreak === 1 ? 'day' : 'days'}</span>
                      <span>Best: <strong>{habit.longestStreak || 0}</strong> days</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => window.confirm(`Remove "${habit.name}"?`) && removeHabit(currentUser.uid, habit.id).catch(onFail)}
                  className="text-gray-300 hover:text-red-600 text-sm px-2"
                  aria-label={`Remove ${habit.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {unusedSuggestions.length > 0 && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold mb-1">Ideas from the shore</h2>
            <p className="text-sm text-gray-600 mb-4">Habits many people in recovery find helpful. Tap to add.</p>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map(s => (
                <button key={s.name} onClick={() => addHabit(s.name)} className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-calm-400 hover:bg-calm-50 text-sm transition">
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="card mt-6 bg-gentle-50 border-gentle-200">
          <h2 className="text-xl font-semibold mb-2">💡 Why replacement habits work</h2>
          <p className="text-gray-700">
            Every habit has a cue, a routine and a reward. You can't always remove the cue (stress, 6pm, payday),
            but you can swap the routine and still get a reward. A walk, a call or a hot shower can calm the same itch.
          </p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-abyss-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-rise" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Add a new ritual</h2>
            <input
              type="text"
              placeholder="e.g. Evening walk by the water"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="input mb-4"
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => addHabit()} className="flex-1 btn-primary">
                Add habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
