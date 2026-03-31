import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import AccessDenied from './pages/AccessDenied';

// Importing the Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventFeed from './pages/EventFeed';
import AdminDashboard from './pages/AdminDashboard';
import MyTickets from './pages/MyTickets';
import FloatingFeedback from './components/FloatingFeedback';
import Profile from './pages/Profile';
// NEW: Import your beautiful 404 component
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      {/* This component handles pop-up notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* Our Application Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/unauthorized" element={<AccessDenied />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}

        <Route path="/events" element={
          <ProtectedRoute><EventFeed /></ProtectedRoute>
        } />
        <Route path="/my-tickets" element={
          <ProtectedRoute><MyTickets /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* ADMIN ONLY ROUTE (Must be logged in AND have the ADMIN role) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* NEW: The 404 Catch-All Net MUST go at the very bottom! */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <FloatingFeedback />
    </Router>
  );
}

export default App;