import { useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Users, FileText, Type, PlusCircle, Activity } from 'lucide-react';
import api from '../../api/axiosConfig';

const AdminCreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', eventDate: '', eventTime: '', venue: '', maxParticipants: '',
        status: 'LIVE' 
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/events/create-event', {
                ...formData,
                maxParticipants: parseInt(formData.maxParticipants)
            });
            toast.success('Event successfully created!');
            // Reset form, keeping LIVE as default
            setFormData({ title: '', description: '', eventDate: '', eventTime: '', venue: '', maxParticipants: '', status: 'LIVE' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create New Event
                </h2>
            </div>

            <div className="p-6 md:p-8">
                <form onSubmit={handleCreateEvent} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Type className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" name="title" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.title} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" name="venue" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.venue} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* UPGRADED GRID: Now 4 columns to fit the Status Dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                <input type="date" name="eventDate" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.eventDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock className="h-5 w-5 text-gray-400" /></div>
                                <input type="time" name="eventTime" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.eventTime} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-5 w-5 text-gray-400" /></div>
                                <input type="number" name="maxParticipants" min="1" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.maxParticipants} onChange={handleChange} />
                            </div>
                        </div>

                        {/*Event Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Status</label>
                            <div className="relative">

                                {/* Left Icon */}
                                <Activity className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10 pointer-events-none" />

                                <select
                                    name="status"
                                    value={formData?.status || 'LIVE'}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer relative z-0"
                                >
                                    <option value="LIVE">🟢 Live (Open)</option>
                                    <option value="CLOSED">🛑 Closed</option>
                                    <option value="UPCOMING">⏳ Upcoming</option>
                                </select>

                                {/* Right Arrow Icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none"><FileText className="h-5 w-5 text-gray-400" /></div>
                            <textarea name="description" required rows="4" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isLoading} className="py-3 px-8 rounded-xl flex items-center justify-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-70">
                            {isLoading ? 'Creating...' : 'Publish Event'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminCreateEvent;