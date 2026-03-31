import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Compass, Ticket, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { User, Settings} from 'lucide-react'; // Make sure Settings is imported
import {ChevronDown, Bell } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = () => {
  const { user, logout } = useAuth();

  //change password 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


  const navigate = useNavigate();
  const location = useLocation(); // NEW: This tells us what page we are currently on!

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to check if a link is the active page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left side: Logo, Brand & Main Links */}
          <div className="flex items-center">

            {/* Logo */}
            <div className="flex items-center space-x-3 mr-8">
              <img src="/logo.png" alt="Utsav Setu Logo" className="h-10 w-auto rounded-lg shadow-sm" />
              <Link
                to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/events'}
                className="text-2xl font-bold text-white tracking-wide hover:text-indigo-100 transition-colors"
              >
                Utsav Setu
              </Link>

            </div>

            {/* UPGRADED: Navigation Links (Glass Pill Design) */}
            <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/10 space-x-1">
              <Link
                to="/events"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/events')
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Compass className="w-4 h-4 mr-2" />
                Discover
              </Link>

              <Link
                to="/my-tickets"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/my-tickets')
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Ticket className="w-4 h-4 mr-2" />
                My Tickets
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/admin/dashboard')
                      ? 'bg-purple-600/80 text-white shadow-sm border border-purple-500/50'
                      : 'text-purple-200 hover:bg-purple-500/20 hover:text-white'
                    }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              
            </div>

          </div>

          {/* Right side: Notifications & User Dropdown */}
          <div className="flex items-center gap-4 relative">

            {/* Notification Container */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsDropdownOpen(false); // Close user menu if it's open
                }}
                className={`relative p-2 transition-colors rounded-full hover:bg-white/10 ${isNotificationOpen ? 'bg-white/10 text-white' : 'text-indigo-200 hover:text-white'}`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#4338ca]"></span>
              </button>

              {/* The Notification Dropdown Box */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-down z-50">

                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">1 New</span>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">

                    {/* The "Welcome" Notification Item */}
                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-indigo-500 bg-indigo-50/30">

                      {/* Mini Illustration / Icon Banner */}
                      <div className="w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-3 flex items-center justify-center shadow-inner relative overflow-hidden">
                        {/* Decorative background circles */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>

                        {/* You can replace this emoji with an <img src="/your-svg.svg" /> later if you want! */}
                        <span className="text-4xl drop-shadow-md relative z-10">🎉</span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 mb-1">Welcome to Utsav Setu!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        We are thrilled to have you here. Head over to the Discover tab to find your first college event and grab your ticket.
                      </p>
                      <span className="text-[10px] font-medium text-gray-400 mt-2 block">Just now</span>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-100 bg-white">
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: User Dropdown */}
            <div className="relative flex items-center">

              {/* The Clickable Capsule */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-indigo-300 shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-inner group-hover:scale-105 transition-transform">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-white group-hover:text-indigo-100">
                    {user?.username}
                  </span>
                  {/* NEW: The animated dropdown arrow */}
                  <ChevronDown
                    className={`w-4 h-4 text-indigo-200 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* The Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-fade-in-down z-50">

                  {/* Option 1: Edit Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Edit Profile
                  </Link>

                  {/* Option 2: Change Password */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Change Password
                  </button>

                  <div className="h-px bg-gray-100 my-1"></div>

                  {/* Option 3: Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </nav>

  );
};

export default Navbar;