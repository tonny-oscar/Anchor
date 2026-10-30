import { useState, useEffect } from 'react';

const phases = [
  { label: 'Breathe in', hint: 'like a wave rolling in', scale: 1 },
  { label: 'Hold', hint: 'the wave at its crest', scale: 1 },
  { label: 'Breathe out', hint: 'like a wave pulling back', scale: 0.55 },
  { label: 'Hold', hint: 'the calm between waves', scale: 0.55 },
];
const PHASE_SECONDS = 4;

const initial = { phase: 0, count: PHASE_SECONDS, rounds: 0 };

function tick(s) {
  if (s.count > 1) return { ...s, count: s.count - 1 };
  const phase = (s.phase + 1) % phases.length;
  return { phase, count: PHASE_SECONDS, rounds: phase === 0 ? s.rounds + 1 : s.rounds };
}

export default function BreathingGuide() {
  const [running, setRunning] = useState(false);
  const [{ phase, count, rounds }, setState] = useState(initial);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setState(tick), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const stop = () => {
    setRunning(false);
    setState(s => ({ ...initial, rounds: s.rounds }));
  };

  const current = phases[phase];
  const scale = running ? current.scale : 0.55;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-56 h-56 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-calm-200" />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-calm-300 via-serenity-400 to-abyss-500 shadow-[0_0_60px_-10px_var(--color-calm-400)]"
          style={{ transform: `scale(${scale})`, transition: `transform ${PHASE_SECONDS}s ease-in-out` }}
        />
        <div className="relative text-white drop-shadow">
          {running ? (
            <>
              <div className="text-xl font-bold">{current.label}</div>
              <div className="text-4xl font-bold">{count}</div>
            </>
          ) : (
            <div className="text-sm font-semibold px-6">Box breathing<br />4 · 4 · 4 · 4</div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 h-5 mb-4">
        {running ? current.hint : 'Calms your nervous system in about a minute.'}
      </p>
      <div className="flex gap-3 items-center">
        {running ? (
          <button onClick={stop} className="btn-secondary">Stop</button>
        ) : (
          <button onClick={() => setRunning(true)} className="btn-primary">Start breathing</button>
        )}
        {rounds > 0 && <span className="text-sm text-calm-700 font-medium">{rounds} {rounds === 1 ? 'round' : 'rounds'} done</span>}
      </div>
    </div>
  );
}
