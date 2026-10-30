import { useState } from 'react';
import { Link } from 'react-router-dom';
import OceanHero from '../components/OceanHero';

const sections = [
  { id: 'addiction', label: 'What addiction is' },
  { id: 'myths', label: 'Myths vs facts' },
  { id: 'stages', label: 'Stages of change' },
  { id: 'brain', label: 'Your brain heals' },
  { id: 'withdrawal', label: 'Withdrawal' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'safety', label: 'Stay safe' },
  { id: 'medication', label: 'Medication' },
  { id: 'relapse', label: 'Slips & relapse' },
  { id: 'families', label: 'For loved ones' },
];

const myths = [
  {
    myth: 'Addiction is a choice. People just need more willpower.',
    fact: 'Repeated use changes the brain circuits for reward, stress and self-control. Addiction is a treatable medical condition, not a moral failing.',
  },
  {
    myth: 'You have to hit rock bottom before you can get better.',
    fact: 'Earlier help generally works better. You can turn the boat around at any point; you do not need to wait for the rocks.',
  },
  {
    myth: 'If you relapse, treatment has failed.',
    fact: 'Relapse rates for addiction (40–60%) are similar to asthma and high blood pressure. A relapse means the plan needs adjusting, not that recovery is impossible.',
  },
  {
    myth: 'Medication for addiction is just swapping one drug for another.',
    fact: 'Medications like buprenorphine, methadone and naltrexone are evidence-based treatments. They reduce cravings and overdose deaths and help people rebuild their lives.',
  },
  {
    myth: 'Treatment only works if the person really wants it.',
    fact: 'Research shows treatment does not need to be voluntary to work. Many people find their motivation once they are already on the way.',
  },
  {
    myth: 'Once an addict, always an addict. Recovery is rare.',
    fact: 'Most people with a substance use problem eventually recover. Over 22 million American adults are living in recovery today.',
  },
];

const stages = [
  { name: 'Precontemplation', sea: 'Lost in the fog', text: 'Not yet seeing the problem, or not ready to look at it.' },
  { name: 'Contemplation', sea: 'Spotting the coast', text: 'Aware that something needs to change, but feeling torn.' },
  { name: 'Preparation', sea: 'Packing the boat', text: 'Making a plan, telling someone, setting a date.' },
  { name: 'Action', sea: 'Setting sail', text: 'Actively changing behaviour. Often the hardest, most tiring stage.' },
  { name: 'Maintenance', sea: 'Holding course', text: 'Protecting your progress and building a life you don\'t want to escape from.' },
];

