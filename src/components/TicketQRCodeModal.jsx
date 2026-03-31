import { X, Calendar, MapPin, Clock } from 'lucide-react';
import { QRCode } from 'react-qr-code';

const TicketQRCodeModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen || !ticket) return null;

    // We combine a few key details to embed securely in the QR code
    const qrData = JSON.stringify({
        id: ticket.id,
        event: ticket.eventTitle,
        status: ticket.status
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* The Ticket Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">

                {/* Purple Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-center relative overflow-hidden">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <h3 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Event Pass</h3>
                    <h2 className="text-2xl font-extrabold text-white leading-tight line-clamp-2">
                        {ticket.eventTitle || 'Utsav Setu Event'}
                    </h2>
                </div>

                {/* Ticket Details & QR */}
                <div className="p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50">

                    {/* The Actual QR Code */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block mb-6 transition-transform hover:scale-105 duration-300">
                        <QRCode
                            value={qrData}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#111827" // Very dark gray/black
                            level="H" // High error correction so it scans easily
                        />
                    </div>

                    <div className="space-y-3 text-left bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                            <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                            {ticket.eventDate ? ticket.eventDate.split('-').reverse().join('/') : 'Date TBA'}
                        </div>
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                            <Clock className="w-4 h-4 mr-3 text-indigo-500" />
                            {ticket.eventTime || 'Time TBA'}
                        </div>
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                            <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                            {ticket.venue || 'Venue TBA'}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-dashed border-gray-300">
                        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                            Ticket ID: <span className="text-gray-900 font-bold">{ticket.id.slice(-8)}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketQRCodeModal;