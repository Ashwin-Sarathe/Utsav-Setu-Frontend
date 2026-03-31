import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Users, Clock, Search, Filter, Ticket, Hourglass } from 'lucide-react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';
import EventSkeleton from '../components/EventSkeleton';


const EventFeed = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [registeredEventName, setRegisteredEventName] = useState('');

    // NEW: State to track which filter tab is active
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (query = '') => {
        setIsLoading(true);
        try {
            const cacheBuster = `&t=${new Date().getTime()}`;
            const url = query
                ? `/events/search?title=${query}&page=0&size=100${cacheBuster}`
                : `/events/get-all-events?page=0&size=100${cacheBuster}`;

            const response = await api.get(url);
            setEvents(response.data.content || response.data);
        } catch (error) {
            toast.error('Failed to load events. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents(searchTerm);
    };

    const handleRegister = async (eventId) => {
        setRegisteringId(eventId);
        try {
            await api.post('/registrations', { eventId });
            setRegisteredEventName(event.title);
            setIsSuccessModalOpen(true);

            // Optimistic update
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id == eventId
                        ? { ...event, currentParticipants: (event.currentParticipants || 0) + 1 }
                        : event
                )
            );
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Could not register. You might already be registered.';
            toast.error(errorMsg);
        } finally {
            setRegisteringId(null);
        }
    };

    // UPGRADED: Local filtering AND Priority Sorting logic
    const statusPriority = {
        'LIVE': 1,
        'UPCOMING': 2,
        'PAST': 3
    };

    const filteredEvents = events
        .filter(event => {
            if (activeFilter === 'ALL') return true;
            const eventStatus = event.status || 'LIVE'; // Fallback just in case
            return eventStatus === activeFilter;
        })
        .sort((a, b) => {
            // This assigns a number (1, 2, or 3) to each event and sorts them numerically!
            const priorityA = statusPriority[a.status || 'LIVE'];
            const priorityB = statusPriority[b.status || 'LIVE'];
            return priorityA - priorityB;
        });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Events</h1>
                        <p className="text-gray-500 mt-2">Find and register for the latest happenings at Utsav Setu.</p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full md:w-96 relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Increased the right padding (pr-24) so text doesn't hide behind the button!
                            className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                        <Search className="absolute left-3 h-5 w-5 text-gray-400" />

                        {/* The visible Search Button is back! */}
                        <button
                            type="submit"
                            className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* NEW: Dynamic Filter Pills */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />

                    {['ALL', 'LIVE', 'UPCOMING', 'PAST'].map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === status
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status === 'ALL' && 'All Events'}
                            {status === 'LIVE' && '🟢 Live Now'}
                            {status === 'UPCOMING' && '⏳ Upcoming'}
                            {status === 'PAST' && '🛑 Past Events'}
                        </button>
                    ))}
                </div>

                {/* UPGRADED Loading State: The Skeleton Grid */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* We use a quick array [1..6] to map out 6 placeholder cards */}
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <EventSkeleton key={num} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                    </div>
                )}

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!isLoading && filteredEvents.map(event => {
                        const current = event.currentParticipants || 0;
                        const max = event.maxParticipants || 0;
                        const isFull = current >= max;

                        // NEW: Status Logic
                        const status = event.status || 'LIVE';
                        const isLive = status === 'LIVE';
                        const isUpcoming = status === 'UPCOMING';
                        const isPast = status === 'PAST';

                        return (
                            <div key={event.id} className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${isPast ? 'border-gray-200 opacity-75' : 'border-gray-100 hover:shadow-xl hover:-translate-y-1'
                                }`}>

                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${isLive ? 'bg-green-100 text-green-700' :
                                                isUpcoming ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {isLive ? '🟢 Live' : isUpcoming ? '⏳ Upcoming' : '🛑 Ended'}
                                        </span>

                                        {/* Capacity Badge */}
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${isFull ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'
                                            }`}>
                                            {current} / {max} Filled
                                        </span>
                                    </div>

                                    <h3 className={`text-2xl font-bold mb-3 line-clamp-2 ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {event.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-500 font-medium">
                                            <Calendar className="w-4 h-4 mr-3 text-indigo-400" />
                                            {event.eventDate ? event.eventDate.split('-').reverse().join('/') : 'TBA'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 font-medium">
                                            <Clock className="w-4 h-4 mr-3 text-indigo-400" />
                                            {event.eventTime || 'TBA'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 font-medium">
                                            <MapPin className="w-4 h-4 mr-3 text-indigo-400" />
                                            {event.venue || 'TBA'}
                                        </div>
                                    </div>
                                </div>

                                {/* Smart Action Button */}
                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={() => handleRegister(event.id)}
                                        disabled={registeringId === event.id || isFull || !isLive}
                                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${isPast
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isUpcoming
                                                    ? 'bg-blue-50 text-blue-500 cursor-not-allowed'
                                                    : isFull
                                                        ? 'bg-red-50 text-red-500 cursor-not-allowed'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200'
                                            } disabled:opacity-70`}
                                    >
                                        {registeringId === event.id ? 'Securing Ticket...' :
                                            isPast ? 'Event Ended' :
                                                isUpcoming ? <><Hourglass className="w-5 h-5 mr-2" /> Opens Soon</> :
                                                    isFull ? 'Event Full' :
                                                        <><Ticket className="w-5 h-5 mr-2" /> Register Now</>}
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
            <RegistrationSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                eventName={registeredEventName}
            />
        </div>
    );
};

export default EventFeed;