import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/components/ProtectedLayout';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/TenantProfilePage';
import PGPage from './pages/PGPage';
import QRScanner from './pages/QRScanner';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import ComplaintDetailsPage from './pages/Complaints/ComplaintDetails';

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
            <Route path="/scan" element={<QRScanner />} />

            <Route path="/pg/:pgCode" element={<PGPage />} />
            {/* Future tenant-only pages */}
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/complaints/:complaintId" element={<ComplaintDetailsPage />} />
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
