import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";

interface LeafletMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialAddress?: string;
}

export default function LeafletMapModal({
  isOpen,
  onClose,
  onLocationSelect,
  initialAddress = "",
}: LeafletMapModalProps) {
  const [address, setAddress] = useState(initialAddress);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 27.4712, // Default coordinates for Bhutan
    lng: 89.6339,
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fix Leaflet icon issues
  useEffect(() => {
    try {
      // Fix for Leaflet default marker icons
      const L2 = L as any; // Use any type to bypass TypeScript checking

      if (L2.Icon.Default.imagePath === undefined) {
        L2.Icon.Default.imagePath =
          "https://unpkg.com/leaflet@1.9.4/dist/images/";

        // Use a custom icon to make the marker more visible
        L2.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [30, 45], // Larger icon size
          iconAnchor: [15, 45], // Adjust anchor based on new size
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
      }
    } catch (error) {
      console.error("Error setting up Leaflet icons:", error);
      setMapError("Error loading map icons");
    }
  }, []);

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    try {
      console.log("Initializing map...");

      // Make sure we have Leaflet CSS
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(linkElement);

      const newMap = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([currentPosition.lat, currentPosition.lng], 15);

      console.log("Map created:", newMap);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(newMap);

      // Create a custom icon for better visibility
      const customIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [30, 45], // Larger icon size
        iconAnchor: [15, 45], // Adjust anchor based on new size
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add marker with custom icon
      const newMarker = L.marker([currentPosition.lat, currentPosition.lng], {
        draggable: true,
        icon: customIcon,
      }).addTo(newMap);

      // Set up map click event
      newMap.on("click", (e: L.LeafletMouseEvent) => {
        const clickedPosition = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        newMarker.setLatLng(e.latlng);
        setCurrentPosition(clickedPosition);

        // Reverse geocode to get address using Nominatim
        reverseGeocode(clickedPosition.lat, clickedPosition.lng);
      });

      // Set up marker drag event
      newMarker.on("dragend", () => {
        const position = newMarker.getLatLng();
        const newPosition = {
          lat: position.lat,
          lng: position.lng,
        };
        setCurrentPosition(newPosition);

        // Reverse geocode to get address
        reverseGeocode(newPosition.lat, newPosition.lng);
      });

      setMap(newMap);
      setMarker(newMarker);

      // Try to get user's current location if supported
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            newMap.setView([pos.lat, pos.lng], 15);
            newMarker.setLatLng([pos.lat, pos.lng]);
            setCurrentPosition(pos);

            // Reverse geocode to get address
            reverseGeocode(pos.lat, pos.lng);
          },
          () => {
            console.log("Error: The Geolocation service failed.");
          }
        );
      }

      // Recalculate map size when the modal is opened
      // This is important for proper map rendering in modals
      setTimeout(() => {
        newMap.invalidateSize();
        console.log("Map size invalidated");
      }, 100);

      // Cleanup function
      return () => {
        console.log("Removing map...");
        if (newMap) {
          newMap.remove();
        }
        document.head.removeChild(linkElement);
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        `Error initializing map: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [isOpen]);

  // Function to reverse geocode using Nominatim (OpenStreetMap's service)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to search for an address
  const handleSearch = async () => {
    if (!map || !marker || !address) return;

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };

        map.setView([location.lat, location.lng], 15);
        marker.setLatLng([location.lat, location.lng]);
        setCurrentPosition(location);
        setAddress(data[0].display_name);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("Error searching for location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search when Enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Handle confirming the selected location
  const handleConfirm = () => {
    onLocationSelect({
      address,
      lat: currentPosition.lat,
      lng: currentPosition.lng,
    });
    onClose();
  };

  // Check if we're in a browser environment before using createPortal
  if (typeof window === "undefined" || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-medium">Select Location</h2>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2">
            <input
              ref={searchInputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a location"
              className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-3 sm:px-4 py-2 bg-primary text-white text-sm sm:text-base rounded-md hover:bg-primary/90 disabled:bg-gray-400 whitespace-nowrap"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Map container with explicit height */}
        <div className="flex-1 p-3 sm:p-4 min-h-[250px] sm:min-h-[350px]">
          {mapError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-red-500">{mapError}</p>
            </div>
          ) : (
            <div
              ref={mapRef}
              className="w-full h-full rounded-md"
              style={{ height: "300px", minHeight: "250px" }} // Explicit height
            />
          )}
        </div>

        {/* Footer - Simplified */}
        <div className="p-3 sm:p-4 border-t">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500">
              <p>Drag the marker or click on the map to select a location</p>
            </div>
            <div className="flex gap-2 justify-end sm:flex-shrink-0">
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-md hover:bg-primary/90"
                disabled={!address}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
