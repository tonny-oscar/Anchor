import { useState } from 'react';

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-full shadow-lg z-50 flex items-center gap-2 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Emergency
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-800">Emergency Help</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold mb-2">Immediate Danger</h3>
                <p className="text-sm text-gray-700 mb-3">If you're in immediate danger or experiencing a medical emergency:</p>
                <a href="tel:911" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-center transition">
                  Call 911
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold mb-2">Crisis Support Lines</h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:988" className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                    <strong>988</strong> - Suicide & Crisis Lifeline
                  </a>
                  <a href="tel:18006624357" className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition">
                    <strong>1-800-662-4357</strong> - SAMHSA Helpline
                  </a>
                </div>
              </div>

              <div className="p-4 bg-serenity-50 rounded-xl">
                <h3 className="font-semibold mb-2">Contact Emergency Contact</h3>
                <p className="text-sm text-gray-600 mb-3">Reach out to your accountability partner</p>
                <button className="w-full bg-serenity-600 hover:bg-serenity-700 text-white font-medium py-3 rounded-lg transition">
                  Email Emergency Contact
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
