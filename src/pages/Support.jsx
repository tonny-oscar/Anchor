export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Support & Resources</h1>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Talk to Someone</h2>
          <p className="text-gray-700 mb-4">Add an accountability partner who can support your journey</p>
          <div className="flex gap-3">
            <input type="email" placeholder="Partner's email" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            <button className="btn-primary">Add Partner</button>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">24/7 Support Lines</h2>
          <div className="space-y-3">
            <a href="tel:988" className="block p-4 bg-serenity-50 rounded-xl hover:bg-serenity-100 transition">
              <h3 className="font-semibold mb-1">988 - Suicide & Crisis Lifeline</h3>
              <p className="text-sm text-gray-600">24/7 free and confidential support</p>
            </a>
            <a href="tel:18006624357" className="block p-4 bg-serenity-50 rounded-xl hover:bg-serenity-100 transition">
              <h3 className="font-semibold mb-1">1-800-662-4357 - SAMHSA National Helpline</h3>
              <p className="text-sm text-gray-600">Treatment referral and information service</p>
            </a>
            <a href="tel:18007997233" className="block p-4 bg-serenity-50 rounded-xl hover:bg-serenity-100 transition">
              <h3 className="font-semibold mb-1">1-800-799-7233 - National Domestic Violence Hotline</h3>
              <p className="text-sm text-gray-600">Support for those in unsafe situations</p>
            </a>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Find Support Groups</h2>
          <div className="space-y-3">
            <div className="p-4 bg-calm-50 rounded-xl">
              <h3 className="font-semibold mb-1">Alcoholics Anonymous (AA)</h3>
              <p className="text-sm text-gray-600 mb-2">12-step program for alcohol recovery</p>
              <a href="https://www.aa.org" target="_blank" rel="noopener noreferrer" className="text-calm-600 hover:underline text-sm">aa.org →</a>
            </div>
            <div className="p-4 bg-calm-50 rounded-xl">
              <h3 className="font-semibold mb-1">Narcotics Anonymous (NA)</h3>
              <p className="text-sm text-gray-600 mb-2">12-step program for drug recovery</p>
              <a href="https://www.na.org" target="_blank" rel="noopener noreferrer" className="text-calm-600 hover:underline text-sm">na.org →</a>
            </div>
            <div className="p-4 bg-calm-50 rounded-xl">
              <h3 className="font-semibold mb-1">SMART Recovery</h3>
              <p className="text-sm text-gray-600 mb-2">Science-based addiction recovery support</p>
              <a href="https://www.smartrecovery.org" target="_blank" rel="noopener noreferrer" className="text-calm-600 hover:underline text-sm">smartrecovery.org →</a>
            </div>
            <div className="p-4 bg-calm-50 rounded-xl">
              <h3 className="font-semibold mb-1">Refuge Recovery</h3>
              <p className="text-sm text-gray-600 mb-2">Buddhist-inspired recovery program</p>
              <a href="https://www.refugerecovery.org" target="_blank" rel="noopener noreferrer" className="text-calm-600 hover:underline text-sm">refugerecovery.org →</a>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Recovery Education</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gentle-50 rounded-xl">
              <h3 className="font-semibold mb-2">Understanding Withdrawal</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Physical symptoms</strong> typically peak within 3-7 days</li>
                <li>• <strong>Psychological symptoms</strong> can last weeks to months</li>
                <li>• <strong>Post-Acute Withdrawal Syndrome (PAWS)</strong> may occur for 6-24 months</li>
                <li>• Symptoms are temporary and will improve with time</li>
              </ul>
            </div>
            <div className="p-4 bg-gentle-50 rounded-xl">
              <h3 className="font-semibold mb-2">Brain Recovery Timeline</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Week 1:</strong> Dopamine production begins normalizing</li>
                <li>• <strong>Month 1:</strong> Brain fog starts clearing</li>
                <li>• <strong>Month 3:</strong> Significant improvement in cognitive function</li>
                <li>• <strong>Month 6:</strong> Emotional regulation stabilizes</li>
                <li>• <strong>Year 1:</strong> Brain structure shows measurable recovery</li>
              </ul>
            </div>
            <div className="p-4 bg-gentle-50 rounded-xl">
              <h3 className="font-semibold mb-2">Common Triggers & How to Handle Them</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Stress:</strong> Practice mindfulness, exercise, talk to someone</li>
                <li>• <strong>Social pressure:</strong> Have an exit plan, bring a sober friend</li>
                <li>• <strong>Boredom:</strong> Develop new hobbies, join groups, volunteer</li>
                <li>• <strong>Emotions:</strong> Journal, therapy, healthy coping mechanisms</li>
                <li>• <strong>Places/people:</strong> Avoid early in recovery, build new routines</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Medication-Assisted Treatment (MAT)</h2>
          <p className="text-gray-700 mb-3">FDA-approved medications can help manage withdrawal and cravings:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Alcohol:</strong> Naltrexone, Acamprosate, Disulfiram</li>
            <li>• <strong>Opioids:</strong> Methadone, Buprenorphine, Naltrexone</li>
            <li>• <strong>Nicotine:</strong> Nicotine replacement, Bupropion, Varenicline</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3 italic">Consult with a healthcare provider to discuss options</p>
        </div>

        <div className="card bg-red-50 border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-800">Crisis Resources</h2>
          <p className="text-gray-700 mb-3">If you're in immediate danger or experiencing a medical emergency:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Call 911</strong> (US) or your local emergency number</li>
            <li>• <strong>988</strong> - National Suicide Prevention Lifeline</li>
            <li>• <strong>1-800-662-4357</strong> - SAMHSA National Helpline</li>
            <li>• Go to your nearest emergency room</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
