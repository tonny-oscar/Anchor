import { Link } from 'react-router-dom';
import AnchorLogo from '../components/AnchorLogo';
import { Waves } from '../components/OceanHero';
import { PostCard } from './Blog';
import { samplePosts } from '../data/samplePosts';
import { whatsappLink } from '../data/site';

const latestPosts = samplePosts.slice(0, 3).map(p => ({ ...p, date: new Date(p.date) }));

const features = [
  { icon: '⚓', title: 'Count your anchored days', text: 'Track each substance separately and watch your streaks grow, day by day.' },
  { icon: '🌊', title: 'Ride out cravings', text: 'A wave timer, guided breathing and urge-surfing tools for the hardest minutes.' },
  { icon: '🧭', title: 'Spot your triggers', text: 'Daily mood check-ins and the HALT check show patterns you can plan around.' },
  { icon: '🐚', title: 'Build new rituals', text: 'Replace old routines with healthy habits that fill the space, not just leave it empty.' },
  { icon: '🏝️', title: 'Never be an island', text: 'Add an accountability partner and keep 24/7 helplines one tap away.' },
  { icon: '📖', title: 'Learn how recovery works', text: 'Plain-language guides on cravings, withdrawal, the brain and staying safe.' },
];

const facts = [
  { stat: '15–30 min', text: 'How long most cravings last before they peak and fade, like a wave.' },
  { stat: '22 million+', text: 'American adults living in recovery from a substance use problem today.' },
  { stat: '40–60%', text: 'Relapse rate for addiction, similar to asthma or high blood pressure. A slip means adjusting the plan, not failing.' },
];

const steps = [
  { title: 'Drop anchor', text: 'Choose what you want to step away from. Your day count starts today, privately.' },
  { title: 'Weather the storms', text: 'When a craving rises, open Ride the Wave: breathe, wait out the timer, reach out.' },
  { title: 'Watch the tide turn', text: 'Check in daily, earn milestones and see how far from the rocks you have sailed.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-abyss-900 text-white">
        <img src="/ocean/sunset-waves.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss-950/70 via-abyss-900/40 to-abyss-950/80" />

        <div className="relative flex-1 flex items-center pt-16">
          <div className="max-w-6xl mx-auto px-4 pb-24 text-center animate-rise">
            <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-calm-200 mb-5">Recovery support, one tide at a time</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Cravings are waves.<br />
              <span className="text-calm-200">You are the anchor.</span>
            </h1>
            <p className="text-lg md:text-xl text-abyss-100 max-w-2xl mx-auto mb-10">
              A calm, private space to track your recovery from alcohol, drugs or nicotine, ride out urges when they come and find your way back to steady water.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8">Start your journey</Link>
              <a href="#why-anchor" className="btn-ghost text-lg px-8">How it works</a>
            </div>
          </div>
        </div>
        <Waves />
      </section>

      <section id="why-anchor" className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow mb-3">Why an anchor?</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">You can't stop the waves. You can learn to hold steady.</h2>
          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              An anchor doesn't fight the ocean. It holds a ship in place while the water moves around it. Recovery works the same way.
              Cravings, stress and hard memories will rise and fall, and you don't have to be swept along with them.
            </p>
            <p>
              Anchor gives you something to hold onto in those moments: your reasons, your progress, your people and tools that work in minutes.
            </p>
          </div>
        </div>
        <div className="relative">
          <img src="/ocean/single-wave.jpg" alt="A single wave rising and breaking in soft evening light" className="rounded-3xl shadow-2xl w-full h-[420px] object-cover" />
          <div className="absolute -bottom-6 -left-4 md:-left-8 card max-w-xs">
            <p className="quote text-abyss-800">"Every wave, no matter how big, eventually reaches the shore and settles."</p>
          </div>
        </div>
      </section>

      <section className="bg-abyss-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-calm-300 mb-3 text-center">Recovery is real</p>
          <h2 className="text-3xl font-bold text-center text-white mb-12">What the research tells us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {facts.map(f => (
              <div key={f.stat} className="text-center p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="text-4xl font-bold text-calm-300 mb-3">{f.stat}</div>
                <p className="text-abyss-100">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-abyss-300 text-center mt-8">Sources: National Institute on Drug Abuse (NIDA); Kelly et al., 2017, Recovery Research Institute.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Everything in one harbor</p>
          <h2 className="text-3xl md:text-4xl font-bold">Tools for calm and stormy days</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="card hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-calm-50 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gentle-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold">Three steps out of the storm</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="w-12 h-12 rounded-full bg-abyss-800 text-white font-bold text-lg flex items-center justify-center mb-4">{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-abyss-900">
          <img src="/ocean/surfer.jpg" alt="A surfer riding inside a turquoise wave" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-abyss-950/90 via-abyss-900/60 to-transparent" />
          <div className="relative p-8 md:p-14 max-w-xl text-white">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-calm-200 mb-3">Urge surfing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don't fight the wave. Ride it.</h2>
            <p className="text-abyss-100 mb-6">
              Urge surfing is a mindfulness technique from relapse-prevention research. Instead of wrestling a craving, you notice it,
              breathe with it and watch it rise, crest and fall on its own. Anchor walks you through it, step by step.
            </p>
            <Link to="/signup" className="btn-primary">Try it free</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <p className="eyebrow mb-2">From the blog</p>
            <h2 className="text-3xl font-bold">Stories and lessons from the shore</h2>
          </div>
          <Link to="/blog" className="text-calm-700 font-semibold hover:underline">All posts →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-abyss-900 text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="text-5xl">💬</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">You don't have to sail alone</h2>
            <p className="text-abyss-100">Join the Anchor community on WhatsApp for daily check-ins, encouragement and people who understand.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] font-semibold transition">Join on WhatsApp</a>
            <Link to="/find-help" className="btn-ghost">Find help near me</Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <img src="/ocean/calm-horizon.jpg" alt="Calm open sea under a pale blue sky" className="rounded-3xl w-full h-48 object-cover mb-10" />
        <p className="eyebrow mb-3">Your journey is private</p>
        <h2 className="text-3xl font-bold mb-6">A quiet harbor, just for you</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-gray-700">
          <div className="card py-5">🕶️<p className="mt-2 font-medium">Anonymous accounts allowed</p></div>
          <div className="card py-5">🔒<p className="mt-2 font-medium">No public profiles</p></div>
          <div className="card py-5">🗝️<p className="mt-2 font-medium">Your data stays yours</p></div>
        </div>
      </section>

      <footer className="bg-abyss-950 text-abyss-200 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <AnchorLogo className="w-6 h-6 text-calm-300" /> Anchor
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/guide" className="hover:text-white">Guide</Link>
            <Link to="/community" className="hover:text-white">Community</Link>
            <Link to="/find-help" className="hover:text-white">Find help</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
          <p className="text-sm text-red-300 text-center md:text-right">
            In danger right now? Call 999 or 112.<br />
            NACADA helpline: 1192 (free, Kenya).
          </p>
        </div>
      </footer>
    </div>
  );
}
