import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AnchorLogo from './AnchorLogo';
import { useAuth } from '../contexts/AuthContext';

const publicLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/guide', label: 'Guide' },
  { to: '/learn', label: 'Learn' },
  { to: '/community', label: 'Community' },
  { to: '/find-help', label: 'Find help' },
  { to: '/contact', label: 'Contact' },
];

const appPrimary = [
  { to: '/dashboard', label: 'Harbor' },
  { to: '/craving', label: 'Ride the Wave' },
  { to: '/progress', label: 'Progress' },
  { to: '/habits', label: 'Habits' },
  { to: '/blog', label: 'Blog' },
  { to: '/community', label: 'Community' },
  { to: '/find-help', label: 'Find help' },
];

const appMore = [
  { to: '/milestones', label: 'Milestones' },
  { to: '/checkin', label: 'Check-in log' },
  { to: '/learn', label: 'Learn' },
  { to: '/guide', label: 'Guide' },
  { to: '/support', label: 'Support' },
  { to: '/contact', label: 'Contact' },
  { to: '/settings', label: 'Settings' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const transparent = pathname === '/' && !isOpen;
  const isActive = (to) => pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
  const more = isAdmin ? [...appMore, { to: '/admin', label: 'Admin' }] : appMore;
  const primary = currentUser ? appPrimary : publicLinks;
  const all = currentUser ? [...appPrimary, ...more] : publicLinks;

  const close = () => { setIsOpen(false); setMoreOpen(false); };
  const handleLogout = async () => {
    close();
    await signOut(auth);
  };

  const linkClass = (to) => `px-3 py-2 rounded-full text-sm transition ${isActive(to) ? 'bg-calm-500/20 text-calm-200' : 'text-abyss-100 hover:text-white hover:bg-white/10'}`;

  return (
    <nav className={`${transparent ? 'absolute inset-x-0 top-0 bg-transparent' : 'sticky top-0 bg-abyss-900 shadow-lg shadow-abyss-950/20'} text-white z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link to={currentUser ? '/dashboard' : '/'} onClick={close} className="flex items-center gap-2 text-xl font-bold text-white flex-shrink-0">
            <AnchorLogo className="w-7 h-7 text-calm-300" />
            Anchor
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {primary.map(link => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>{link.label}</Link>
            ))}

            {currentUser ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className={`px-3 py-2 rounded-full text-sm transition ${more.some(l => isActive(l.to)) ? 'bg-calm-500/20 text-calm-200' : 'text-abyss-100 hover:text-white hover:bg-white/10'}`}
                  >
                    More ▾
                  </button>
                  {moreOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 py-2 bg-white rounded-2xl shadow-2xl text-gray-800 z-50 animate-rise">
                        {more.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={close}
                            className={`block px-4 py-2 text-sm hover:bg-calm-50 ${isActive(link.to) ? 'text-calm-700 font-semibold' : ''}`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button onClick={handleLogout} className="ml-1 px-3 py-2 rounded-full text-sm text-abyss-200 hover:text-white hover:bg-white/10 transition">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`ml-2 ${linkClass('/login')} font-semibold`}>Log in</Link>
                <Link to="/signup" className="px-4 py-2 rounded-full text-sm font-semibold bg-calm-500 text-white hover:bg-calm-400 transition">Sign up</Link>
              </>
            )}
          </div>

          <div className="flex xl:hidden items-center gap-2">
            {!currentUser && (
              <Link to="/signup" onClick={close} className="px-4 py-2 rounded-full text-sm font-semibold bg-calm-500 text-white hover:bg-calm-400 transition">Sign up</Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-abyss-800 border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="grid sm:grid-cols-2">
            {all.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={close}
                className={`block px-6 py-3 ${isActive(link.to) ? 'text-calm-200 bg-white/5' : 'text-abyss-100 hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-white/10">
            {currentUser ? (
              <button onClick={handleLogout} className="block w-full text-left px-6 py-3 text-abyss-200 hover:bg-white/5">Log out</button>
            ) : (
              <Link to="/login" onClick={close} className="block px-6 py-3 text-abyss-100 hover:bg-white/5">Log in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
