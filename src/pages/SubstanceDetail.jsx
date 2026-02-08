import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SubstanceDetail() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const substance = { name: 'Alcohol', daysClean: 12, longestStreak: 45, totalCleanDays: 320, lastReset: '2024-01-25' };
  const milestones = [
    { label: '24 Hours', days: 1, achieved: true },
    { label: '7 Days', days: 7, achieved: true },
    { label: '30 Days', days: 30, achieved: false },
    { label: '90 Days', days: 90, achieved: false },
    { label: '1 Year', days: 365, achieved: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{substance.name}</h1>
        <p className="text-3xl text-calm-600 font-semibold mb-8">{substance.daysClean} Days Clean</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Longest Streak</p>
            <p className="text-3xl font-bold text-calm-600">{substance.longestStreak}</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total Clean Days</p>
            <p className="text-3xl font-bold text-calm-600">{substance.totalCleanDays}</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Last Reset</p>
            <p className="text-lg font-semibold">{substance.lastReset}</p>
          </div>
        </div>

        <div className="card mb-8">
          <button onClick={() => setShowModal(true)} className="w-full py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition text-gray-700 font-medium">
            I used today
          </button>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-6">Milestone Timeline</h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${m.achieved ? 'bg-calm-50' : 'bg-gray-100'}`}>
                <div className={`text-3xl ${m.achieved ? '' : 'opacity-30'}`}>
                  {m.achieved ? '✅' : '🔒'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-sm text-gray-600">{m.days} days</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Notes History</h2>
          <p className="text-gray-500">Your journal entries will appear here</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="card max-w-md">
            <h3 className="text-xl font-bold mb-4">Reset Your Streak?</h3>
            <p className="text-gray-700 mb-6">A reset doesn't erase your progress. Start again today.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="flex-1 btn-primary">Confirm Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
