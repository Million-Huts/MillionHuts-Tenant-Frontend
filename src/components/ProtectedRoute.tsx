import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { tenant, loading } = useAuth();

    if (loading) {
        return <div className="p-8">Loading session...</div>;
    }

    return tenant ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
