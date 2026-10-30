import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile, logCraving } from '../lib/userData';
import OceanHero from '../components/OceanHero';
import BreathingGuide from '../components/BreathingGuide';
import HaltCheck from '../components/HaltCheck';

const TIMER_SECONDS = 600;

const substanceStrategies = {
  'General': {
    facts: 'Cravings usually build, peak and fade within 15–30 minutes. Each one you ride out without using weakens the habit loop in your brain.',
    tips: ['Drink a glass of cold water', 'Change rooms or step outside', 'Text or call someone', 'Breathe slowly with the guide above']
  },
  'Alcohol': {
    facts: 'Cravings are often strongest in the first weeks and at old drinking times. Your liver starts repairing itself within days of stopping.',
    tips: ['Sparkling water with lime in your usual glass', 'Avoid the route past the bar or store', 'Eat something sweet or salty', 'Take a cold shower', 'Remember the morning after your worst night'],
    safety: 'If you have been drinking heavily every day, stopping suddenly can cause seizures or delirium. Talk to a doctor about a safe, supervised detox.'
  },
  'Nicotine': {
    facts: 'A nicotine craving lasts about 3–5 minutes. Nicotine leaves your body within about 3 days, and the urges get shorter and further apart from there.',
    tips: ['Chew gum or suck on a mint', 'Do 10 pushups or squats', 'Sip ice water through a straw', 'Hold a pen or stress ball', 'Delay 5 minutes, then decide again']
  },
  'Cannabis': {
    facts: 'Withdrawal (irritability, poor sleep, low appetite) usually peaks within the first week. Sleep and dreams often settle within 2–4 weeks.',
    tips: ['Exercise to release natural endorphins', 'Make a calming tea instead', 'Try a guided meditation', 'Eat regular meals', 'Avoid your old smoking spots']
  },
  'Stimulants': {
    facts: 'Cocaine and meth cravings can be intense, especially when tired or low. Your brain\'s dopamine system recovers with time; brain scans show real healing after months without use.',
    tips: ['Intense exercise for 10 minutes', 'Cold water on your face', 'Eat a protein-rich snack', 'Call your sponsor or partner now', 'Get away from people or places linked to using'],
    safety: 'The "crash" after stopping can bring very low mood. If you have thoughts of harming yourself, call or text 988 right away.'
  },
  'Opioids': {
    facts: 'Opioid cravings are strongest in early recovery. Medications like buprenorphine or methadone can greatly reduce cravings and the risk of overdose.',
    tips: ['Hot bath or shower for aches', 'Gentle stretching', 'Watch something absorbing', 'Contact your doctor or clinic', 'Remember: withdrawal passes'],
    safety: 'After a break, your tolerance drops fast. Using your old amount can be fatal. Never use alone, and keep naloxone (Narcan) nearby.'
  },
  'Benzodiazepines': {
    facts: 'Benzo withdrawal is best done slowly with a doctor. A gradual taper is safer and usually much more comfortable than stopping at once.',
    tips: ['Slow breathing with the guide above', 'Grounding with the 5-4-3-2-1 exercise', 'Warm drink and a blanket', 'Call your prescriber or a helpline'],
    safety: 'Never stop benzodiazepines suddenly after regular use; it can cause seizures. Ask a doctor for a tapering plan.'
  },
  'Gambling': {
    facts: 'Gambling urges trigger the same reward circuits as substances. Urges often spike with stress, boredom or after payday.',
    tips: ['Put distance between you and money: hand cards to someone you trust', 'Install a gambling site blocker', 'Leave the venue or close the app', 'Write down what you would lose']
  },
};

const urgeSurfSteps = [
  { title: 'Notice the wave', text: 'Say to yourself: "I am having a craving." You are noticing it, not obeying it.' },
  { title: 'Find it in your body', text: 'Where do you feel it: chest, jaw, stomach, hands? Describe it like weather: tight, warm, buzzing.' },
  { title: 'Breathe with it', text: 'Slow breaths in and out. Imagine your breath as a surfboard that keeps you on top of the wave.' },
  { title: 'Watch it crest', text: 'Rate the urge from 1 to 10. Keep watching. It will peak, and it will begin to fall.' },
  { title: 'Let it reach the shore', text: 'As it fades, notice: you rode it out. Each wave you surf makes the next one smaller.' },
];

