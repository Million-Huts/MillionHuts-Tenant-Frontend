import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/components/ProtectedLayout';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/TenantProfilePage';
// later:
// import Complaints from './pages/Complaints';
// import Announcements from './pages/Announcements';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* Future tenant-only pages */}
            {/* <Route path="/complaints" element={<Complaints />} /> */}
            {/* <Route path="/announcements" element={<Announcements />} /> */}
          </Route>
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
