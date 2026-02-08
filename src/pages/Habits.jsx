import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function Habits() {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, [currentUser]);

  const loadHabits = async () => {
    if (!currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setHabits(data.habits || []);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
    setLoading(false);
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName,
      checked: false,
      currentStreak: 0,
      longestStreak: 0,
      lastChecked: null
    };

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        habits: arrayUnion(newHabit)
      });
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleHabit = async (habitId) => {
    const updatedHabits = habits.map(h => {
      if (h.id === habitId) {
        return { ...h, checked: !h.checked };
      }
      return h;
    });

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        habits: updatedHabits
      });
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Healthy Habits</h1>
            <p className="encouragement-text">Building new patterns, one day at a time</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">Add Habit</button>
        </div>

        {habits.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No habits yet</h3>
            <p className="text-gray-600 mb-4">Start building healthy replacement habits</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">Add Your First Habit</button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="card">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={habit.checked} 
                    onChange={() => toggleHabit(habit.id)}
                    className="w-6 h-6 text-calm-600 rounded" 
                  />
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
        )}

        <div className="card mt-8 bg-gentle-50 border-2 border-gentle-200">
          <h2 className="text-xl font-semibold mb-2">💡 Tip</h2>
          <p className="text-gray-700">Replacement habits help fill the space left by old patterns. Start small and build consistency.</p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Habit</h2>
            <input
              type="text"
              placeholder="Habit name (e.g., Exercise, Meditation)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={addHabit} className="flex-1 btn-primary">
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
