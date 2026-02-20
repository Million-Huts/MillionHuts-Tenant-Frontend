import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingOverlay } from './ui/LoadingOverlay';

const ProtectedRoute = () => {
    const { tenant, loading } = useAuth();

    if (loading) {
        return <div className="relative">
            <LoadingOverlay isLoading={loading} variant='fullscreen' message='Loading Session....' />
        </div>;
    }

    return tenant ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
