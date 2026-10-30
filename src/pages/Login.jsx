import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import AuthLayout, { GoogleButton, Divider } from '../components/AuthLayout';
import { authErrorMessage } from '../lib/authErrors';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setInfo('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');
    if (!formData.email) {
      setError('Enter your email address above, then tap "Forgot password?" again.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setInfo(`If an account exists for ${formData.email}, a reset link is on its way. Check your inbox and spam folder.`);
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  return (
    <AuthLayout image="/ocean/dawn-beach.jpg" quote="“Every sunrise over the water is a fresh chart.”">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-center text-gray-600 mb-8">Good to see you on the water again.</p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
        {info && <div className="mb-4 p-3 bg-calm-50 border border-calm-200 rounded-xl text-calm-800 text-sm">{info}</div>}

        <GoogleButton onClick={handleGoogleLogin} disabled={loading} />
        <Divider label="Or log in with email" />

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
          <button type="button" onClick={handleForgotPassword} className="inline-block text-sm text-calm-700 hover:underline">Forgot password?</button>
          <button type="submit" disabled={loading} className="btn-secondary w-full">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          New here? <Link to="/signup" className="text-calm-700 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
