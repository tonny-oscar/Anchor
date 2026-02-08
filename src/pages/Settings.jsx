import { useState } from 'react';

export default function Settings() {
  const [anonymous, setAnonymous] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input type="text" defaultValue="Friend" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" defaultValue="user@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Anonymous Mode</p>
                <p className="text-sm text-gray-600">Hide your identity in shared features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calm-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <button className="w-full py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition text-left px-4">
            Change Password
          </button>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <p className="text-gray-700 mb-3">Your recovery data is private and encrypted. We never share your information without your explicit consent.</p>
          <a href="#" className="text-calm-600 hover:underline">Read our Privacy Policy →</a>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Export</h2>
          <button className="btn-secondary">Download My Data</button>
        </div>

        <div className="card border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Danger Zone</h2>
          <p className="text-gray-700 mb-4">Deleting your account is permanent and cannot be undone.</p>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
