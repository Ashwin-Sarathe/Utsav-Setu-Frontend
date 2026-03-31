import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, BookOpen, GraduationCap, Save, Calendar } from 'lucide-react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user, login } = useAuth(); // Assuming your context has the user details
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Pre-fill the form with their existing data if available
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        branch: user?.branch || '',
        sem: user?.sem || '',
        year: user?.year || ''
    });

    // Add useEffect to your React imports at the top if it isn't there!
    // import { useState, useEffect } from 'react';

    // NEW: Fetch the existing profile data when the page loads
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                const data = response.data;

                // Update the form with the data from the database!
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    branch: data.branch || '',
                    sem: data.sem || '',
                    year: data.year || ''
                });
            } catch (error) {
                toast.error('Could not load profile data.');
            }
        };

        fetchProfile();
    }, []);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.put('/user/profile/update', formData);
            toast.success('Profile updated successfully!');

            // Optional: If your backend returns the updated user, you can update the AuthContext here
            // login(updatedUserTokenOrData); 

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-3xl mx-auto w-full px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-center">
                        <div className="h-24 w-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
                            <User className="h-12 w-12 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">My Profile</h2>
                        <p className="text-indigo-100 mt-2">Update your personal details here.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* Read-Only Username (For visual context) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username (Unchangeable)</label>
                            <input
                                type="text"
                                disabled
                                value={user?.username || ''}
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Top Row: 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Branch Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        // appearance-none removes the ugly default browser arrow so we can add a custom one!
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="" disabled>Select Branch</option>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="IT">Information Technology (IT)</option>
                                        <option value="ECE">Electronics & Communication (ECE)</option>
                                        <option value="EE">Electrical Engineering (EE)</option>
                                        <option value="IP">Industrial Production (IP)</option>
                                        <option value="MT">Mechatronics Engineering (MT)</option>
                                        <option value="ME">Mechanical Engineering (ME)</option>
                                        <option value="CE">Civil Engineering (CE)</option>
                                        <option value="AI&DS">Artificial Intelligence (AI&DS)</option>
                                    </select>

                                    {/* Custom sleek dropdown arrow */}
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="number" name="sem" min="1" max="8" value={formData.sem} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="number" name="year" min="1" max="4" placeholder="e.g., 3" value={formData.year} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
                        >
                            {isSubmitting ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Profile</>}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;