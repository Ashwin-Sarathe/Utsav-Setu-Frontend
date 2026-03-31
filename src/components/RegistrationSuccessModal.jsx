import { Link } from 'react-router-dom';
import { Ticket, X, CheckCircle2 } from 'lucide-react';
import Confetti from 'react-confetti'; // Optional: if you want to be extra fancy!
import { useState, useEffect } from 'react';

const RegistrationSuccessModal = ({ isOpen, onClose, eventName }) => {
    // Optional: Window dimensions for confetti (if you choose to install react-confetti)
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* The Glass Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Optional Confetti overlay! Just run `npm install react-confetti` to use it */}
            {/* <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} /> */}

            {/* The Modal Card */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-white p-8 text-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* The Illustration Showcase */}
                <div className="relative mb-6 flex justify-center mt-4">
                    <div className="absolute inset-0 bg-indigo-200/50 blur-3xl rounded-full w-32 h-32 mx-auto -z-10"></div>
                    <img
                        src="/success-ticket.svg"
                        alt="Registration Success"
                        className="w-full max-w-[200px] drop-shadow-xl animate-bounce-slow"
                    />
                </div>

                {/* Success Header */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        You're in!
                    </h2>
                </div>

                {/* Dynamic Event Name */}
                {eventName && (
                    <p className="text-indigo-600 font-bold mb-3 text-lg">
                        {eventName}
                    </p>
                )}

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Your ticket has been securely generated. Check your <span className="font-semibold text-gray-800">'My Tickets'</span> tab to view your pass.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/my-tickets"
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
                    >
                        <Ticket className="w-5 h-5 mr-2" />
                        View My Ticket
                    </Link>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Keep Exploring
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccessModal;