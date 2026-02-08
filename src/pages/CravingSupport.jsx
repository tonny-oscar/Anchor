import { useState, useEffect } from 'react';

export default function CravingSupport() {
  const [timer, setTimer] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState('General');

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const substanceStrategies = {
    'General': {
      facts: 'Cravings typically peak at 3-5 minutes and pass within 15-30 minutes. Your brain is rewiring itself.',
      tips: ['Drink cold water', 'Change your environment', 'Call someone', 'Practice deep breathing']
    },
    'Alcohol': {
      facts: 'Alcohol cravings often peak in the first 2 weeks. Your liver begins healing within 24 hours of stopping.',
      tips: ['Drink sparkling water with lime', 'Avoid trigger locations', 'Eat something sweet', 'Take a cold shower', 'Remember your worst hangover']
    },
    'Nicotine': {
      facts: 'Nicotine cravings last 3-5 minutes. After 72 hours, nicotine is completely out of your system.',
      tips: ['Chew gum or mints', 'Do 10 pushups', 'Drink water', 'Deep breathing exercises', 'Hold a pen or straw']
    },
    'Cannabis': {
      facts: 'Cannabis withdrawal peaks at 2-3 days. Sleep and appetite normalize within 2 weeks.',
      tips: ['Exercise to release natural endorphins', 'Stay hydrated', 'Practice meditation', 'Eat regular meals', 'Avoid old smoking spots']
    },
    'Cocaine': {
      facts: 'Cocaine cravings can be intense but decrease significantly after the first month. Your dopamine system is healing.',
      tips: ['Intense physical exercise', 'Cold shower', 'Eat protein-rich foods', 'Call your sponsor immediately', 'Remove yourself from triggers']
    },
    'Opioids': {
      facts: 'Opioid cravings are strongest in early recovery but manageable with support. Your brain\'s natural pain relief system is recovering.',
      tips: ['Hot bath or shower', 'Gentle stretching', 'Distraction activities', 'Contact medical support', 'Remember withdrawal will pass']
    }
  };

  const currentStrategy = substanceStrategies[selectedSubstance] || substanceStrategies['General'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-serenity-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">You've Got This</h1>
        <p className="encouragement-text mb-8">This feeling will pass. Let's get through it together.</p>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">What are you craving?</label>
          <select 
            value={selectedSubstance} 
            onChange={(e) => setSelectedSubstance(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serenity-500"
          >
            <option>General</option>
            <option>Alcohol</option>
            <option>Nicotine</option>
            <option>Cannabis</option>
            <option>Cocaine</option>
            <option>Opioids</option>
          </select>
        </div>

        <div className="card mb-6 bg-gradient-to-br from-calm-50 to-calm-100 border-2 border-calm-200">
          <h2 className="text-xl font-semibold mb-3">💪 Science Says</h2>
          <p className="text-gray-700">{currentStrategy.facts}</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">5-Minute Timer</h2>
          <p className="text-sm text-gray-600 mb-4">Most cravings pass in 5 minutes. Can you wait it out?</p>
          <div className="text-center">
            <div className="text-6xl font-bold text-serenity-600 mb-6">{formatTime(timer)}</div>
            <div className="flex gap-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 ${isRunning ? 'btn-secondary' : 'btn-primary'}`}>
                {isRunning ? 'Pause' : 'Start Timer'}
              </button>
              <button onClick={() => { setTimer(300); setIsRunning(false); }} className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition">
                Reset
              </button>
            </div>
            {timer === 0 && <p className="mt-4 text-calm-600 font-semibold text-lg">🎉 You made it! The craving has passed.</p>}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {currentStrategy.tips.map((tip, i) => (
              <div key={i} className="p-4 bg-serenity-50 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-serenity-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Grounding Techniques</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gentle-50 rounded-xl">
              <h3 className="font-semibold mb-2">Box Breathing (4-4-4-4)</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
                <li>Breathe in slowly for 4 counts</li>
                <li>Hold for 4 counts</li>
                <li>Breathe out slowly for 4 counts</li>
                <li>Hold empty for 4 counts</li>
                <li>Repeat 5 times</li>
              </ol>
            </div>
            <div className="p-4 bg-calm-50 rounded-xl">
              <h3 className="font-semibold mb-2">5-4-3-2-1 Grounding</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Name 5 things you can see</li>
                <li>• Name 4 things you can touch</li>
                <li>• Name 3 things you can hear</li>
                <li>• Name 2 things you can smell</li>
                <li>• Name 1 thing you can taste</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Why I Started</h2>
          <p className="text-gray-700 italic mb-3">"I want to be present for my family and feel healthy again."</p>
          <button className="text-serenity-600 hover:underline text-sm">Edit your reason →</button>
        </div>

        <div className="card bg-red-50 border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-800">Need Immediate Help?</h2>
          <p className="text-gray-700 mb-3">If you feel unsafe or at medical risk:</p>
          <div className="space-y-2">
            <a href="tel:988" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition font-medium">📞 988 - Crisis Lifeline</a>
            <a href="tel:18006624357" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition font-medium">📞 1-800-662-4357 - SAMHSA</a>
          </div>
        </div>
      </div>
    </div>
  );
}
