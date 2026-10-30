import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import AuthLayout, { GoogleButton, Divider } from '../components/AuthLayout';
import { saveProfile } from '../lib/userData';
import { authErrorMessage } from '../lib/authErrors';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '', anonymous: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    let user;
    try {
      ({ user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password));
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(false);
      return;
    }

    const displayName = formData.displayName.trim() || 'Friend';
    if (formData.displayName.trim()) {
      updateProfile(user, { displayName }).catch(err => console.warn('Could not set auth display name:', err));
    }
    saveProfile(user.uid, { displayName, anonymous: formData.anonymous })
      .catch(err => console.warn('Profile will be created on first load instead:', err));

    setSuccess('Anchor dropped! Taking you to your harbor...');
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess('Signed in! Taking you to your harbor...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthLayout image="/ocean/bright-shore.jpg" quote="“The first step onto the shore is the bravest one.”">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Start your journey</h1>
        <p className="text-center text-gray-600 mb-8">Deciding to begin is already day one.</p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-calm-50 border border-calm-200 rounded-xl text-calm-800 text-sm">{success}</div>}

        <GoogleButton onClick={handleGoogleSignup} disabled={loading} />
        <Divider label="Or sign up with email" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" required className="input"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" required className="input"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display name (optional)</label>
            <input type="text" className="input" placeholder="A nickname is fine"
              value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="anonymous" className="w-4 h-4 accent-calm-600 rounded"
              checked={formData.anonymous} onChange={(e) => setFormData({...formData, anonymous: e.target.checked})} />
            <label htmlFor="anonymous" className="ml-2 text-sm">I want to stay anonymous</label>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-calm-700 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
