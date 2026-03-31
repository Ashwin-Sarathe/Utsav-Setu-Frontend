import { useState } from 'react';
import { X, Key, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear errors when they start typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match!');
            return;
        }

        // 2. Frontend Regex Check
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            setError('New password must be 8+ characters with 1 uppercase and 1 symbol.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/user/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            toast.success('Password updated securely!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            onClose(); // Close the modal on success
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">

                {/* Modal Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-400" />
                        Change Password
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password" name="currentPassword" required
                                value={formData.currentPassword} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password" name="newPassword" required
                                value={formData.newPassword} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password" name="confirmPassword" required
                                value={formData.confirmPassword} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={isSubmitting}
                        className="w-full mt-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? 'Updating...' : 'Secure My Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;