const DEFAULT_REASON = 'I want to be present for the people I love and feel healthy again.';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CravingSupport() {
  const { currentUser, profile } = useAuth();
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState('General');
  const [surfStep, setSurfStep] = useState(0);
  const [editingReason, setEditingReason] = useState(false);
  const [reasonDraft, setReasonDraft] = useState('');
  const reason = profile?.reason || '';

  useEffect(() => {
    if (!isRunning || timer <= 0) return;
    const timeout = setTimeout(() => {
      setTimer(timer - 1);
      if (timer === 1) {
        setIsRunning(false);
        logCraving(currentUser.uid, { substance: selectedSubstance, method: 'wave-timer' })
          .catch(error => console.error('Error logging craving:', error));
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isRunning, timer, currentUser, selectedSubstance]);

  const finishSurf = () => {
    setSurfStep(0);
    logCraving(currentUser.uid, { substance: selectedSubstance, method: 'urge-surfing' })
      .catch(error => console.error('Error logging craving:', error));
  };

  const saveReason = () => {
    setEditingReason(false);
    saveProfile(currentUser.uid, { reason: reasonDraft.trim() })
      .catch(error => console.error('Error saving reason:', error));
  };

  const currentStrategy = substanceStrategies[selectedSubstance];
  const elapsed = 1 - timer / TIMER_SECONDS;
  const waveHeight = Math.sin(elapsed * Math.PI);
  const timerMessage = timer === 0
    ? 'The wave reached the shore. You did it.'
    : elapsed < 0.15 ? 'The wave is building. Stay with your breath.'
    : elapsed < 0.6 ? 'This is the crest. It feels strongest right now, and it will pass.'
    : 'The wave is falling. Almost back to calm water.';

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/surfer.jpg"
        eyebrow="Craving support"
        title="Ride the wave"
        subtitle="A craving is like a wave: it rises, peaks and always falls. You don't have to fight it. You just have to stay on the board."
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative space-y-6">
        <div className="card">
          <label className="block text-sm font-medium mb-2">What's pulling at you right now?</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(substanceStrategies).map(name => (
              <button
                key={name}
                onClick={() => setSelectedSubstance(name)}
                className={`px-4 py-2 rounded-full text-sm border transition ${selectedSubstance === name ? 'bg-abyss-800 text-white border-abyss-800' : 'border-gray-300 hover:border-calm-400'}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-1">Wave timer</h2>
            <p className="text-sm text-gray-600 mb-4">Give the craving 10 minutes before you decide anything.</p>
            <div className="relative h-52 rounded-2xl bg-gradient-to-b from-serenity-50 to-white overflow-hidden mb-4 border border-gray-200">
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss-600 to-calm-400 transition-all duration-1000"
                style={{ height: `${15 + waveHeight * 60}%` }}
              >
                <svg className="absolute -top-3 w-[200%] h-4 animate-drift" viewBox="0 0 2000 40" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 20 C 250 0 250 0 500 20 C 750 40 750 40 1000 20 C 1250 0 1250 0 1500 20 C 1750 40 1750 40 2000 20 V 40 H 0 Z" fill="#40bab5" />
                </svg>
              </div>
              <div className="relative h-full flex items-center justify-center">
                <span className="text-5xl font-bold text-abyss-900 bg-white/85 backdrop-blur px-5 py-2 rounded-2xl tabular-nums">{formatTime(timer)}</span>
              </div>
            </div>
            <p className={`text-sm mb-4 min-h-[2.5rem] ${timer === 0 ? 'text-calm-700 font-semibold' : 'text-gray-700'}`}>
              {timer === 0 ? '🎉 ' : ''}{timerMessage}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsRunning(!isRunning)} disabled={timer === 0} className={`flex-1 ${isRunning ? 'btn-secondary' : 'btn-primary'}`}>
                {isRunning ? 'Pause' : timer < TIMER_SECONDS && timer > 0 ? 'Resume' : 'Start timer'}
              </button>
              <button onClick={() => { setTimer(TIMER_SECONDS); setIsRunning(false); }} className="px-6 py-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition">
                Reset
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-1">Breathe like the tide</h2>
            <p className="text-sm text-gray-600 mb-4">Follow the circle. In as it grows, out as it shrinks.</p>
            <BreathingGuide />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-calm-50 to-serenity-50 border-calm-200">
          <h2 className="text-xl font-semibold mb-2">🔬 What's happening in your brain</h2>
          <p className="text-gray-700">{currentStrategy.facts}</p>
          {currentStrategy.safety && (
            <div className="mt-4 p-4 rounded-xl bg-white border-l-4 border-gentle-500 text-sm text-gray-800">
              <strong className="text-gentle-800">Stay safe:</strong> {currentStrategy.safety}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick actions for {selectedSubstance === 'General' ? 'any craving' : selectedSubstance.toLowerCase()}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {currentStrategy.tips.map((tip, i) => (
              <div key={tip} className="p-4 bg-serenity-50 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 bg-abyss-700 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 relative min-h-48">
              <img src="/ocean/single-wave.jpg" alt="A small wave curling in the evening light" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="md:col-span-3 p-6">
              <p className="eyebrow mb-2">Guided urge surfing · step {surfStep + 1} of {urgeSurfSteps.length}</p>
              <h2 className="text-2xl font-bold mb-3">{urgeSurfSteps[surfStep].title}</h2>
              <p className="text-gray-700 mb-6 min-h-[3rem]">{urgeSurfSteps[surfStep].text}</p>
              <div className="flex gap-1.5 mb-6">
                {urgeSurfSteps.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= surfStep ? 'bg-calm-500' : 'bg-gray-200'}`} />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSurfStep(s => Math.max(0, s - 1))} disabled={surfStep === 0} className="px-5 py-2 border-2 border-gray-200 rounded-full disabled:opacity-40">Back</button>
                {surfStep < urgeSurfSteps.length - 1 ? (
                  <button onClick={() => setSurfStep(s => s + 1)} className="btn-primary flex-1">Next</button>
                ) : (
                  <button onClick={finishSurf} className="btn-secondary flex-1">I rode it out ✓</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-1">Is it really a craving?</h2>
            <p className="text-xs text-gray-500 mb-3">The HALT check</p>
            <HaltCheck />
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">5-4-3-2-1 grounding</h2>
            <p className="text-sm text-gray-600 mb-3">Bring yourself back to the shore, here and now. Name:</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong className="text-calm-700">5</strong> things you can see</li>
              <li><strong className="text-calm-700">4</strong> things you can touch</li>
              <li><strong className="text-calm-700">3</strong> things you can hear</li>
              <li><strong className="text-calm-700">2</strong> things you can smell</li>
              <li><strong className="text-calm-700">1</strong> thing you can taste</li>
            </ul>
          </div>
        </div>

        <div className="card bg-gentle-50 border-gentle-200">
          <h2 className="text-xl font-semibold mb-3">⚓ Why I dropped anchor</h2>
          {editingReason ? (
            <div>
              <textarea className="input mb-3" rows="3" value={reasonDraft} onChange={e => setReasonDraft(e.target.value)} placeholder={DEFAULT_REASON} />
              <div className="flex gap-3">
                <button onClick={saveReason} className="btn-primary">Save</button>
                <button onClick={() => setEditingReason(false)} className="px-5 py-2 border-2 border-gray-200 rounded-full">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="quote text-xl text-abyss-800 mb-3">"{reason || DEFAULT_REASON}"</p>
              {!reason && <p className="text-xs text-gray-500 mb-3">This is an example. Write your own reason so it's here when you need it most.</p>}
              <button onClick={() => { setReasonDraft(reason); setEditingReason(true); }} className="text-calm-700 hover:underline text-sm font-medium">
                {reason ? 'Edit your reason →' : 'Write your reason →'}
              </button>
            </>
          )}
        </div>

        <div className="card bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-800">Need someone right now?</h2>
          <p className="text-gray-700 mb-3">You don't have to ride this one alone.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <a href="tel:988" className="block p-3 bg-white rounded-xl hover:bg-red-100/50 transition font-medium">📞 988 · Crisis Lifeline</a>
            <a href="tel:18006624357" className="block p-3 bg-white rounded-xl hover:bg-red-100/50 transition font-medium">📞 1-800-662-4357 · SAMHSA</a>
          </div>
          <Link to="/support" className="inline-block mt-3 text-sm text-red-800 hover:underline">More support options →</Link>
        </div>
      </div>
    </div>
  );
}
