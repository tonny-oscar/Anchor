import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import EmergencyButton from './components/EmergencyButton';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubstanceDetail from './pages/SubstanceDetail';
import CheckIn from './pages/CheckIn';
import CravingSupport from './pages/CravingSupport';
import Progress from './pages/Progress';
import Habits from './pages/Habits';
import Milestones from './pages/Milestones';
import Support from './pages/Support';
import Settings from './pages/Settings';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navigation />
      <EmergencyButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/substance/:id" element={<PrivateRoute><SubstanceDetail /></PrivateRoute>} />
        <Route path="/checkin" element={<PrivateRoute><CheckIn /></PrivateRoute>} />
        <Route path="/craving" element={<PrivateRoute><CravingSupport /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
        <Route path="/milestones" element={<PrivateRoute><Milestones /></PrivateRoute>} />
        <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
