import { useState, useEffect } from 'react';
import { Image as ImageIcon, Calendar } from 'lucide-react';

const EventGallery = ({ images }) => {
    // Check if we have real images or just the backend placeholder
    const hasRealImages = images && images.length > 0 && !images[0].includes('placehold.co');

    // Default to the first real image if it exists
    const [activeImage, setActiveImage] = useState(hasRealImages ? images[0] : null);

    // Update active image if the props change
    useEffect(() => {
        if (hasRealImages) {
            setActiveImage(images[0]);
        }
    }, [images, hasRealImages]);

    // SLEEK FALLBACK UI: Minimalist, premium empty state
    if (!hasRealImages) {
        return (
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center relative group transition-all">
                {/* Subtle minimalist dot-grid background */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="relative z-10 flex flex-col items-center text-gray-400 group-hover:text-indigo-400 transition-colors duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
                        <ImageIcon className="w-7 h-7 text-gray-400 group-hover:text-indigo-500 transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">No Gallery Images</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Main Featured Image */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 relative group">
                <img
                    src={activeImage}
                    alt="Event Featured"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                    <ImageIcon className="w-3 h-3 mr-1.5" />
                    Gallery
                </div>
            </div>

            {/* Thumbnail Strip (Only show if more than 1 image) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-indigo-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventGallery;