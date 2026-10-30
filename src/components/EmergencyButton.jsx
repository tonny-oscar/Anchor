import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);
  const { currentUser, profile } = useAuth();
  const contact = profile?.emergencyContact;
  const name = profile?.displayName || 'Your friend';
  const mailto = contact && `mailto:${contact}?subject=${encodeURIComponent('I could use your support right now')}&body=${encodeURIComponent(
    `Hi,\n\nI'm going through a hard moment with cravings and could really use someone to talk to. Can you call or text me when you see this?\n\n${name}\n\n(Sent from Anchor)`
  )}`;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-red-900/30 z-50 flex items-center gap-2 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9" />
        </svg>
        SOS
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-abyss-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-rise" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-1 text-red-800">You're not alone</h2>
            <p className="text-sm text-gray-600 mb-5">Reaching out right now is a strong move. Pick whatever feels easiest.</p>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 rounded-2xl">
                <h3 className="font-semibold mb-2">Immediate danger or overdose</h3>
                <p className="text-sm text-gray-700 mb-3">If someone is unresponsive, not breathing well, or you're at medical risk:</p>
                <a href="tel:911" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-center transition">
                  Call 911
                </a>
                <p className="text-xs text-gray-600 mt-2">If opioids may be involved and you have naloxone (Narcan), use it, then call.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold mb-2">Talk to someone 24/7</h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:988" className="block p-3 bg-white rounded-xl hover:bg-calm-50 transition">
                    <strong>988</strong>: Suicide & Crisis Lifeline (call or text)
                  </a>
                  <a href="tel:18006624357" className="block p-3 bg-white rounded-xl hover:bg-calm-50 transition">
                    <strong>1-800-662-4357</strong>: SAMHSA National Helpline
                  </a>
                  <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-xl hover:bg-calm-50 transition">
                    <strong>Outside the US?</strong> Find a free helpline at findahelpline.com
                  </a>
                </div>
              </div>

              {currentUser && (
                <div className="p-4 bg-serenity-50 rounded-2xl">
                  <h3 className="font-semibold mb-2">Your lighthouse person</h3>
                  {contact ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">Send {contact} a ready-made message asking for support.</p>
                      <a href={mailto} className="w-full btn-secondary">Email emergency contact</a>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-3">You haven't added an accountability partner yet.</p>
                      <Link to="/support" onClick={() => setShowModal(false)} className="w-full btn-secondary">Add a partner</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
