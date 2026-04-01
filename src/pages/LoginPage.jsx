import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, User } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard'); 
            } else {
                navigate('/events');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Hit your Spring Boot API
            const response = await api.post('/auth/login', {
                username: formData.username,
                password: formData.password,
            });

            // 2. Pass the full response data to our AuthContext
            login(response.data);

            // 3. Show a success pop-up
            toast.success(`Welcome back, ${response.data.username}!`);

            // 4. Route them based on their role
            if (response.data.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/events');
            }

        } catch (error) {
            // If the backend sends an error (like wrong password), show it safely
            const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white">

            {/* LEFT SIDE: The Illustration Showcase (Hidden on Mobile, 50% width on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 to-purple-100 relative items-center justify-center overflow-hidden">

                {/* Decorative background blobs to make the SVG pop */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-200/50 blur-3xl"></div>
                </div>

                {/* The Illustration Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    
                    <img
                        src="/login-hero.svg"
                        alt="Utsav Setu Events"
                        className="w-full max-w-md drop-shadow-2xl mb-10 transition-transform duration-700 hover:scale-105"
                    />
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">UTSAV-SETU</span>
                    </h2>
                    <p className="text-lg text-gray-600 font-medium max-w-sm">
                        Discover, register, and experience the best college events all in one place.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: The Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
                <div className="w-full max-w-md">


                    <div className="lg:hidden text-center mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">U</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Utsav Setu</h2>
                    </div>

                    <div className="text-left mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
                        <p className="text-gray-500">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Username (Roll Number) Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username (Roll Number)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="Enter your roll number"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="password" name="password" required
                                    value={formData.password} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:transform-none"
                        >
                            {isSubmitting ? 'Authenticating...' : <><LogIn className="w-5 h-5 mr-2" /> Sign In</>}
                        </button>

                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-indigo-600 hover:text-purple-600 transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;