import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2 } from 'lucide-react';
import { Property } from '../types';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertyClick?: (property: Property) => void;
  center?: { lat: number; lng: number };
}

// Use property lat/lng if available, otherwise generate from location string
const getCoordinates = (property: Property): { lat: number; lng: number } => {
  if (property.lat != null && property.lng != null) {
    return { lat: Number(property.lat), lng: Number(property.lng) };
  }
  const location = property.location || '';
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = location.charCodeAt(i) + ((hash << 5) - hash);
  }
  if (location.length === 0) hash = 1;
  const minLat = 41.0, maxLat = 47.0, minLng = 13.0, maxLng = 23.0;
  const lat = minLat + (Math.abs(hash) % 1000) / 1000 * (maxLat - minLat);
  const lng = minLng + (Math.abs(hash * 7) % 1000) / 1000 * (maxLng - minLng);
  return { lat, lng };
};

/** OpenStreetMap embed URL for given center and zoom */
function getMapEmbedUrl(lat: number, lng: number): string {
  const pad = 0.02;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;
}

function MapContent({
  properties,
  selectedProperty,
  onPropertyClick,
  isFullscreen,
  onFullscreenChange,
}: MapViewProps & { isFullscreen: boolean; onFullscreenChange: (v: boolean) => void }) {
  const propertiesWithCoords = useMemo(() => {
    return properties.map((p) => ({ ...p, coordinates: getCoordinates(p) }));
  }, [properties]);

  const primary = selectedProperty ?? propertiesWithCoords[0];
  const { lat, lng } = primary ? getCoordinates(primary) : { lat: 43.85, lng: 18.39 };

  const mapContent = (
    <div className="relative w-full h-full min-h-[200px] sm:min-h-[280px] md:min-h-[350px] flex flex-col">
      {/* Location label - always visible */}
      {primary && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 px-2 py-1.5 sm:px-3 sm:py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-[calc(100%-5rem)]">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 m-0 truncate">
            {primary.location}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 m-0 mt-0.5 truncate">
            {primary.title}
          </p>
        </div>
      )}

      {/* Fullscreen toggle */}
      <button
        onClick={() => onFullscreenChange(!isFullscreen)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:px-3 sm:py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2 min-h-[40px]"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen map'}
      >
        {isFullscreen ? <X className="h-4 w-4" /> : <><Maximize2 className="h-4 w-4 sm:hidden" /><span className="hidden sm:inline">Fullscreen</span></>}
      </button>

      {/* OpenStreetMap embed - real map */}
      <div className="flex-1 min-h-0 w-full relative">
        <iframe
          src={getMapEmbedUrl(lat, lng)}
          className="w-full h-full min-h-[180px] sm:min-h-[250px] md:min-h-[300px] border-0 rounded-b-xl"
          title="Property location map"
          loading="lazy"
        />
      </div>

      {/* Property list (mobile, multiple properties) */}
      {propertiesWithCoords.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 max-h-[180px] overflow-y-auto md:hidden">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {properties.length} properties
          </div>
          <div className="space-y-2">
            {propertiesWithCoords.slice(0, 3).map((property) => (
              <button
                key={property.id}
                onClick={() => onPropertyClick?.(property)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {property.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {property.location}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return mapContent;
}

export default function MapView(props: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[9999] w-screen h-screen bg-white dark:bg-gray-900 safe-area-inset'
    : 'relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] xl:h-[600px] border border-gray-200 dark:border-gray-700';

  const content = (
    <div className={containerClass} role="application" aria-label="Property map">
      <MapContent {...props} isFullscreen={isFullscreen} onFullscreenChange={setIsFullscreen} />
    </div>
  );

  if (isFullscreen) {
    return createPortal(content, document.body);
  }
  return content;
}
