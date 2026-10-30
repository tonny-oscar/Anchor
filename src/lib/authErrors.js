const messages = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/invalid-email': 'That email address doesn\'t look right.',
  'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
  'auth/weak-password': 'Please choose a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/popup-closed-by-user': 'The Google window was closed before signing in.',
  'auth/cancelled-popup-request': 'The Google window was closed before signing in.',
  'auth/popup-blocked': 'Your browser blocked the Google pop-up. Allow pop-ups for this site and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled yet. Enable it in Firebase console > Authentication > Sign-in method.',
  'auth/configuration-not-found': 'Firebase Authentication is not set up for this project. Open Firebase console > Authentication and click Get started.',
  'auth/unauthorized-domain': 'This website address is not allowed to sign in. Add it in Firebase console > Authentication > Settings > Authorized domains.',
  'auth/requires-recent-login': 'For your security, please log out and log back in, then try again.',
  'auth/missing-email': 'Enter your email address first.',
};

export function authErrorMessage(error) {
  return messages[error?.code] || error?.message || 'Something went wrong. Please try again.';
}
