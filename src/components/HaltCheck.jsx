import { useState } from 'react';

const states = [
  { key: 'Hungry', emoji: '🍞', tip: 'Eat something real: protein, fruit, a warm drink. Low blood sugar can feel like a craving.' },
  { key: 'Angry', emoji: '🌋', tip: 'Move the energy out. Take a brisk walk, write what made you angry, or name it out loud to someone.' },
  { key: 'Lonely', emoji: '🏝️', tip: 'Reach out to one person. Send a text, join a meeting, or sit somewhere with other people around.' },
  { key: 'Tired', emoji: '🌙', tip: 'Rest is recovery. Take a short nap, go to bed early, or close your eyes for 10 slow breaths.' },
];

export default function HaltCheck() {
  const [active, setActive] = useState([]);

  const toggle = (key) => {
    setActive(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Many cravings are really one of these four needs in disguise. Tap any that are true right now.
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {states.map(s => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className={`py-3 rounded-xl border-2 transition text-center ${active.includes(s.key) ? 'border-calm-500 bg-calm-50' : 'border-gray-200 hover:border-calm-300'}`}
          >
            <div className="text-2xl">{s.emoji}</div>
            <div className="text-xs font-semibold mt-1">{s.key}</div>
          </button>
        ))}
      </div>
      {active.length === 0 ? (
        <p className="text-sm text-gray-500 italic">None of these? Then it may be a true craving. Try the breathing guide or the wave timer.</p>
      ) : (
        <ul className="space-y-2">
          {states.filter(s => active.includes(s.key)).map(s => (
            <li key={s.key} className="p-3 bg-calm-50 rounded-xl text-sm text-gray-700 animate-rise">
              <strong className="text-calm-800">{s.key}:</strong> {s.tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
