import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    // 1. Pull in the 'loading' state!
    const { user, loading } = useAuth();

    // 2. WAIT for the context to finish checking local storage
    if (loading) {
        // You can return a cool spinner component here later if you want!
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    // 3. If they aren't logged in at all, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 4. If this route requires a specific role (like ADMIN), and they don't have it
    if (requiredRole && user.role !== requiredRole) {
        // Kick them to our brand new Access Denied page!
        return <Navigate to="/unauthorized" replace />;
    }

    // 5. If they pass all checks, let them in!
    return children;
};

export default ProtectedRoute;