import { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// Custom hook so you don't have to import useContext everywhere
export const useAuth = () => useContext(AuthContext);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Will hold { id, role, username }
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Prevents flickering on refresh

    // Helper function to decode the JWT and extract the role
    const decodeToken = (jwtToken) => {
        try {
            // A JWT is split into 3 parts by periods. The payload is the middle part.
            const base64Url = jwtToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode token", error);
            return null;
        }
    };

    // Run this once when the app loads to check if they are already logged in
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            const decodedUser = JSON.parse(localStorage.getItem('user')) || decodeToken(savedToken);
            if (decodedUser) {
                setToken(savedToken);
                setUser(decodedUser); // decodedUser usually contains 'sub' (username) and 'role'
            } else {
                localStorage.removeItem('token'); // Clear invalid token
            }
        }
        setLoading(false);
    }, []);

    // The Login function we will call from our LoginPage
    // Updated Login function to use your backend's full response
    const login = (userData) => {
        // userData will be the exact response from your backend: { token, id, username, role }
        localStorage.setItem('token', userData.token);

        // Save the user details so they survive a page refresh
        const userInfo = { id: userData.id, username: userData.username, name:userData.name, role: userData.role };
        localStorage.setItem('user', JSON.stringify(userInfo));

        setToken(userData.token);
        setUser(userInfo);
    };

    // The Logout function we will put in our Navbar
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // The data we are making available to the rest of the app
    const value = {
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN', // Handy boolean for our routing later
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};