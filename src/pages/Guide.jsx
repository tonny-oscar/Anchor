import { useState } from 'react';
import { Link } from 'react-router-dom';
import OceanHero from '../components/OceanHero';

const steps = [
  { icon: '⚓', title: 'Create your account', text: 'Sign up with email or Google. A nickname is fine, and you can stay anonymous.', to: '/signup', cta: 'Sign up' },
  { icon: '🧭', title: 'Drop your first anchor', text: 'On the Harbor page, choose what you want to step away from. Your day counter starts today.', to: '/dashboard', cta: 'Open Harbor' },
  { icon: '🌤️', title: 'Check in every day', text: 'Pick today\'s inner weather and add a note. Over time you\'ll see your patterns and triggers.', to: '/checkin', cta: 'Check-in log' },
  { icon: '🌊', title: 'Use Ride the Wave in a craving', text: 'Start the wave timer, breathe with the circle or follow the urge-surfing steps until it passes.', to: '/craving', cta: 'Ride the Wave' },
  { icon: '🐚', title: 'Build replacement habits', text: 'Add small daily rituals like a walk or a call. Tick them off and grow your streaks.', to: '/habits', cta: 'Habits' },
  { icon: '🏝️', title: 'Add your lighthouse person', text: 'Save an accountability partner so the SOS button can message them in one tap.', to: '/support', cta: 'Support' },
];

const weeks = [
  { title: 'Week 1: Drop anchor', items: ['Tell one person you trust', 'Clear your space of alcohol or drugs', 'Get medical advice if you used heavily every day', 'Check in daily, even if it\'s just one word'] },
  { title: 'Week 2: Learn your waves', items: ['Notice when cravings hit and what set them off', 'Use the HALT check: hungry, angry, lonely or tired?', 'Practise box breathing once a day', 'Join the WhatsApp community'] },
  { title: 'Week 3: Build your routine', items: ['Add 2 or 3 replacement habits', 'Plan your evenings and weekends ahead', 'Go to a meeting or talk to a counsellor', 'Read one recovery story on the blog'] },
  { title: 'Week 4: Hold your course', items: ['Look back at your Progress page', 'Celebrate 30 days in a healthy way', 'Write a plan for if you slip', 'Help someone else who is just starting'] },
];

const faqs = [
  { q: 'Is my data private?', a: 'Yes. Your trackers, check-ins and habits are stored in your own private space. Only you can read them.' },
  { q: 'What happens if I relapse?', a: 'Tap "I used today" on your tracker. Your counter restarts, but your total anchored days and best streak are kept. A slip is part of many recovery stories, not the end of yours.' },
  { q: 'Can I track more than one substance?', a: 'Yes. Each one gets its own counter, streaks and milestones.' },
  { q: 'Does Anchor replace treatment?', a: 'No. Anchor is a support tool. For medical help, use Find help to locate services near you, or call NACADA on 1192.' },
  { q: 'How do I join the community?', a: 'Open the Community page and tap Join on WhatsApp. You can use a nickname.' },
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left font-semibold">
        {q}
        <span className={`text-calm-600 transition ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-4 text-gray-700 animate-rise">{a}</p>}
    </div>
  );
}

export default function Guide() {
  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/dawn-beach.jpg"
        eyebrow="Guide"
        title="Your chart for the journey"
        subtitle="How to get the most out of Anchor, and a simple plan for your first 30 days."
        size="sm"
      />

      <div className="max-w-5xl mx-auto px-4 -mt-4 relative space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">Getting started with Anchor</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <div key={s.title} className="card flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-abyss-800 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 flex-1 mb-4">{s.text}</p>
                <Link to={s.to} className="text-sm font-semibold text-calm-700 hover:underline">{s.cta} →</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="card bg-gradient-to-br from-calm-50 to-serenity-50 border-calm-200">
          <p className="eyebrow mb-2">A daily rhythm</p>
          <h2 className="text-2xl font-bold mb-4">Morning anchor, evening log</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div><p className="font-semibold text-abyss-800 mb-1">🌅 Morning (2 min)</p>Read today's lighthouse message and remind yourself why you started.</div>
            <div><p className="font-semibold text-abyss-800 mb-1">🌊 When it's hard</p>Open Ride the Wave. Give every craving 10 minutes before deciding anything.</div>
            <div><p className="font-semibold text-abyss-800 mb-1">🌙 Evening (3 min)</p>Check in, tick off your habits and note one thing that went well.</div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your first 30 days</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {weeks.map(w => (
              <div key={w.title} className="card">
                <h3 className="font-semibold text-lg mb-3">{w.title}</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {w.items.map(item => <li key={item} className="flex gap-2"><span className="text-calm-500">✓</span>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">Want the full picture? Read <Link to="/blog/sample-first-30-days" className="text-calm-700 underline">The first 30 days: what to expect</Link>.</p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold mb-2">Questions</h2>
          {faqs.map(f => <Faq key={f.q} {...f} />)}
        </section>
      </div>
    </div>
  );
}
