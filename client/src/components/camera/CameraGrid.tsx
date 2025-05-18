import { Photo } from "@shared/schema";
import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Camera, CameraOff } from "lucide-react";

interface CameraGridProps {
  photos: Photo[];
  selectedPhoto: Photo | null;
  onSelectPhoto: (photo: Photo) => void;
}

export function CameraGrid({ photos, selectedPhoto, onSelectPhoto }: CameraGridProps) {
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  
  const handleImageError = (photoId: number) => {
    setImageError(prev => ({ ...prev, [photoId]: true }));
  };
  
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CameraOff className="h-16 w-16 text-gray-600 mb-4" />
        <p className="text-lg text-gray-400">No photos available</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <Card 
          key={photo.id} 
          className={`bg-dark-800 border-gray-800 cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden ${
            selectedPhoto?.id === photo.id ? 'ring-2 ring-primary-500' : ''
          }`}
          onClick={() => onSelectPhoto(photo)}
        >
          <CardContent className="p-0 aspect-square relative">
            {imageError[photo.id] ? (
              <div className="absolute inset-0 bg-dark-900 flex flex-col items-center justify-center p-4">
                <Camera className="h-8 w-8 text-gray-600 mb-2" />
                <p className="text-sm text-gray-400 text-center">Image could not be loaded</p>
              </div>
            ) : (
              <img 
                src={photo.photoUrl} 
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(photo.id)}
              />
            )}
            <div className="absolute left-0 right-0 bottom-0 bg-black/70 text-white text-xs p-2">
              {photo.timestamp ? formatDateTime(photo.timestamp) : 'Unknown date'}
            </div>
            {photo.source && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                {photo.source === 'front_camera' ? 'Front' : 
                 photo.source === 'back_camera' ? 'Back' : photo.source}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}