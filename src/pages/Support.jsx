import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile } from '../lib/userData';
import OceanHero from '../components/OceanHero';

const reachOutScripts = [
  { label: 'When it\'s hard right now', text: "Hey, I'm having a rough moment with cravings. Could you talk for 10 minutes?" },
  { label: 'When you just need company', text: "Not an emergency, but I don't want to be alone tonight. Want to grab food or just hang out?" },
  { label: 'After a slip', text: "I slipped today. I'm safe, and I'm getting back on track, but I wanted to be honest with you." },
  { label: 'Sharing a win', text: "Small win: I made it through a craving today without using. Wanted someone to know!" },
];

const groups = [
  { name: 'Alcoholics Anonymous (AA)', text: '12-step fellowship for alcohol recovery', url: 'https://www.aa.org' },
  { name: 'Narcotics Anonymous (NA)', text: '12-step fellowship for drug recovery', url: 'https://www.na.org' },
  { name: 'SMART Recovery', text: 'Science-based, self-empowering recovery meetings', url: 'https://www.smartrecovery.org' },
  { name: 'Refuge Recovery', text: 'Buddhist-inspired, mindfulness-based recovery', url: 'https://www.refugerecovery.org' },
  { name: 'Al-Anon', text: 'Support for families and friends of people who drink', url: 'https://al-anon.org' },
  { name: 'Nar-Anon', text: 'Support for families and friends of people who use drugs', url: 'https://www.nar-anon.org' },
];

export default function Support() {
  const { currentUser, profile } = useAuth();
  const [partnerEmail, setPartnerEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(null);
  const savedPartner = profile?.emergencyContact;

  const addPartner = () => {
    const email = partnerEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setPartnerEmail('');
    setMessage('Your lighthouse person is saved.');
    setTimeout(() => setMessage(''), 3000);
    saveProfile(currentUser.uid, { emergencyContact: email }).catch(error => {
      console.error('Error adding partner:', error);
      setMessage('Could not save your partner. Please try again.');
    });
  };

  const removePartner = () => {
    saveProfile(currentUser.uid, { emergencyContact: null }).catch(error => console.error('Error removing partner:', error));
  };

  const copyScript = async (text, i) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Clipboard unavailable:', error);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/islands.jpg"
        eyebrow="Support & resources"
        title="No one is an island"
        subtitle="Recovery is easier with people around you. Here's how to build your crew and where to find help any time of day."
        size="sm"
        position="center 35%"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-1">Your lighthouse person</h2>
          <p className="text-gray-700 mb-4">An accountability partner is someone you trust to shine a light when the water gets dark.</p>

          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm border ${message.startsWith('Your') ? 'bg-calm-50 border-calm-200 text-calm-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message}
            </div>
          )}

          {savedPartner && (
            <div className="mb-4 p-4 bg-calm-50 rounded-xl flex items-center gap-3">
              <span className="text-2xl">🗼</span>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Current partner</p>
                <p className="font-semibold text-calm-800">{savedPartner}</p>
              </div>
              <button onClick={removePartner} className="text-sm text-gray-500 hover:text-red-600">Remove</button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Partner's email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              className="input flex-1"
            />
            <button onClick={addPartner} className="btn-primary">
              {savedPartner ? 'Update' : 'Add'} partner
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-1">Words for when it's hard to ask</h2>
          <p className="text-gray-700 mb-4">Reaching out is often the hardest part. Copy one of these and send it as is.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {reachOutScripts.map((s, i) => (
              <div key={s.label} className="p-4 bg-serenity-50 rounded-2xl flex flex-col">
                <p className="text-xs font-bold uppercase tracking-wider text-serenity-700 mb-2">{s.label}</p>
                <p className="text-gray-800 flex-1 mb-3">"{s.text}"</p>
                <button onClick={() => copyScript(s.text, i)} className="self-start text-sm font-medium text-calm-700 hover:underline">
                  {copied === i ? '✓ Copied' : 'Copy message'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">24/7 support lines</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="tel:988" className="block p-4 bg-calm-50 rounded-2xl hover:bg-calm-100 transition">
              <h3 className="font-semibold mb-1">988 · Suicide & Crisis Lifeline</h3>
              <p className="text-sm text-gray-600">Call or text, free and confidential (US)</p>
            </a>
            <a href="tel:18006624357" className="block p-4 bg-calm-50 rounded-2xl hover:bg-calm-100 transition">
              <h3 className="font-semibold mb-1">1-800-662-4357 · SAMHSA Helpline</h3>
              <p className="text-sm text-gray-600">Treatment referrals and information (US)</p>
            </a>
            <a href="tel:18007997233" className="block p-4 bg-calm-50 rounded-2xl hover:bg-calm-100 transition">
              <h3 className="font-semibold mb-1">1-800-799-7233 · Domestic Violence Hotline</h3>
              <p className="text-sm text-gray-600">For anyone in an unsafe home situation (US)</p>
            </a>
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="block p-4 bg-calm-50 rounded-2xl hover:bg-calm-100 transition">
              <h3 className="font-semibold mb-1">🌍 Outside the US?</h3>
              <p className="text-sm text-gray-600">findahelpline.com lists free helplines in your country</p>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-1">Find your crew</h2>
          <p className="text-gray-700 mb-4">Meetings happen in person and online, every day, around the world.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {groups.map(g => (
              <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl border border-gray-200 hover:border-calm-400 hover:bg-calm-50 transition group">
                <h3 className="font-semibold mb-1 group-hover:text-calm-800">{g.name}</h3>
                <p className="text-sm text-gray-600">{g.text}</p>
              </a>
            ))}
          </div>
        </div>

        <Link to="/learn" className="card flex items-center gap-4 hover:shadow-xl transition bg-gentle-50 border-gentle-200">
          <span className="text-3xl">📖</span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Want to understand what you're going through?</h2>
            <p className="text-sm text-gray-600">Withdrawal, brain recovery, medication and staying safe, in the Learn section.</p>
          </div>
          <span className="text-calm-700 font-semibold">→</span>
        </Link>

        <div className="card bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-800">In immediate danger?</h2>
          <ul className="space-y-1 text-gray-700">
            <li>• <strong>Call 911</strong> (US) or your local emergency number</li>
            <li>• Suspected opioid overdose: give naloxone if you have it, then call for help</li>
            <li>• Go to your nearest emergency room</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
