import { useState } from "react";
import dynamic from "next/dynamic";

interface LocationInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMapClick?: () => void;
  error?: string;
}

// Dynamically import the map modal with no SSR
// This is necessary because Leaflet requires window access
const LeafletMapModal = dynamic(() => import("../map-modal/LeafletMapModal"), {
  ssr: false,
});

export default function LocationInput({
  value,
  onChange,
  onMapClick,
  error,
}: LocationInputProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Simulate an input change event to update parent state
  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    // Store coordinates for future use (optional)
    setCoordinates({ lat: location.lat, lng: location.lng });

    // Create a synthetic event to pass to onChange
    const syntheticEvent = {
      target: {
        name: "location",
        value: location.address,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const openMap = () => {
    setIsMapOpen(true);
    // Also call the original onMapClick if provided
    if (onMapClick) {
      onMapClick();
    }
  };

  return (
    <div>
      <label className="text-text font-normal block mb-2 md:mb-3">
        Location
      </label>
      <input
        type="text"
        name="location"
        placeholder="Ex: Below Changangkha Lhakhang"
        value={value}
        onChange={onChange}
        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border focus:outline-none focus:border-primary ${
          error ? "border-red-500" : "border-text/40"
        }`}
      />

      {/* Responsive button layout */}
      <div className="flex mt-2 justify-end sm:mt-3">
        <button
          type="button"
          className="bg-white border border-gray-300 rounded-md px-3 py-2 md:px-4 md:py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          onClick={openMap}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e07c35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-map-pin"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[#e07c35] md:text-base">Locate on Map</span>
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Map Modal */}
      {isMapOpen && (
        <LeafletMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
          initialAddress={value}
        />
      )}
    </div>
  );
}
