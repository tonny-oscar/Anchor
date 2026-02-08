import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Track your recovery.<br />One day at a time.</h1>
          <p className="text-xl text-gray-600 mb-8">A supportive, private space to build your path forward</p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Log In</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="card text-center">
            <div className="w-12 h-12 bg-calm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-calm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track sober days</h3>
            <p className="text-gray-600">See your progress grow day by day</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-serenity-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-serenity-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get support during cravings</h3>
            <p className="text-gray-600">Tools to help in tough moments</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-gentle-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gentle-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Understand emotional triggers</h3>
            <p className="text-gray-600">Track patterns and insights</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-calm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-calm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Build healthy habits</h3>
            <p className="text-gray-600">Replace old patterns with new ones</p>
          </div>
        </div>

        <div className="card max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Your journey is private</h2>
          <div className="space-y-2 text-gray-700">
            <p>✓ Anonymous accounts allowed</p>
            <p>✓ No public profiles</p>
            <p>✓ Your data stays yours</p>
          </div>
        </div>

        <footer className="text-center text-gray-600 space-y-4">
          <div className="flex gap-6 justify-center">
            <a href="#" className="hover:text-calm-600">About</a>
            <a href="#" className="hover:text-calm-600">Privacy</a>
            <a href="#" className="hover:text-calm-600">Terms</a>
          </div>
          <p className="text-sm text-red-600">If you are in medical danger, contact local emergency services.</p>
        </footer>
      </div>
    </div>
  );
}
