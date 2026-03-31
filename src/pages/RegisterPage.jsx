import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Lock, Mail, BookOpen, UserPlus, Hash } from 'lucide-react';
import api from '../api/axiosConfig';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '', // Roll Number
        email: '',
        password: '',
        branch: '',
        sem: '',
        year: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Fixed: Uncommented this so your loading state works!

        const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setPasswordError('Password must be 8+ characters with 1 uppercase and 1 symbol.');
            setIsLoading(false);
            return;
        }

        setPasswordError('');

        try {
            await api.post('/auth/register', {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                branch: formData.branch,
                sem: parseInt(formData.sem),
                year: parseInt(formData.year)
            });

            toast.success('Registration successful! Please log in.');
            navigate('/login');

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white">

            {/* LEFT SIDE: The Illustration Showcase */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative items-center justify-center overflow-hidden">

                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/50 blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-200/50 blur-3xl"></div>
                </div>

                {/* The Illustration Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    <img
                        src="/register-hero.svg"
                        alt="Join Utsav Setu"
                        className="w-full max-w-md drop-shadow-2xl mb-10 transition-transform duration-700 hover:scale-105"
                    />
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Journey</span>
                    </h2>
                    <p className="text-lg text-gray-600 font-medium max-w-sm">
                        Create your student account to unlock exclusive access to all campus events.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: The Registration Form (Scrollable) */}
            <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-xl py-10">

                    {/* Mobile Logo (Hidden on Desktop) */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">U</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Utsav Setu</h2>
                    </div>

                    <div className="text-left mb-8 mt-20">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
                        <p className="text-gray-500">Fill in your details below to get started.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">

                        {/* Grid Layout for Side-by-Side inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text" name="name" required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="John Doe"
                                        value={formData.name} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Username / Roll Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text" name="username" required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="e.g. CS123"
                                        value={formData.username} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email" name="email" required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="student@college.edu"
                                        value={formData.email} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Branch */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                                    <select
                                        name="branch" required
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors appearance-none cursor-pointer"
                                        value={formData.branch} onChange={handleChange}
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
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <input
                                    type="number" name="sem" min="1" max="8" required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="1-8"
                                    value={formData.sem} onChange={handleChange}
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="number" name="year" min="1" max="4" required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="1-4"
                                    value={formData.year} onChange={handleChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password" name="password" required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="••••••••"
                                        value={formData.password} onChange={handleChange}
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-xs mt-1 font-medium absolute -bottom-5 left-0">{passwordError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:transform-none mt-8"
                        >
                            {isLoading ? 'Creating Account...' : <><UserPlus className="w-5 h-5 mr-2" /> Register Now</>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-indigo-600 hover:text-blue-600 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;