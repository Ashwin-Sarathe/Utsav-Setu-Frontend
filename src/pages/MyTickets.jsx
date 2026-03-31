import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Ticket, Calendar, MapPin, Clock, XCircle, AlertCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import TicketSkeleton from '../components/TicketSkeleton';
import TicketQRCodeModal from '../components/TicketQRCodeModal';


const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedQrTicket, setSelectedQrTicket] = useState(null);

    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/registrations/user?t=${new Date().getTime()}`);
            setTickets(response.data);
        } catch (error) {
            toast.error('Failed to load your tickets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelTicket = async (regId) => {
        if (!window.confirm("Are you sure you want to cancel your registration for this event?")) return;

        setProcessingId(regId);
        try {
            await api.put(`/registrations/${regId}/cancel`);
            toast.success('Registration cancelled successfully.');

            setTickets(tickets.map(ticket =>
                ticket.id === regId ? { ...ticket, status: 'CANCELLED' } : ticket
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel registration.');
        } finally {
            setProcessingId(null);
        }
    };

    const processedTickets = tickets
        .filter(ticket => {
            const isCancelled = ticket.status === 'CANCELLED';
            const isEventPast = ticket.eventStatus === 'PAST';

            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'LIVE') return !isCancelled && !isEventPast;
            if (activeFilter === 'CLOSED') return !isCancelled && isEventPast;
            if (activeFilter === 'CANCELLED') return isCancelled;
            return true;
        })
        .sort((a, b) => {
            const aIsCancelled = a.status === 'CANCELLED';
            const aIsPast = a.eventStatus === 'PAST';

            const bIsCancelled = b.status === 'CANCELLED';
            const bIsPast = b.eventStatus === 'PAST';

            const getPriority = (isCanc, isPst) => {
                if (isCanc) return 2;
                if (isPst) return 3;
                return 1;
            };

            return getPriority(aIsCancelled, aIsPast) - getPriority(bIsCancelled, bIsPast);
        });


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <Ticket className="w-10 h-10 mr-3 text-indigo-600" />
                        My Tickets
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your event registrations and passes.</p>
                </div>

                {/* Dynamic Filter Pills */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />

                    {['ALL', 'LIVE', 'CLOSED', 'CANCELLED'].map(filterType => (
                        <button
                            key={filterType}
                            onClick={() => setActiveFilter(filterType)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filterType
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {filterType === 'ALL' && 'All Tickets'}
                            {filterType === 'LIVE' && '🟢 Live'}
                            {filterType === 'CLOSED' && '🛑 Concluded'}
                            {filterType === 'CANCELLED' && '❌ Cancelled'}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <TicketSkeleton key={num} />
                        ))}
                    </div>
                )}

                {/* NEW SVG EMPTY STATE: Triggers ONLY when user has absolutely zero tickets overall */}
                {!isLoading && tickets.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-indigo-50 shadow-sm max-w-3xl mx-auto text-center px-6 mt-10 animate-fade-in-up">
                        <img
                            src="/empty-tickets.svg"
                            alt="No tickets"
                            className="w-full max-w-xs mb-8 drop-shadow-lg transition-transform hover:scale-105 duration-500"
                        />
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Looks like your calendar is empty!
                        </h3>
                        <p className="text-lg text-gray-500 max-w-md mb-8">
                            Head over to the Discover tab to find your next great experience and grab your first ticket.
                        </p>
                        <Link
                            to="/events"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Discover Events
                        </Link>
                    </div>
                )}

                {/* EXISTING FILTER EMPTY STATE: Triggers when user has tickets, but none match the current filter */}
                {!isLoading && tickets.length > 0 && processedTickets.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No Tickets Found</h3>
                        <p className="text-gray-500 mt-2 mb-6">You don't have any tickets matching this filter.</p>
                        <button onClick={() => setActiveFilter('ALL')} className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Tickets Grid */}
                {!isLoading && processedTickets.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ... Your exact existing map function stays right here ... */}
                        {processedTickets.map(ticket => {
                            const isCancelled = ticket.status === 'CANCELLED';
                            const isEventPast = ticket.eventStatus === 'PAST';

                            return (
                                <div key={ticket.id} className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${(isCancelled || isEventPast) ? 'border-gray-200 opacity-75 grayscale-[0.5]' : 'border-indigo-100 hover:shadow-lg'}`}>

                                    <div className={`absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full ${isCancelled ? 'bg-gray-50 border-r border-gray-200' : 'bg-gray-50 border-r border-indigo-100'}`}></div>
                                    <div className={`absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full ${isCancelled ? 'bg-gray-50 border-l border-gray-200' : 'bg-gray-50 border-l border-indigo-100'}`}></div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${isCancelled ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">ID: {ticket.id.slice(-6).toUpperCase()}</span>
                                        </div>

                                        <h3 className={`text-xl font-bold mb-4 line-clamp-2 ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                            {ticket.eventTitle || 'Unknown Event'}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className={`w-4 h-4 mr-3 ${isCancelled ? 'text-gray-400' : 'text-indigo-500'}`} />
                                                {ticket.eventDate ? ticket.eventDate.split('-').reverse().join('/') : 'TBA'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className={`w-4 h-4 mr-3 ${isCancelled ? 'text-gray-400' : 'text-indigo-500'}`} />
                                                {ticket.eventTime || 'TBA'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className={`w-4 h-4 mr-3 ${isCancelled ? 'text-gray-400' : 'text-indigo-500'}`} />
                                                {ticket.venue || 'TBA'}
                                            </div>
                                        </div>

                                        {/* NEW: View QR Code Button */}
                                        {!isCancelled && (
                                            <button
                                                onClick={() => setSelectedQrTicket(ticket)}
                                                className="w-full mb-3 py-2.5 flex items-center justify-center text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
                                            >
                                                View Digital Pass
                                            </button>
                                        )}

                                        {!isCancelled && !isEventPast && (
                                            <button
                                                onClick={() => handleCancelTicket(ticket.id)}
                                                disabled={processingId === ticket.id}
                                                className="w-full py-2.5 flex items-center justify-center text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-70"
                                            >
                                                {processingId === ticket.id ? 'Cancelling...' : <><XCircle className="w-4 h-4 mr-2" /> Cancel Ticket</>}
                                            </button>
                                        )}

                                        {!isCancelled && isEventPast && (
                                            <div className="w-full py-2.5 flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-100 rounded-xl cursor-not-allowed">
                                                Event Concluded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <TicketQRCodeModal
                isOpen={!!selectedQrTicket}
                onClose={() => setSelectedQrTicket(null)}
                ticket={selectedQrTicket}
            />
        </div>
    );
};

export default MyTickets;