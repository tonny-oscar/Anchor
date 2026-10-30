import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AnchorLogo from './AnchorLogo';
import { useAuth } from '../contexts/AuthContext';

export function PublicNav({ transparent = false }) {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const linkClass = (to) => `px-4 py-2 rounded-full text-sm font-semibold transition ${pathname === to ? 'text-white bg-white/15' : 'text-abyss-100 hover:text-white hover:bg-white/10'}`;

  return (
    <nav className={`${transparent ? 'absolute inset-x-0 top-0 bg-transparent' : 'sticky top-0 bg-abyss-900 shadow-lg shadow-abyss-950/20'} text-white z-40`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <AnchorLogo className="w-7 h-7 text-calm-300" />
          Anchor
        </Link>
        {currentUser ? (
          <Link to="/dashboard" className="px-4 py-2 rounded-full text-sm font-semibold bg-calm-500 text-white hover:bg-calm-400 transition">
            Open my harbor →
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className={linkClass('/login')}>Log in</Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${pathname === '/signup' ? 'bg-calm-400 text-abyss-950' : 'bg-calm-500 text-white hover:bg-calm-400'}`}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  if (location.pathname === '/') return null;
  if (!currentUser) return <PublicNav />;

  const handleLogout = async () => {
    await signOut(auth);
  };

  const links = [
    { to: '/dashboard', label: 'Harbor' },
    { to: '/craving', label: 'Ride the Wave' },
    { to: '/progress', label: 'Progress' },
    { to: '/habits', label: 'Habits' },
    { to: '/milestones', label: 'Milestones' },
    { to: '/learn', label: 'Learn' },
    { to: '/support', label: 'Support' },
    { to: '/settings', label: 'Settings' }
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="bg-abyss-900 text-white sticky top-0 z-40 shadow-lg shadow-abyss-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <AnchorLogo className="w-7 h-7 text-calm-300" />
            Anchor
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-full text-sm transition ${isActive(link.to) ? 'bg-calm-500/20 text-calm-200' : 'text-abyss-100 hover:text-white hover:bg-white/10'}`}
              >
                {link.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="ml-2 px-3 py-2 rounded-full text-sm text-abyss-200 hover:text-white hover:bg-white/10 transition">
              Log out
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-abyss-800 border-t border-white/10">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-3 ${isActive(link.to) ? 'text-calm-200 bg-white/5' : 'text-abyss-100 hover:bg-white/5'}`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="block w-full text-left px-6 py-3 text-abyss-200 hover:bg-white/5">
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