function MythCard({ myth, fact }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`flex flex-col items-start text-left p-5 rounded-2xl border-2 transition min-h-40 ${flipped ? 'bg-calm-50 border-calm-300' : 'bg-white border-gray-200 hover:border-gentle-300'}`}
    >
      <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${flipped ? 'text-calm-700' : 'text-gentle-700'}`}>
        {flipped ? 'Fact' : 'Myth'}
      </p>
      <p className={flipped ? 'text-gray-800' : 'text-gray-800 font-semibold'}>{flipped ? fact : myth}</p>
      {!flipped && <p className="text-xs text-gray-500 mt-3">Tap to see the truth →</p>}
    </button>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="card scroll-mt-24">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function Learn() {
  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/aerial-shore.jpg"
        eyebrow="The logbook"
        title="Understand the water you're sailing"
        subtitle="Knowing how cravings, withdrawal and recovery work takes away some of their power. Here's the science, in plain language."
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 -mt-4 relative">
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 hover:border-calm-400 hover:text-calm-700 transition">
              {s.label}
            </a>
          ))}
        </div>

        <div className="space-y-6">
          <Section id="addiction" eyebrow="The basics" title="What addiction really is">
            <div className="space-y-3 text-gray-700">
              <p>
                Your brain has a reward system built to make you repeat things that keep you alive, like eating and connecting with people.
                Alcohol, drugs, nicotine and even gambling flood that system with far more dopamine than natural rewards do.
              </p>
              <p>
                Over time the brain adapts. Everyday pleasures start to feel flat, stress feels heavier, and the part of the brain that says
                <em> "wait, think about this"</em> gets quieter. That's why quitting is hard, and why it has nothing to do with being weak.
              </p>
              <p className="p-4 bg-serenity-50 rounded-xl">
                🌊 <strong>The good news:</strong> the brain is plastic. The same ability to adapt that created the habit is what lets it heal.
              </p>
              <p className="quote text-lg text-abyss-800 border-l-4 border-calm-400 pl-4">
                "The opposite of addiction is not sobriety. It is connection."
                <span className="block not-italic text-sm text-gray-500 mt-1 font-sans">Johann Hari</span>
              </p>
            </div>
          </Section>

          <Section id="myths" eyebrow="Clear the fog" title="Myths vs facts">
            <div className="grid sm:grid-cols-2 gap-4">
              {myths.map(m => <MythCard key={m.myth} {...m} />)}
            </div>
            <p className="text-xs text-gray-500 mt-4">Sources: NIDA, <em>Drugs, Brains, and Behavior</em> and <em>Principles of Drug Addiction Treatment</em>; Kelly et al., 2017.</p>
          </Section>

          <Section id="stages" eyebrow="Where are you on the map?" title="The stages of change">
            <p className="text-gray-700 mb-5">Psychologists describe change as a journey through stages. Most people move back and forth before reaching steady water, and that's normal.</p>
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-gray-300 via-calm-300 to-calm-600" />
              <div className="space-y-4">
                {stages.map((s, i) => (
                  <div key={s.name} className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-calm-500 flex items-center justify-center font-bold text-calm-700 flex-shrink-0 z-10">{i + 1}</div>
                    <div className="pt-1">
                      <p className="font-semibold">{s.sea} <span className="text-sm font-normal text-gray-500">· {s.name}</span></p>
                      <p className="text-sm text-gray-600">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="brain" eyebrow="Healing below the surface" title="Your brain recovers">
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="font-bold text-calm-700 w-24 flex-shrink-0">Week 1</span>The body clears the substance; sleep and appetite are often rough.</li>
              <li className="flex gap-3"><span className="font-bold text-calm-700 w-24 flex-shrink-0">Month 1</span>Brain fog starts to lift. Moods are still up and down.</li>
              <li className="flex gap-3"><span className="font-bold text-calm-700 w-24 flex-shrink-0">Month 3</span>Focus, memory and decision-making noticeably improve.</li>
              <li className="flex gap-3"><span className="font-bold text-calm-700 w-24 flex-shrink-0">Month 6</span>Emotions feel more stable; natural rewards feel good again.</li>
              <li className="flex gap-3"><span className="font-bold text-calm-700 w-24 flex-shrink-0">Year 1+</span>Brain imaging shows measurable recovery of the dopamine system.</li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">Timelines vary by person and substance. Think of these as a rough tide chart, not a deadline.</p>
          </Section>

          <Section id="withdrawal" eyebrow="Rough water" title="Withdrawal and PAWS">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gentle-50 rounded-2xl">
                <h3 className="font-semibold mb-1">Acute withdrawal</h3>
                <p className="text-sm text-gray-700">Physical symptoms usually peak within 3–7 days, then ease.</p>
              </div>
              <div className="p-4 bg-gentle-50 rounded-2xl">
                <h3 className="font-semibold mb-1">Emotional aftershocks</h3>
                <p className="text-sm text-gray-700">Anxiety, low mood and poor sleep can linger for weeks.</p>
              </div>
              <div className="p-4 bg-gentle-50 rounded-2xl">
                <h3 className="font-semibold mb-1">PAWS</h3>
                <p className="text-sm text-gray-700">Post-acute withdrawal can come in waves for months. It's a sign of healing, and it fades.</p>
              </div>
            </div>
          </Section>

          <Section id="triggers" eyebrow="Know the reefs" title="Common triggers and how to steer around them">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                ['Stress', 'Breathing exercises, a walk, talking it out'],
                ['Social pressure', 'Have an exit line ready, bring a sober friend'],
                ['Boredom', 'New hobbies, volunteering, a meeting'],
                ['Big emotions', 'Journal, therapy, the HALT check'],
                ['People & places', 'Avoid early on; build new routines'],
                ['Celebrations', 'Plan your drink in hand and your leave time'],
              ].map(([t, d]) => (
                <div key={t} className="p-4 bg-serenity-50 rounded-xl">
                  <p className="font-semibold text-abyss-800">{t}</p>
                  <p className="text-gray-700">{d}</p>
                </div>
              ))}
            </div>
            <Link to="/craving" className="inline-block mt-4 text-calm-700 font-medium hover:underline">Practice with Ride the Wave →</Link>
          </Section>

          <Section id="safety" eyebrow="Life jackets" title="Stay safe">
            <ul className="space-y-3 text-gray-700">
              <li className="p-4 rounded-xl bg-red-50 border-l-4 border-red-400">
                <strong>Alcohol and benzodiazepines:</strong> if you've used heavily every day, stopping suddenly can cause seizures. Get medical help to detox safely.
              </li>
              <li className="p-4 rounded-xl bg-red-50 border-l-4 border-red-400">
                <strong>Lower tolerance after a break:</strong> using your old amount after days or weeks off is one of the biggest overdose risks, especially with opioids.
              </li>
              <li className="p-4 rounded-xl bg-gentle-50 border-l-4 border-gentle-400">
                <strong>Naloxone (Narcan)</strong> reverses opioid overdoses. In the US it's available without a prescription. Keep it nearby and tell people where it is.
              </li>
              <li className="p-4 rounded-xl bg-gentle-50 border-l-4 border-gentle-400">
                <strong>Don't use alone, and don't mix.</strong> Combining opioids, alcohol and benzos greatly increases the risk of stopping breathing.
              </li>
            </ul>
          </Section>

          <Section id="medication" eyebrow="Extra ballast" title="Medication-assisted treatment">
            <p className="text-gray-700 mb-4">Approved medications can steady the ship by easing withdrawal and quieting cravings:</p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="p-4 bg-calm-50 rounded-xl"><p className="font-semibold mb-1">Alcohol</p><p className="text-gray-700">Naltrexone, acamprosate, disulfiram</p></div>
              <div className="p-4 bg-calm-50 rounded-xl"><p className="font-semibold mb-1">Opioids</p><p className="text-gray-700">Buprenorphine, methadone, naltrexone</p></div>
              <div className="p-4 bg-calm-50 rounded-xl"><p className="font-semibold mb-1">Nicotine</p><p className="text-gray-700">Patches/gum, varenicline, bupropion</p></div>
            </div>
            <p className="text-sm text-gray-500 mt-3 italic">Talk to a healthcare provider about what fits you.</p>
          </Section>

          <Section id="relapse" eyebrow="If you drift" title="Slips and relapse">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-gray-700">
                <p>A slip doesn't erase your progress. Every anchored day still happened, and your brain still did that healing.</p>
                <p className="font-semibold text-abyss-800">If you slip, try this:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Get to safety first. Don't use alone.</li>
                  <li>Tell one person within 24 hours.</li>
                  <li>Be curious, not cruel: what was the trigger?</li>
                  <li>Adjust the plan and drop anchor again today.</li>
                </ol>
              </div>
              <img src="/ocean/calm-horizon.jpg" alt="Still, open water stretching to the horizon" className="rounded-2xl h-56 w-full object-cover" />
            </div>
          </Section>

          <Section id="families" eyebrow="For the people on shore" title="If you love someone who is struggling">
            <ul className="space-y-2 text-gray-700">
              <li>💬 <strong>Lead with curiosity, not judgment.</strong> "I've noticed... how are you really?" opens more doors than ultimatums.</li>
              <li>🧭 <strong>Set clear, kind boundaries.</strong> You can love someone and still refuse to fund or cover for their use.</li>
              <li>📚 <strong>Look into CRAFT</strong> (Community Reinforcement and Family Training), an evidence-based approach that helps families encourage a loved one into treatment.</li>
              <li>🛟 <strong>Get your own support.</strong> Groups like Al-Anon and Nar-Anon are just for families and friends.</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
