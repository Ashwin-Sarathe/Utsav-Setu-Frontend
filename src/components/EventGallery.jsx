import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const EventGallery = ({ images }) => {
    const [activeImage, setActiveImage] = useState(images?.[0]);

    if (!images || images.length === 0) return null;

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