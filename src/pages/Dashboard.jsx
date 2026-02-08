import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [trackedSubstances, setTrackedSubstances] = useState([]);
  const [mood, setMood] = useState(null);
  const [notes, setNotes] = useState('');

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
    'Other'
  ];

  const addSubstance = (substance) => {
    if (!trackedSubstances.find(s => s.name === substance)) {
      setTrackedSubstances([...trackedSubstances, {
        id: Date.now(),
        name: substance,
        daysClean: 0,
        longestStreak: 0,
        totalCleanDays: 0,
        lastReset: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hi Friend 👋</h1>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="encouragement-text mt-2">Progress, not perfection. One day at a time.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Recovery Journey</h2>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              + Add Substance to Track
            </button>
          </div>

          {trackedSubstances.length === 0 ? (
            <div className="card text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Start Your Journey</h3>
              <p className="text-gray-600 mb-4">Add a substance you want to track to begin</p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Add Your First Substance
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedSubstances.map(sub => (
                <Link key={sub.id} to={`/substance/${sub.id}`} className="card hover:shadow-lg transition">
                  <h3 className="text-2xl font-bold mb-4">{sub.name}</h3>
                  <div className="text-5xl font-bold text-calm-600 mb-2">{sub.daysClean}</div>
                  <p className="text-gray-600 mb-4">Days Clean</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Longest Streak: {sub.longestStreak} days</p>
                    <p>Started: {sub.startDate}</p>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-calm-600 h-2 rounded-full" style={{width: `${Math.min((sub.daysClean / 30) * 100, 100)}%`}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Progress to 30 days</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[{e:'😊',l:'Good'},{e:'😐',l:'Okay'},{e:'😞',l:'Low'},{e:'😣',l:'Cravings'}].map(m => (
                <button key={m.l} onClick={() => setMood(m.l)} className={`p-4 rounded-xl border-2 transition ${mood === m.l ? 'border-calm-600 bg-calm-50' : 'border-gray-200 hover:border-calm-300'}`}>
                  <div className="text-3xl mb-1">{m.e}</div>
                  <div className="text-xs">{m.l}</div>
                </button>
              ))}
            </div>
            {mood && (
              <>
                <textarea placeholder="Optional notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                <button className="btn-primary w-full">Save Check-In</button>
              </>
            )}
          </div>

          <div className="card bg-gradient-to-br from-serenity-50 to-serenity-100 border-2 border-serenity-200">
            <h2 className="text-xl font-semibold mb-2">Having a tough moment?</h2>
            <p className="text-gray-700 mb-4">You're not alone. We're here to help.</p>
            <Link to="/craving" className="btn-secondary w-full block text-center">I'm having a craving</Link>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Substance to Track</h2>
            <p className="text-gray-600 mb-6">Select the substance you want to track in your recovery journey</p>
            
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {availableSubstances.map(substance => (
                <button
                  key={substance}
                  onClick={() => addSubstance(substance)}
                  className="p-4 text-left border-2 border-gray-200 rounded-xl hover:border-calm-500 hover:bg-calm-50 transition"
                  disabled={trackedSubstances.find(s => s.name === substance)}
                >
                  <span className={trackedSubstances.find(s => s.name === substance) ? 'text-gray-400' : 'font-medium'}>
                    {substance}
                  </span>
                  {trackedSubstances.find(s => s.name === substance) && (
                    <span className="text-xs text-calm-600 ml-2">✓ Tracking</span>
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowAddModal(false)}
              className="w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
