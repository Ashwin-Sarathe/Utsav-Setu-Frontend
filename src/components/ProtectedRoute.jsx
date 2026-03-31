import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    // 1. If they aren't logged in at all, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If this route requires a specific role (like ADMIN), and they don't have it
    if (requiredRole && user.role !== requiredRole) {
        // Kick them to our brand new Access Denied page!
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. If they pass all checks, let them in!
    return children;
};

export default ProtectedRoute;