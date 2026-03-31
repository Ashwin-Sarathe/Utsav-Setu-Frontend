import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Shield, ShieldAlert, ShieldCheck, Mail, BookOpen, Hash } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const AdminManageUsers = () => {
    const { user: currentUser } = useAuth(); // We need to know who is logged in!
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); // Tracks which button is loading

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/users?page=0&size=100&t=${new Date().getTime()}`);
            let allUsers = response.data.content || response.data;

            // THE FIX: Completely hide the master 'admin' account from the list
            // (Change 'admin' to whatever the actual username/roll number of your default admin is)
            const filteredUsers = allUsers.filter(u => u.username !== 'admin');

            setUsers(filteredUsers);
        } catch (error) {
            toast.error('Failed to load users. Are you sure you have Admin privileges?');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromote = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to promote ${userName} to ADMIN? They will have full control over the system.`)) return;

        setProcessingId(userId);
        try {
            await api.put(`/admin/users/${userId}/promote`);
            toast.success(`${userName} has been promoted to Admin!`);

            // Optimistically update the UI so the badge changes instantly
            setUsers(users.map(u => u.id === userId ? { ...u, role: 'ADMIN' } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to promote user.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDemote = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to demote ${userName} to USER? They will lose access to this dashboard.`)) return;

        setProcessingId(userId);
        try {
            await api.put(`/admin/users/${userId}/demote`);
            toast.success(`${userName} has been demoted to User.`);

            // Optimistically update the UI
            setUsers(users.map(u => u.id === userId ? { ...u, role: 'USER' } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to demote user. (Cannot demote the last admin!)');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-indigo-600 font-medium">Loading user database...</div>;
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
                    <p className="text-gray-500 text-sm mt-1">View the student database and manage administrative privileges.</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {users.length} Total Users
                </div>
            </div>

            {/* Users Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Student Name</th>
                                <th className="p-4 font-semibold">Contact Info</th>
                                <th className="p-4 font-semibold">Academic</th>
                                <th className="p-4 font-semibold text-center">Role</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => {
                                const isAdmin = user.role === 'ADMIN';
                                const isMe = user.id === currentUser.id;

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">

                                        {/* Name & Roll No */}
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                                {user.name}
                                                {isMe && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">You</span>}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <Hash className="w-3 h-3 mr-1" /> {user.username}
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="p-4">
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Academic Info */}
                                        <td className="p-4">
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.branch} <span className="mx-2 text-gray-300">|</span> Sem {user.sem}
                                            </div>
                                        </td>

                                        {/* Role Badge */}
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {isAdmin ? <ShieldCheck className="w-3 h-3 mr-1" /> : null}
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end">
                                                {isAdmin ? (
                                                    <button
                                                        onClick={() => handleDemote(user.id, user.name)}
                                                        disabled={isMe || processingId === user.id}
                                                        className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${isMe
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            }`}
                                                        title={isMe ? "You cannot demote yourself" : "Demote to User"}
                                                    >
                                                        {processingId === user.id ? 'Processing...' : <><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Demote</>}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePromote(user.id, user.name)}
                                                        disabled={processingId === user.id}
                                                        className="flex items-center px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        {processingId === user.id ? 'Processing...' : <><Shield className="w-3.5 h-3.5 mr-1" /> Promote</>}
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminManageUsers;