import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
  const isPublic = ['/', '/signup', '/login'].includes(location.pathname);

  if (isPublic) return null;

  const handleLogout = async () => {
    await signOut(auth);
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/progress', label: 'Progress' },
    { to: '/habits', label: 'Habits' },
    { to: '/milestones', label: 'Milestones' },
    { to: '/support', label: 'Support' },
    { to: '/settings', label: 'Settings' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-calm-700">Recovery</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {links.map(link => (
              <Link key={link.to} to={link.to} className="text-gray-700 hover:text-calm-600 px-3 py-2 rounded-lg hover:bg-calm-50 transition">
                {link.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-calm-50">
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
