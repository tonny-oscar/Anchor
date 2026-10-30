import { Link } from 'react-router-dom';
import OceanHero from '../components/OceanHero';
import { whatsappLink, WHATSAPP_DISPLAY } from '../data/site';

const perks = [
  { icon: '🌅', title: 'Daily check-ins', text: 'Start the day with others who are anchoring too. Share how you are, no pressure.' },
  { icon: '🏆', title: 'Celebrate wins', text: 'Every sober day, every craving ridden out, every honest conversation is worth cheering.' },
  { icon: '🙋', title: 'Ask anything', text: 'Questions about withdrawal, treatment, family or relapse, answered by people who have been there.' },
  { icon: '📣', title: 'Updates and events', text: 'New blog posts, recovery resources and community meet-ups shared first.' },
];

const guidelines = [
  'Respect everyone. We are all on different parts of the journey.',
  'What is shared in the community stays in the community.',
  'Use a nickname if you prefer to stay anonymous.',
  'No selling, promotion or sharing where to get substances.',
  'Don\'t glorify using. Talk about struggles honestly, but keep it safe for others.',
  'In a crisis, call 1192 (NACADA) or 999. The community is support, not an emergency service.',
];

function WhatsAppIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 01-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 01-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 016.67 2.77 9.37 9.37 0 012.76 6.67c0 5.2-4.24 9.42-9.44 9.42zm8.03-17.46A11.29 11.29 0 0012.05.71C5.79.71.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.29l5.69-1.49a11.33 11.33 0 005.76 1.47h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02z" />
    </svg>
  );
}

export default function Community() {
  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/sunset-waves.jpg"
        eyebrow="The Anchor community"
        title="Ride the waves together"
        subtitle="Recovery is lighter when it is shared. Join people on the same journey in our WhatsApp community."
        size="sm"
      >
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold shadow-lg transition">
          <WhatsAppIcon /> Join on WhatsApp
        </a>
      </OceanHero>

      <div className="max-w-5xl mx-auto px-4 -mt-4 relative space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map(p => (
            <div key={p.title} className="card">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <p className="eyebrow mb-2">How to join</p>
              <h2 className="text-2xl font-bold mb-4">Three taps to your crew</h2>
              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="w-7 h-7 rounded-full bg-calm-100 text-calm-800 font-bold flex items-center justify-center flex-shrink-0">1</span>Tap <strong>Join on WhatsApp</strong>. It opens a chat with the Anchor team.</li>
                <li className="flex gap-3"><span className="w-7 h-7 rounded-full bg-calm-100 text-calm-800 font-bold flex items-center justify-center flex-shrink-0">2</span>Send the pre-filled message. A nickname is fine.</li>
                <li className="flex gap-3"><span className="w-7 h-7 rounded-full bg-calm-100 text-calm-800 font-bold flex items-center justify-center flex-shrink-0">3</span>We'll add you to the community channel and groups.</li>
              </ol>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold transition">
                  <WhatsAppIcon className="w-5 h-5" /> Join now
                </a>
                <span className="text-sm text-gray-600">or save <strong>{WHATSAPP_DISPLAY}</strong></span>
              </div>
            </div>
            <div className="relative min-h-56">
              <img src="/ocean/islands.jpg" alt="Islands connected by shallow turquoise water" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Community guidelines</h2>
          <ul className="space-y-3">
            {guidelines.map(g => (
              <li key={g} className="flex gap-3 text-gray-700">
                <span className="text-calm-500">⚓</span>{g}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/blog" className="card hover:shadow-xl transition bg-gentle-50 border-gentle-200">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="text-lg font-semibold mb-1">Read stories from the shore</h3>
            <p className="text-sm text-gray-600">Articles, tips and recovery stories on the Anchor blog.</p>
          </Link>
          <Link to="/contact" className="card hover:shadow-xl transition bg-serenity-50 border-serenity-200">
            <div className="text-3xl mb-2">✉️</div>
            <h3 className="text-lg font-semibold mb-1">Prefer to talk privately?</h3>
            <p className="text-sm text-gray-600">Send the Anchor team a confidential message.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
