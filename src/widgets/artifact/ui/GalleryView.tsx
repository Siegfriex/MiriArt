/**
 * @fileoverview 갤러리 뷰. images 그리드 표시. ArtifactViewer 내부에서 사용.
 * @참조 ArtifactViewer
 * @라우팅 (아티팩트 내부)
 * @상태 (직접 사용 안 함)
 */

import React from 'react';

/** 갤러리 이미지: id, url, label */
export interface GalleryImage {
  id: string;
  url: string;
  label: string;
}

/** 갤러리 뷰. images. @참조 ArtifactViewer */
export const GalleryView: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
       {images.map((img) => (
          <div key={img.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-tertiary border border-border-default">
             <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-text-primary font-medium">{img.label}</span>
             </div>
          </div>
       ))}
    </div>
  );
};