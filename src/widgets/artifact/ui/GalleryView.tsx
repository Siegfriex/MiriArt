import React from 'react';

export interface GalleryImage {
  id: string;
  url: string;
  label: string;
}

export const GalleryView: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
       {images.map((img) => (
          <div key={img.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-dark-900 border border-white/5">
             <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white font-medium">{img.label}</span>
             </div>
          </div>
       ))}
    </div>
  );
};