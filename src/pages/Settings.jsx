import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile, exportUserData, deleteUserData } from '../lib/userData';
import { authErrorMessage } from '../lib/authErrors';

export default function Settings() {
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.displayName || currentUser.displayName || '');
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const usesPassword = currentUser.providerData.some(p => p.providerId === 'password');

  const flash = (text, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveName = async () => {
    const name = displayName.trim() || 'Friend';
    try {
      await Promise.all([updateProfile(currentUser, { displayName: name }), saveProfile(currentUser.uid, { displayName: name })]);
      flash('Profile saved.');
    } catch (err) {
      flash(authErrorMessage(err), false);
    }
  };

  const toggleAnonymous = (value) => {
    saveProfile(currentUser.uid, { anonymous: value }).catch(err => flash(authErrorMessage(err), false));
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      flash(`A password reset link was sent to ${currentUser.email}.`);
    } catch (err) {
      flash(authErrorMessage(err), false);
    }
  };

  const downloadData = async () => {
    setBusy(true);
    try {
      const data = await exportUserData(currentUser.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anchor-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      flash('Could not export your data. Please try again.', false);
      console.error('Export failed:', err);
    }
    setBusy(false);
  };

  const deleteAccount = async () => {
    const signedInAgo = Date.now() - new Date(currentUser.metadata.lastSignInTime).getTime();
    if (signedInAgo > 4 * 60 * 1000) {
      flash('For your security, please log out and log back in, then delete your account within a few minutes.', false);
      return;
    }
    setBusy(true);
    try {
      await deleteUserData(currentUser.uid);
      await deleteUser(currentUser);
      navigate('/');
    } catch (err) {
      flash(authErrorMessage(err), false);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen py-10 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <p className="eyebrow mb-2">Ship's log</p>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-3 rounded-xl text-sm border ${message.ok ? 'bg-calm-50 border-calm-200 text-calm-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display name</label>
              <div className="flex gap-3">
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input" />
                <button onClick={saveName} className="btn-primary">Save</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={currentUser.email || ''} readOnly className="input bg-gray-50 text-gray-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-medium">Anonymous mode</p>
                <p className="text-sm text-gray-600">Hide your identity in shared features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={!!profile?.anonymous} onChange={(e) => toggleAnonymous(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calm-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          {usesPassword ? (
            <button onClick={resetPassword} className="w-full py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition text-left px-4">
              Send me a password reset email
            </button>
          ) : (
            <p className="text-gray-600">You sign in with Google, so your password is managed by your Google account.</p>
          )}
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <p className="text-gray-700">Your recovery data is stored in your own private space. Only you can read or change it, and we never share it.</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-2">Data export</h2>
          <p className="text-gray-600 mb-4">Download everything: your profile, trackers, habits, check-ins and logged cravings.</p>
          <button onClick={downloadData} disabled={busy} className="btn-secondary">{busy ? 'Preparing...' : 'Download my data'}</button>
        </div>

        <div className="card border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Danger zone</h2>
          <p className="text-gray-700 mb-4">Deleting your account permanently erases all your data. Type <strong>DELETE</strong> to confirm.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" className="input sm:max-w-40" />
            <button
              onClick={deleteAccount}
              disabled={confirmText !== 'DELETE' || busy}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
