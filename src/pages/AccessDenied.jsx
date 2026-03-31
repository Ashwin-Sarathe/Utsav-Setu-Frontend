import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-rose-100 p-10 md:p-16 text-center animate-fade-in-up">

                {/* The Illustration Showcase */}
                <div className="relative mb-8 flex justify-center">
                    <div className="absolute inset-0 bg-rose-200/50 blur-3xl rounded-full w-48 h-48 mx-auto -z-10"></div>
                    <img
                        src="/access-denied.svg"
                        alt="Access Denied"
                        className="w-full max-w-xs drop-shadow-xl hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                    <ShieldAlert className="w-10 h-10 text-rose-500" />
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Access Denied
                    </h1>
                </div>

                <p className="text-xl text-gray-700 font-medium mb-2">
                    Hold up! This area is restricted to Event Organizers only.
                </p>

                <p className="text-md text-gray-500 mb-10 max-w-md mx-auto">
                    Your current student account does not have the required permissions to view the command center.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>

                    {/* Safe Route Button */}
                    <Link
                        to="/events"
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
                    >
                        Return to Discover
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;