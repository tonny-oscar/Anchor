import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore`;

function SetupHelp({ error }) {
  const text = `${error?.code || ''} ${error?.message || ''}`;

  if (text.includes('permission-denied') || text.includes('insufficient permissions')) {
    return (
      <div className="text-left">
        <p className="text-gray-700 mb-4">
          You're signed in, but the database refused access to your data.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 bg-gray-50 rounded-2xl p-4 mb-4">
          <li>If the rules were just published, wait a minute and press <strong>Try again</strong>. New rules can take a little while to reach an open page.</li>
          <li>Still stuck? <strong>Log out</strong> and log back in to refresh your session.</li>
          <li>Otherwise, check that <a href={`${consoleUrl}/rules`} target="_blank" rel="noopener noreferrer" className="text-calm-700 font-semibold underline">Firestore → Rules</a> matches <code className="bg-white px-1 rounded">firestore.rules</code> from this project, then publish.</li>
        </ol>
      </div>
    );
  }

  if (text.includes('does not exist') || text.includes('NOT_FOUND') || text.includes('not-found')) {
    return (
      <p className="text-gray-700 mb-4">
        No Firestore database exists yet. Open <a href={consoleUrl} target="_blank" rel="noopener noreferrer" className="text-calm-700 font-semibold underline">Firestore Database</a> in
        the Firebase console, click <strong>Create database</strong>, then publish the rules from <code>firestore.rules</code>.
      </p>
    );
  }

  if (text.includes('unavailable') || text.includes('offline')) {
    return <p className="text-gray-700 mb-4">Firestore could not be reached. Check your internet connection and try again.</p>;
  }

  return <p className="text-gray-700 mb-4">Something went wrong while loading your data.</p>;
}

export default function ProfileGate({ children }) {
  const { profileStatus, profileError } = useAuth();

  const retry = async () => {
    try {
      await auth.currentUser?.getIdToken(true);
    } catch (err) {
      console.warn('Could not refresh session token:', err);
    }
    window.location.reload();
  };

  if (profileStatus === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="card max-w-lg w-full text-center">
          <div className="text-4xl mb-3">🌫️</div>
          <h1 className="text-2xl font-bold mb-4">We couldn't reach your harbor</h1>
          <SetupHelp error={profileError} />
          <p className="text-xs text-gray-400 font-mono break-all mb-6">{profileError?.code || profileError?.message}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={retry} className="btn-primary">Try again</button>
            <button onClick={() => signOut(auth)} className="px-5 py-2 border-2 border-gray-200 rounded-full hover:bg-gray-50">Log out</button>
          </div>
        </div>
      </div>
    );
  }

  if (profileStatus !== 'ready') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-calm-200 border-t-calm-600 animate-spin" />
        <div className="text-gray-600">Raising the anchor...</div>
      </div>
    );
  }

  return children;
}
