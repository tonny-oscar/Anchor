import { useState } from 'react';

export default function Habits() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Exercise', checked: false, currentStreak: 5, longestStreak: 12 },
    { id: 2, name: 'Meditation', checked: true, currentStreak: 8, longestStreak: 15 },
    { id: 3, name: 'Drink Water', checked: false, currentStreak: 3, longestStreak: 10 },
    { id: 4, name: 'Read', checked: false, currentStreak: 2, longestStreak: 7 },
    { id: 5, name: 'Call a Friend', checked: false, currentStreak: 1, longestStreak: 4 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Healthy Habits</h1>
            <p className="encouragement-text">Building new patterns, one day at a time</p>
          </div>
          <button className="btn-primary">Add Habit</button>
        </div>

        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="card">
              <div className="flex items-center gap-4">
                <input type="checkbox" defaultChecked={habit.checked} className="w-6 h-6 text-calm-600 rounded" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{habit.name}</h3>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Current Streak:</span> {habit.currentStreak} days
                    </div>
                    <div>
                      <span className="font-medium">Longest Streak:</span> {habit.longestStreak} days
                    </div>
                  </div>
                </div>
                <div className="text-3xl">{habit.checked ? '✅' : '⭕'}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-8 bg-gentle-50 border-2 border-gentle-200">
          <h2 className="text-xl font-semibold mb-2">💡 Tip</h2>
          <p className="text-gray-700">Replacement habits help fill the space left by old patterns. Start small and build consistency.</p>
        </div>
      </div>
    </div>
  );
}
