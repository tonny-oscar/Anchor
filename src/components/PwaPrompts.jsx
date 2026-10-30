import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import AnchorLogo from './AnchorLogo';

const DISMISS_KEY = 'anchor-install-dismissed';
const DISMISS_DAYS = 14;
const UPDATE_CHECK_MS = 60 * 60 * 1000;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const recentlyDismissed = () => Date.now() - Number(localStorage.getItem(DISMISS_KEY) || 0) < DISMISS_DAYS * 86400000;

function Toast({ children }) {
  return (
    <div className="fixed bottom-24 left-4 right-4 sm:right-auto sm:max-w-sm z-50 bg-abyss-900 text-white rounded-2xl shadow-2xl shadow-abyss-950/40 p-4 animate-rise">
      {children}
    </div>
  );
}

export default function PwaPrompts() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showIosHint, setShowIosHint] = useState(() => isIos() && !isStandalone() && !recentlyDismissed());
  const [online, setOnline] = useState(() => navigator.onLine);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => registration.update(), UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      if (!recentlyDismissed()) setInstallEvent(e);
    };
    const onInstalled = () => setInstallEvent(null);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const dismissInstall = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setInstallEvent(null);
    setShowIosHint(false);
  };

  const install = async () => {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <>
      {!online && (
        <div className="fixed top-16 inset-x-0 z-40 bg-gentle-500 text-white text-sm text-center py-2 px-4">
          You're offline. Anchor still works, and your changes will sync when you reconnect.
        </div>
      )}

      {needRefresh ? (
        <Toast>
          <p className="font-semibold mb-1">A new version of Anchor is ready</p>
          <p className="text-sm text-abyss-100 mb-3">Refresh to get the latest features and fixes.</p>
          <div className="flex gap-2">
            <button onClick={() => updateServiceWorker(true)} className="btn-primary py-2">Refresh</button>
            <button onClick={() => setNeedRefresh(false)} className="px-4 py-2 rounded-full text-sm text-abyss-100 hover:bg-white/10">Later</button>
          </div>
        </Toast>
      ) : offlineReady ? (
        <Toast>
          <p className="font-semibold mb-1">⚓ Anchor works offline now</p>
          <p className="text-sm text-abyss-100 mb-3">You can open it even without internet. Your tools will be there when you need them.</p>
          <button onClick={() => setOfflineReady(false)} className="btn-primary py-2">Got it</button>
        </Toast>
      ) : installEvent ? (
        <Toast>
          <div className="flex gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-abyss-800 flex items-center justify-center flex-shrink-0">
              <AnchorLogo className="w-7 h-7 text-calm-300" />
            </div>
            <div>
              <p className="font-semibold">Install Anchor</p>
              <p className="text-sm text-abyss-100">Add it to your home screen for one-tap access, even offline.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={install} className="btn-primary py-2">Install app</button>
            <button onClick={dismissInstall} className="px-4 py-2 rounded-full text-sm text-abyss-100 hover:bg-white/10">Not now</button>
          </div>
        </Toast>
      ) : showIosHint ? (
        <Toast>
          <p className="font-semibold mb-1">Install Anchor on your iPhone</p>
          <p className="text-sm text-abyss-100 mb-3">
            Tap the <strong>Share</strong> button in Safari, then <strong>Add to Home Screen</strong>.
          </p>
          <button onClick={dismissInstall} className="btn-primary py-2">Got it</button>
        </Toast>
      ) : null}
    </>
  );
}
