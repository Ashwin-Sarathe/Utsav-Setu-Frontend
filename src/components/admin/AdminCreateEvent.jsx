import { useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Users, FileText, Type, PlusCircle, Activity, Image as ImageIcon, X } from 'lucide-react';
import api from '../../api/axiosConfig';
import axios from 'axios'; 

const AdminCreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', eventDate: '', eventTime: '', venue: '', maxParticipants: '', status: 'LIVE'
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            toast.warning("You can only upload up to 5 images.");
            return;
        }
        setImageFiles(files);
    };

    const removeImage = (indexToRemove) => {
        setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let uploadedUrls = [];

            // 1. Upload images to Cloudinary if any are selected
            if (imageFiles.length > 0) {
                setUploadStatus('Uploading images to cloud...');

                const uploadPromises = imageFiles.map(async (file) => {
                    const cloudFormData = new FormData();
                    cloudFormData.append('file', file);
                    cloudFormData.append('upload_preset', 'utsav_setu_preset'); // Your unsigned preset

                    const res = await axios.post(
                        'https://api.cloudinary.com/v1_1/djlmcgpec/image/upload',
                        cloudFormData
                    );
                    return res.data.secure_url;
                });

                uploadedUrls = await Promise.all(uploadPromises);
            }

            setUploadStatus('Saving event details...');

            // 2. Send data to Spring Boot Backend
            await api.post('/events/create-event', {
                ...formData,
                maxParticipants: parseInt(formData.maxParticipants),
                imageUrls: uploadedUrls // Pass the array of strings
            });

            toast.success('Event successfully created!');

            // Reset form
            setFormData({ title: '', description: '', eventDate: '', eventTime: '', venue: '', maxParticipants: '', status: 'LIVE' });
            setImageFiles([]);

        } catch (error) {
            console.error("Creation Error:", error);
            toast.error(error.response?.data?.message || 'Failed to create event.');
        } finally {
            setIsLoading(false);
            setUploadStatus('');
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

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
                                <input type="date" name="eventDate" min={minDate} required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.eventDate} onChange={handleChange} />
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
                                    {/* <option value="CLOSED">🛑 Closed</option> */}
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

                    {/* --- NEW: Image Gallery Upload Section --- */}
                    <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2 text-indigo-500" />
                            Event Gallery Images (Optional, Max 5)
                        </label>

                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                                </div>
                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Image Preview Thumbnails */}
                        {imageFiles.length > 0 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {imageFiles.map((file, index) => (
                                    <div key={index} className="relative flex-shrink-0">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            {isLoading ? (uploadStatus || 'Processing...') : 'Publish Event'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminCreateEvent;