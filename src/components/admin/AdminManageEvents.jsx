import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Users, Edit, Trash2, X, MapPin, Type, Clock, FileText, Save } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const AdminManageEvents = () => {
    const { user } = useAuth();
    const [myEvents, setMyEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Guest Modal States
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [guests, setGuests] = useState([]);
    const [guestsLoading, setGuestsLoading] = useState(false);

    // Edit Modal States (NEW)
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: '', title: '', description: '', eventDate: '', eventTime: '', venue: '', maxParticipants: '',
        status: 'LIVE' 
    });

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/events/get-all-events?page=0&size=100&t=${new Date().getTime()}`);
            const allEvents = response.data.content || response.data;
            const filteredEvents = allEvents.filter(event => event.createdBy === user.id);
            setMyEvents(filteredEvents);
        } catch (error) {
            toast.error('Failed to load your events.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you absolutely sure you want to delete this event? This cannot be undone.")) return;
        try {
            await api.delete(`/events/delete-event-by-id/${eventId}`);
            toast.success('Event deleted successfully');
            setMyEvents(myEvents.filter(event => event.id !== eventId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete event.');
        }
    };

    const handleViewGuests = async (event) => {
        setSelectedEvent(event);
        setShowGuestModal(true);
        setGuestsLoading(true);
        try {
            const response = await api.get(`/registrations/event/${event.id}`);
            setGuests(response.data);
        } catch (error) {
            toast.error('Failed to load guest list.');
        } finally {
            setGuestsLoading(false);
        }
    };

    // --- NEW EDIT FUNCTIONS ---
    const handleEditClick = (event) => {
        setEditFormData({
            id: event.id,
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            venue: event.venue,
            maxParticipants: event.maxParticipants,
            status: event.status || 'LIVE'
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await api.put(`/events/update-event-by-id/${editFormData.id}`, {
                title: editFormData.title,
                description: editFormData.description,
                eventDate: editFormData.eventDate,
                eventTime: editFormData.eventTime,
                venue: editFormData.venue,
                maxParticipants: parseInt(editFormData.maxParticipants),
                status: editFormData.status
            });

            toast.success('Event updated successfully!');
            setShowEditModal(false);
            fetchMyEvents(); // Refresh the grid to show the new data!
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update event.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-indigo-600 font-medium">Loading your events...</div>;
    }

    return (
        <div className="space-y-6 relative">

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the events you have published.</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold">
                    {myEvents.length} Total Events
                </div>
            </div>

            {/* Events Grid */}
            {myEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500">You haven't created any events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {myEvents.map(event => {
                        const current = event.currentParticipants || 0;
                        const max = event.maxParticipants || 0;

                        return (
                            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 pr-4">{event.title}</h3>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap">
                                            {current} / {max} Filled
                                        </span>
                                    </div>

                                    <div className="space-y-2 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-400" /> {event.eventDate}</div>
                                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-400" /> {event.venue}</div>
                                    </div>
                                </div>

                                {/* Admin Action Buttons */}
                                <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-3 gap-2">
                                    <button onClick={() => handleViewGuests(event)} className="flex items-center justify-center py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                        <Users className="w-4 h-4 mr-1.5" /> Guests
                                    </button>
                                    <button onClick={() => handleEditClick(event)} className="flex items-center justify-center py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Edit className="w-4 h-4 mr-1.5" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(event.id)} className="flex items-center justify-center py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- GUEST LIST MODAL (Unchanged) --- */}
            {showGuestModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Guest List: {selectedEvent?.title}
                            </h3>
                            <button onClick={() => setShowGuestModal(false)} className="text-white/70 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {guestsLoading ? (
                                <div className="text-center py-10 text-gray-500 animate-pulse">Loading guests...</div>
                            ) : guests.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">No one has registered for this event yet.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {guests.map((guest, index) => (
                                        <li key={guest.id} className="bg-white border border-gray-100 p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold mr-4 border border-indigo-50">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                        {guest.name || 'Unknown Student'}
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                                                            {guest.username || 'N/A'}
                                                        </span>
                                                    </p>
                                                    <p className={`text-xs mt-1 font-medium ${guest.status === 'REGISTERED' ? 'text-green-600' : 'text-red-500'}`}>
                                                        Status: {guest.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
                            <button onClick={() => setShowGuestModal(false)} className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NEW EDIT EVENT MODAL --- */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Edit className="w-5 h-5 mr-2" />
                                Edit Event
                            </h3>
                            <button onClick={() => setShowEditModal(false)} className="text-white/70 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[75vh] overflow-y-auto">
                            <form id="editForm" onSubmit={handleUpdateEvent} className="space-y-5">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Type className="h-4 w-4 text-gray-400" /></div>
                                            <input type="text" name="title" required className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.title} onChange={handleEditChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                            <input type="text" name="venue" required className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.venue} onChange={handleEditChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-4 w-4 text-gray-400" /></div>
                                            <input type="date" name="eventDate" required className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.eventDate} onChange={handleEditChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock className="h-4 w-4 text-gray-400" /></div>
                                            <input type="time" name="eventTime" required className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.eventTime} onChange={handleEditChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-4 w-4 text-gray-400" /></div>
                                            <input type="number" name="maxParticipants" min="1" required className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.maxParticipants} onChange={handleEditChange} />
                                        </div>
                                    </div>

                                    {/* NEW: Edit Status Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            required
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                                            value={editFormData.status}
                                            onChange={handleEditChange}
                                        >
                                            <option value="LIVE">🟢 Live</option>
                                            <option value="UPCOMING">⏳ Upcoming</option>
                                            <option value="PAST">🛑 Past</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none"><FileText className="h-4 w-4 text-gray-400" /></div>
                                        <textarea name="description" required rows="3" className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={editFormData.description} onChange={handleEditChange}></textarea>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="editForm" disabled={isUpdating} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-70">
                                {isUpdating ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminManageEvents;