import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const FloatingFeedback = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth(); // To know who is sending it

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post('/api/feedback/submit', {
                message: message,
                submittedBy: user?.username || 'Anonymous'
            });
            toast.success('Thanks for your feedback!');
            setMessage('');
            setIsOpen(false); // Close the box on success
        } catch (error) {
            toast.error('Failed to send feedback. Try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        
        <div className="fixed bottom-6 right-6 z-50">

            <div
                className={`absolute bottom-16 right-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-4">
                    <h3 className="text-white font-bold text-lg">Send Feedback</h3>
                    <p className="text-purple-200 text-xs mt-1">Found a bug? Have a suggestion?</p>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <textarea
                        autoFocus={isOpen}
                        rows="4"
                        placeholder="Tell us what you think..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-700"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>

                    <button
                        type="submit"
                        disabled={isSubmitting || !message.trim()}
                        className="mt-3 w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Feedback</>}
                    </button>
                </form>
            </div>

            {/* The Floating Purple Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center hover:from-purple-500 hover:to-indigo-500"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default FloatingFeedback;