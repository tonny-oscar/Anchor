import { useState } from 'react';
import OceanHero from '../components/OceanHero';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage } from '../lib/content';
import { whatsappLink, WHATSAPP_DISPLAY, kenyaHelplines } from '../data/site';

const topics = ['General question', 'I need help', 'Share my story', 'Join or volunteer', 'Partnership', 'Feedback about the app'];

export default function Contact() {
  const { currentUser, profile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.displayName && profile.displayName !== 'Friend' ? profile.displayName : '',
    email: currentUser?.email || '',
    phone: '',
    topic: topics[0],
    message: '',
  });
  const [shareLocation, setShareLocation] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const getLocation = () => new Promise((resolve) => {
    if (!shareLocation || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 10000, maximumAge: 600000 }
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() && !form.phone.trim()) {
      setError('Please leave an email or phone number so we can reply.');
      return;
    }
    setStatus('sending');
    try {
      const location = await getLocation();
      await sendMessage({ ...form, location }, currentUser);
      setStatus('sent');
      setForm({ ...form, message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Your message could not be sent. Please try again, or reach us on WhatsApp.');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/calm-horizon.jpg"
        eyebrow="Contact"
        title="Send a message to shore"
        subtitle="Questions, a story to share, or just need someone to listen? Your message goes privately to the Anchor team."
        size="sm"
      />

      <div className="max-w-5xl mx-auto px-4 -mt-4 relative grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          {status === 'sent' ? (
            <div className="text-center py-10 animate-rise">
              <div className="text-5xl mb-4">🌊</div>
              <h2 className="text-2xl font-bold mb-2">Message received</h2>
              <p className="text-gray-600 mb-6">Thank you for reaching out. Someone from the Anchor team will get back to you soon.</p>
              <button onClick={() => setStatus('idle')} className="btn-secondary">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your name</label>
                  <input required maxLength={100} value={form.name} onChange={update('name')} className="input" placeholder="A nickname is fine" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <select value={form.topic} onChange={update('topic')} className="input">
                    {topics.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" maxLength={200} value={form.email} onChange={update('email')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone / WhatsApp (optional)</label>
                  <input type="tel" maxLength={30} value={form.phone} onChange={update('phone')} className="input" placeholder="07..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea required maxLength={5000} rows={6} value={form.message} onChange={update('message')} className="input" placeholder="Write as much or as little as you like." />
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={shareLocation} onChange={e => setShareLocation(e.target.checked)} className="mt-1 accent-calm-600" />
                Share my approximate location so the team can suggest help near me
              </label>
              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full sm:w-auto">
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>
              <p className="text-xs text-gray-500">Only the Anchor team can read your message. If you're in danger right now, call 999 or 1192.</p>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <a href={whatsappLink('Hi Anchor team, I have a question.')} target="_blank" rel="noopener noreferrer" className="card block hover:shadow-xl transition bg-[#25D366]/10 border-[#25D366]/40">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold">Chat on WhatsApp</h3>
            <p className="text-sm text-gray-600">{WHATSAPP_DISPLAY}</p>
          </a>
          <div className="card">
            <h3 className="font-semibold mb-3">Urgent help</h3>
            <div className="space-y-2 text-sm">
              {kenyaHelplines.map(h => (
                <a key={h.number} href={`tel:${h.number}`} className="block p-3 rounded-xl bg-red-50 hover:bg-red-100 transition">
                  <strong>{h.number}</strong> · {h.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
