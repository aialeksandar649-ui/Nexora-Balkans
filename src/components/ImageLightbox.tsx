import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onImageSelect?: (index: number) => void;
}

export default function ImageLightbox({ images, currentIndex, onClose, onNext, onPrevious, onImageSelect }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (onImageSelect) {
                  onImageSelect(index);
                }
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
