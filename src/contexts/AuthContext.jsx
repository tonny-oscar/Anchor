import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { ensureUserProfile } from '../lib/userData';
import { checkIsAdmin } from '../lib/content';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileState, setProfileState] = useState({ uid: null, profile: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const [adminState, setAdminState] = useState({ uid: null, isAdmin: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    let unsubscribe = () => {};
    let cancelled = false;

    ensureUserProfile(currentUser)
      .catch(error => console.error('Error creating profile:', error))
      .finally(() => {
        if (cancelled) return;
        unsubscribe = onSnapshot(
          doc(db, 'users', uid),
          (snap) => setProfileState({ uid, profile: snap.exists() ? snap.data() : null, error: null }),
          (error) => {
            console.error('Error loading profile:', error);
            setProfileState({ uid, profile: null, error });
          }
        );
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, attempt]);

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    let cancelled = false;
    checkIsAdmin(uid)
      .then(isAdmin => !cancelled && setAdminState({ uid, isAdmin }))
      .catch(() => !cancelled && setAdminState({ uid, isAdmin: false }));
    return () => { cancelled = true; };
  }, [currentUser, attempt]);

  const retryProfile = () => {
    setProfileState({ uid: null, profile: null, error: null });
    setAttempt(a => a + 1);
  };

  const isCurrent = currentUser && profileState.uid === currentUser.uid;
  const profileStatus = !currentUser ? 'idle' : !isCurrent ? 'loading' : profileState.error ? 'error' : 'ready';

  const value = {
    currentUser,
    profile: isCurrent ? profileState.profile : null,
    profileStatus,
    profileError: isCurrent ? profileState.error : null,
    retryProfile,
    isAdmin: !!currentUser && adminState.uid === currentUser.uid && adminState.isAdmin,
    adminChecked: !!currentUser && adminState.uid === currentUser.uid,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
