import { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Users as UsersIcon, LayoutDashboard, Ticket, Activity, BarChart3, ShieldAlert, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

// Your existing components
import AdminCreateEvent from '../components/admin/AdminCreateEvent';
import AdminManageEvents from '../components/admin/AdminManageEvents';
import AdminManageUsers from '../components/admin/AdminManageUsers';

const AdminDashboard = () => {
    // Set the new Overview as the default tab!
    const [activeTab, setActiveTab] = useState('overview');

    // --- Analytics State ---
    const [summary, setSummary] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        totalActiveRegistrations: 0
    });
    const [eventStats, setEventStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Only fetch data when they are looking at the overview tab
    useEffect(() => {
        if (activeTab === 'overview') {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const summaryRes = await api.get('/admin/dashboard/summary');
            const statsRes = await api.get('/admin/dashboard/event-stats');

            setSummary(summaryRes.data);
            setEventStats(statsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = async (eventId, eventTitle) => {
        try {
            // 1. Fetch the file from the updated API endpoint
            // CRITICAL: We must tell axios to expect a 'blob' (file) instead of standard JSON
            const response = await api.get(`/admin/dashboard/events/${eventId}/export-registrations`, {
                responseType: 'blob'
            });

            // 2. The backend already formatted the CSV, so we just wrap it in a Blob
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            // 3. Create a temporary link and trigger the browser's download manager
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${eventTitle.replace(/\s+/g, '_')}_Attendees.csv`);
            document.body.appendChild(link);
            link.click();

            // 4. Cleanup the DOM and memory
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Export downloaded successfully!");

        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export data. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Main Dashboard Layout */}
            <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">

                {/* Left Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
                            Admin Menu
                        </h2>
                        <nav className="space-y-1">
                            {/* NEW: Dashboard Overview Tab */}
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeTab === 'overview'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <LayoutDashboard className={`w-5 h-5 mr-3 ${activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                Overview
                            </button>

                            <button
                                onClick={() => setActiveTab('create')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeTab === 'create'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <PlusCircle className={`w-5 h-5 mr-3 ${activeTab === 'create' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                Create Event
                            </button>

                            <button
                                onClick={() => setActiveTab('manage-events')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeTab === 'manage-events'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Calendar className={`w-5 h-5 mr-3 ${activeTab === 'manage-events' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                My Events
                            </button>

                            <button
                                onClick={() => setActiveTab('manage-users')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${activeTab === 'manage-users'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <UsersIcon className={`w-5 h-5 mr-3 ${activeTab === 'manage-users' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                Manage Users
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-grow">

                    {/* ZONE: Overview / Analytics (Only shows when 'overview' is active) */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="border-b border-gray-200 pb-5">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                                    <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
                                    Admin Command Center
                                </h1>
                                <p className="text-gray-500 mt-2">Platform analytics and real-time event capacity.</p>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <>
                                    {/* The Hero Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                                                    <h3 className="text-3xl font-bold text-gray-900">{summary.totalUsers}</h3>
                                                </div>
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <UsersIcon className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Events</p>
                                                    <h3 className="text-3xl font-bold text-gray-900">{summary.totalEvents}</h3>
                                                </div>
                                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">All-Time Tickets</p>
                                                    <h3 className="text-3xl font-bold text-gray-900">{summary.totalRegistrations}</h3>
                                                </div>
                                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                                                    <Ticket className="w-6 h-6 text-indigo-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Active Tickets</p>
                                                    <h3 className="text-3xl font-bold text-gray-900">{summary.totalActiveRegistrations}</h3>
                                                </div>
                                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                    <Activity className="w-6 h-6 text-emerald-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analytics Table */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                                            <h3 className="text-lg font-bold text-gray-900">Live Event Capacities</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                        <th className="px-6 py-4 font-medium">Event Title</th>
                                                        <th className="px-6 py-4 font-medium text-center">Max Capacity</th>
                                                        <th className="px-6 py-4 font-medium text-center">Current Fill</th>
                                                        <th className="px-6 py-4 font-medium text-center">Seats Remaining</th>
                                                        <th className="px-6 py-4 font-medium text-center">Status</th>
                                                            <th className="px-6 py-4 font-medium text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {eventStats.map((event) => {
                                                        const isFull = event.remainingSeats <= 0;
                                                        const fillPercentage = event.maxParticipants > 0
                                                            ? (event.currentParticipants / event.maxParticipants) * 100
                                                            : 0;

                                                        return (
                                                            <tr key={event.eventId} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{event.title}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">{event.maxParticipants}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <span className="font-bold text-indigo-600">{event.currentParticipants}</span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    {isFull ? (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Sold Out</span>
                                                                    ) : (
                                                                        <span className={`font-bold ${event.remainingSeats < 10 ? 'text-orange-500' : 'text-emerald-600'}`}>{event.remainingSeats}</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                                        <div className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : fillPercentage > 80 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(fillPercentage, 100)}%` }}></div>
                                                                    </div>
                                                                </td>
                                                                {/* NEW: The Export Button Cell */}
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <button
                                                                        onClick={() => handleExportCSV(event.eventId, event.title)}
                                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors"
                                                                    >
                                                                        <Download className="w-4 h-4 mr-1" />
                                                                        Export
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {eventStats.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                                <ShieldAlert className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                                                <p className="text-lg font-medium">No events found.</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* The rest of your existing components */}
                    {activeTab === 'create' && <AdminCreateEvent />}
                    {activeTab === 'manage-events' && <AdminManageEvents />}
                    {activeTab === 'manage-users' && <AdminManageUsers />}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;