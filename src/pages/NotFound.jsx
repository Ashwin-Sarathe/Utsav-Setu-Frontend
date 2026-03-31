import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 p-10 md:p-16 text-center animate-fade-in-up">

                {/* The Illustration */}
                <img
                    src="/404-hero.svg"
                    alt="Page Not Found"
                    className="w-full max-w-sm mx-auto mb-8 drop-shadow-xl"
                />

                <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tighter">
                    404
                </h1>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Oops! You wandered off campus.
                </h2>

                <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Back Button (Uses browser history) */}
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>

                    {/* Home Button (Safe Zone) */}
                    <Link
                        to="/events"
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Return to Discover
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFound;