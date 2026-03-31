const TicketSkeleton = () => {
    return (
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">

            {/* Decorative Ticket Stub edge (Matching your real cards!) */}
            <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-r border-gray-100"></div>
            <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-l border-gray-100"></div>

            <div className="p-6">
                {/* Header Row (Status Pill & ID) */}
                <div className="flex justify-between items-start mb-6">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-md mt-1"></div>
                </div>

                {/* Event Title (Two lines) */}
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2"></div>

                {/* 3 Info Rows (Calendar, Clock, MapPin) */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                    </div>
                </div>

                {/* The Bottom Button */}
                <div className="w-full h-11 bg-gray-200 rounded-xl mt-2"></div>
            </div>
        </div>
    );
};

export default TicketSkeleton;